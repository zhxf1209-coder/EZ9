import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prepare } from '../models/dbhelper.js'
import { generateToken } from '../middleware/auth.js'
import { getDb } from '../models/db.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' })
    }

    const existingUser = prepare('SELECT id FROM users WHERE username = ?').get(username)
    if (existingUser) {
      return res.status(400).json({ error: '用户名已存在' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const db = getDb()
    
    // 直接使用数据库实例
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword])
    
    // 获取刚插入的用户 ID
    const userResult = db.exec("SELECT last_insert_rowid() as id")
    const userId = userResult[0]?.values[0]?.[0] as number

    // 插入 settings
    db.run('INSERT INTO settings (user_id) VALUES (?)', [userId])

    res.json({ message: '注册成功', userId: userId })
  } catch (err: any) {
    console.error('注册错误:', err)
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: '用户名已存在' })
    }
    res.status(500).json({ error: '注册失败: ' + err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' })
    }
    
    const user = prepare('SELECT * FROM users WHERE username = ?').get(username) as any

    if (!user) {
      return res.status(401).json({ error: '用户不存在' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: '密码错误' })
    }

    const token = generateToken(user.id)
    res.json({ token, user: { id: user.id, username: user.username } })
  } catch (err: any) {
    console.error('登录错误:', err)
    res.status(500).json({ error: '登录失败: ' + err.message })
  }
})

export default router
