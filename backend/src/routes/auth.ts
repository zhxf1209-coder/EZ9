import { Router } from 'express'
import bcrypt from 'bcryptjs'
import db from '../models/dbhelper.js'
import { generateToken } from '../middleware/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)')
    const result = stmt.run(username, hashedPassword)

    const settingsStmt = db.prepare('INSERT INTO settings (user_id) VALUES (?)')
    settingsStmt.run(result.lastInsertRowid)

    res.json({ message: '注册成功' })
  } catch (err: any) {
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: '用户名已存在' })
    }
    res.status(500).json({ error: '注册失败' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?')
    const user = stmt.get(username) as any

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const token = generateToken(user.id)
    res.json({ token, user: { id: user.id, username: user.username } })
  } catch {
    res.status(500).json({ error: '登录失败' })
  }
})

export default router
