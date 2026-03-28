import { Router } from 'express'
import db from '../models/dbhelper.js'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'

const router = Router()

router.get('/contact', (req, res) => {
  const stmt = db.prepare("SELECT config_key, config_value FROM site_config WHERE config_key IN ('wechat_qrcode', 'contact_text', 'contact_title')")
  const configs = stmt.all() as any[]
  
  const result: Record<string, string> = {}
  configs.forEach(item => {
    result[item.config_key] = item.config_value
  })
  
  res.json({
    wechatQrcode: result.wechat_qrcode || '',
    contactText: result.contact_text || '',
    contactTitle: result.contact_title || '添加专家咨询更多内容'
  })
})

router.get('/', authMiddleware, (req: AuthRequest, res) => {
  console.log('读取设置，用户ID:', req.userId)
  const stmt = db.prepare('SELECT ai_provider, api_key, model_name FROM settings WHERE user_id = ?')
  const settings = stmt.get(req.userId) as any
  console.log('数据库返回:', settings)
  res.json({
    aiProvider: settings?.ai_provider || 'doubao',
    apiKey: settings?.api_key || '',
    modelName: settings?.model_name || ''
  })
})

router.put('/', authMiddleware, (req: AuthRequest, res) => {
  const { aiProvider, apiKey, modelName } = req.body
  console.log('保存设置，用户ID:', req.userId, '数据:', { aiProvider, apiKey: apiKey ? '***' : '空', modelName })

  const checkStmt = db.prepare('SELECT id FROM settings WHERE user_id = ?')
  const existing = checkStmt.get(req.userId)

  if (existing) {
    const stmt = db.prepare('UPDATE settings SET ai_provider = ?, api_key = ?, model_name = ? WHERE user_id = ?')
    stmt.run(aiProvider, apiKey, modelName || '', req.userId)
  } else {
    const stmt = db.prepare('INSERT INTO settings (user_id, ai_provider, api_key, model_name) VALUES (?, ?, ?, ?)')
    stmt.run(req.userId, aiProvider, apiKey, modelName || '')
  }

  res.json({ message: '设置已保存' })
})

export default router
