import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import authRoutes from './routes/auth.js'
import baziRoutes from './routes/bazi.js'
import fortuneRoutes from './routes/fortune.js'
import aiRoutes from './routes/ai.js'
import settingsRoutes from './routes/settings.js'
import historyRoutes from './routes/history.js'
import testRoutes from './routes/test.js'
import profilesRoutes from './routes/profiles.js'
import { initDB, getDb } from './models/db.js'
import { setDb } from './models/dbhelper.js'
import {
  rateLimiter,
  authRateLimiter,
  securityHeaders,
  sanitizeInput,
  checkRequestSize
} from './middleware/security.js'

config()

const app = express()
const PORT = process.env.PORT || 3001

// 安全中间件
app.use(securityHeaders)
app.use(checkRequestSize(500 * 1024)) // 限制请求体大小为 500KB

// CORS 配置 - 生产环境应该限制允许的源
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()) || 
                        (process.env.NODE_ENV === 'production' ? [] : ['http://localhost:3000'])

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? allowedOrigins
    : true,
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use(express.json({ limit: '500kb' }))
app.use(sanitizeInput) // 输入清理
app.use(rateLimiter()) // 全局速率限制

async function startServer() {
  await initDB()
  const db = getDb()
  setDb(db)

  // 路由 - 认证路由使用更严格的速率限制
  app.use('/api/auth', authRateLimiter, authRoutes)
  app.use('/api/bazi', baziRoutes)
  app.use('/api/fortune', fortuneRoutes)
  app.use('/api/ai', aiRoutes)
  app.use('/api/settings', settingsRoutes)
  app.use('/api/history', historyRoutes)
  app.use('/api/test', testRoutes)
  app.use('/api/profiles', profilesRoutes)

  // 全局错误处理
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('服务器错误:', err)
    res.status(500).json({ error: '服务器内部错误' })
  })

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

startServer()
