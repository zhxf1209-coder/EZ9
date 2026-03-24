import { Router } from 'express'
import db from '../models/dbhelper.js'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'

const router = Router()

router.get('/', authMiddleware, (req: AuthRequest, res) => {
  const stmt = db.prepare('SELECT * FROM history WHERE user_id = ? ORDER BY created_at DESC')
  const records = stmt.all(req.userId)
  res.json(records)
})

router.post('/', authMiddleware, (req: AuthRequest, res) => {
  const { 
    type = 'full',
    birthDate = '',
    birthTime = '',
    gender = 'male',
    partnerBirthDate = null,
    partnerBirthTime = null,
    partnerGender = null,
    baziData = null,
    aiResult = ''
  } = req.body || {}
  
  const stmt = db.prepare(`
    INSERT INTO history (user_id, type, birth_date, birth_time, gender, partner_birth_date, partner_birth_time, partner_gender, bazi_data, ai_result)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  try {
    const result = stmt.run(
      req.userId, 
      type, 
      birthDate || '', 
      birthTime || '', 
      gender || 'male',
      partnerBirthDate || null,
      partnerBirthTime || null,
      partnerGender || null,
      baziData ? JSON.stringify(baziData) : null,
      aiResult || ''
    )
    res.json({ id: result.lastInsertRowid })
  } catch (err) {
    console.error('保存历史记录失败:', err)
    res.status(500).json({ error: '保存历史记录失败' })
  }
})

router.get('/:id', authMiddleware, (req: AuthRequest, res) => {
  const stmt = db.prepare('SELECT * FROM history WHERE id = ? AND user_id = ?')
  const record = stmt.get(req.params.id, req.userId)
  if (!record) return res.status(404).json({ error: '记录不存在' })
  res.json(record)
})

router.delete('/:id', authMiddleware, (req: AuthRequest, res) => {
  const stmt = db.prepare('DELETE FROM history WHERE id = ? AND user_id = ?')
  stmt.run(req.params.id, req.userId)
  res.json({ message: '已删除' })
})

export default router
