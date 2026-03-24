import { Router } from 'express'
import db from '../models/dbhelper.js'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'

const router = Router()

router.get('/', authMiddleware, (req: AuthRequest, res) => {
  const stmt = db.prepare('SELECT * FROM profiles WHERE user_id = ? ORDER BY updated_at DESC')
  const profiles = stmt.all(req.userId)
  res.json(profiles)
})

router.get('/:id', authMiddleware, (req: AuthRequest, res) => {
  const stmt = db.prepare('SELECT * FROM profiles WHERE id = ? AND user_id = ?')
  const profile = stmt.get(req.params.id, req.userId)
  if (!profile) return res.status(404).json({ error: '档案不存在' })
  res.json(profile)
})

router.post('/', authMiddleware, (req: AuthRequest, res) => {
  const { name, gender, birth_date, birth_time, location } = req.body
  if (!birth_date || !birth_time) {
    return res.status(400).json({ error: '请提供完整的出生信息' })
  }
  const stmt = db.prepare(`
    INSERT INTO profiles (user_id, name, gender, birth_date, birth_time, location)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  const result = stmt.run(req.userId, name || '本人', gender, birth_date, birth_time, JSON.stringify(location || {}))
  res.json({ id: result.lastInsertRowid, message: '档案创建成功' })
})

router.put('/:id', authMiddleware, (req: AuthRequest, res) => {
  const { name, gender, birth_date, birth_time, location } = req.body
  const checkStmt = db.prepare('SELECT id FROM profiles WHERE id = ? AND user_id = ?')
  const existing = checkStmt.get(req.params.id, req.userId)
  if (!existing) return res.status(404).json({ error: '档案不存在' })

  const stmt = db.prepare(`
    UPDATE profiles
    SET name = ?, gender = ?, birth_date = ?, birth_time = ?, location = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `)
  stmt.run(name, gender, birth_date, birth_time, JSON.stringify(location || {}), req.params.id, req.userId)
  res.json({ message: '档案更新成功' })
})

router.delete('/:id', authMiddleware, (req: AuthRequest, res) => {
  const stmt = db.prepare('DELETE FROM profiles WHERE id = ? AND user_id = ?')
  stmt.run(req.params.id, req.userId)
  res.json({ message: '档案已删除' })
})

export default router
