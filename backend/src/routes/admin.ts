import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prepare, run, getAll } from '../models/dbhelper.js'
import { generateToken, verifyToken } from '../middleware/auth.js'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' })
    }
    
    const admin = prepare('SELECT * FROM admins WHERE username = ?').get(username) as any

    if (!admin) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const passwordMatch = await bcrypt.compare(password, admin.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const token = generateToken(admin.id, 'admin')
    res.json({ 
      token, 
      admin: { 
        id: admin.id, 
        username: admin.username 
      } 
    })
  } catch (err: any) {
    console.error('Admin login error:', err)
    res.status(500).json({ error: '登录失败: ' + err.message })
  }
})

router.get('/config', (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未授权访问' })
    }

    const configs = getAll('SELECT config_key, config_value FROM site_config')
    
    const configObj: Record<string, string> = {}
    for (const config of configs) {
      configObj[config.config_key as string] = config.config_value as string
    }
    
    res.json(configObj)
  } catch (err: any) {
    console.error('Get config error:', err)
    res.status(500).json({ error: '获取配置失败: ' + err.message })
  }
})

router.post('/config', (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未授权访问' })
    }

    const { wechat_qrcode, contact_text, contact_title } = req.body
    
    if (wechat_qrcode !== undefined) {
      run('UPDATE site_config SET config_value = ?, updated_at = CURRENT_TIMESTAMP WHERE config_key = ?', 
        [wechat_qrcode, 'wechat_qrcode'])
    }
    if (contact_text !== undefined) {
      run('UPDATE site_config SET config_value = ?, updated_at = CURRENT_TIMESTAMP WHERE config_key = ?', 
        [contact_text, 'contact_text'])
    }
    if (contact_title !== undefined) {
      run('UPDATE site_config SET config_value = ?, updated_at = CURRENT_TIMESTAMP WHERE config_key = ?', 
        [contact_title, 'contact_title'])
    }
    
    res.json({ message: '配置更新成功' })
  } catch (err: any) {
    console.error('Update config error:', err)
    res.status(500).json({ error: '更新配置失败: ' + err.message })
  }
})

router.get('/stats', (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未授权访问' })
    }

    const userCount = prepare('SELECT COUNT(*) as count FROM users').get() as any
    const historyCount = prepare('SELECT COUNT(*) as count FROM history').get() as any
    const profileCount = prepare('SELECT COUNT(*) as count FROM profiles').get() as any
    
    res.json({
      users: userCount?.count || 0,
      histories: historyCount?.count || 0,
      profiles: profileCount?.count || 0
    })
  } catch (err: any) {
    console.error('Get stats error:', err)
    res.status(500).json({ error: '获取统计数据失败: ' + err.message })
  }
})

export default router
