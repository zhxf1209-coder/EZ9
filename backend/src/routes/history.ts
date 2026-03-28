import { Router } from 'express'
import db from '../models/dbhelper.js'
import jwt from 'jsonwebtoken'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'bazi-fortune-secret-key'

function getUserIdFromToken(req: any): number | null {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.slice(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
    return decoded.userId
  } catch {
    return null
  }
}

function getGuestUserId(): number {
  try {
    const result = db.prepare("SELECT id FROM users WHERE username = 'guest'").get() as { id: number } | undefined
    return result?.id || 1
  } catch {
    return 1
  }
}

router.get('/', (req, res) => {
  const page = parseInt(req.query.page as string) || 1
  const pageSize = parseInt(req.query.pageSize as string) || 15
  const type = req.query.type as string | undefined
  
  const userId = getUserIdFromToken(req)
  if (!userId) {
    return res.status(401).json({ error: '请先登录' })
  }
  
  const offset = (page - 1) * pageSize
  
  let whereClause = 'WHERE user_id = ?'
  const params: any[] = [userId]
  
  if (type) {
    if (type === 'bazi') {
      whereClause += ' AND type IN (?, ?, ?, ?, ?, ?)'
      params.push('full', 'daily', 'yearly', 'personality', 'wealth', 'remedy')
    } else if (type === 'marriage') {
      whereClause += ' AND type = ?'
      params.push('marriage')
    }
  }
  
  const countStmt = db.prepare(`SELECT COUNT(*) as total FROM history ${whereClause}`)
  const countResult = countStmt.get(...params)
  const total = countResult?.total || 0
  
  const stmt = db.prepare(`SELECT * FROM history ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
  const records = stmt.all(...params, pageSize, offset)
  
  res.json({
    records,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  })
})

router.post('/', (req, res) => {
  const userId = getUserIdFromToken(req) || getGuestUserId()
  
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
  
  const baziDataStr = baziData ? (typeof baziData === 'string' ? baziData : JSON.stringify(baziData)) : null
  const aiResultStr = aiResult ? (typeof aiResult === 'string' ? aiResult : JSON.stringify(aiResult)) : ''
  
  console.log('保存历史记录参数:', { userId, type, birthDate, birthTime, baziDataType: typeof baziData, baziDataStr: baziDataStr ? 'exists' : 'null' })
  
  const stmt = db.prepare(`
    INSERT INTO history (user_id, type, birth_date, birth_time, gender, partner_birth_date, partner_birth_time, partner_gender, bazi_data, ai_result)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  try {
    const result = stmt.run(
      userId, 
      type, 
      birthDate || '', 
      birthTime || '', 
      gender || 'male',
      partnerBirthDate || null,
      partnerBirthTime || null,
      partnerGender || null,
      baziDataStr,
      aiResultStr
    )
    console.log('历史记录保存成功:', { id: result.lastInsertRowid, userId, type })
    res.json({ id: result.lastInsertRowid, userId })
  } catch (err: any) {
    console.error('保存历史记录失败:', err)
    res.status(500).json({ error: '保存历史记录失败: ' + err.message })
  }
})

router.get('/:id', (req, res) => {
  const userId = getUserIdFromToken(req)
  if (!userId) {
    return res.status(401).json({ error: '请先登录' })
  }
  
  const stmt = db.prepare('SELECT * FROM history WHERE id = ? AND user_id = ?')
  const record = stmt.get(req.params.id, userId)
  if (!record) return res.status(404).json({ error: '记录不存在' })
  res.json(record)
})

router.delete('/:id', (req, res) => {
  const userId = getUserIdFromToken(req)
  if (!userId) {
    return res.status(401).json({ error: '请先登录' })
  }
  
  const stmt = db.prepare('DELETE FROM history WHERE id = ? AND user_id = ?')
  stmt.run(req.params.id, userId)
  res.json({ message: '已删除' })
})

export default router
