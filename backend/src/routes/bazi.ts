import { Router } from 'express'
import { calculateBazi } from '../services/bazi.js'
import { generateBaziReport } from '../services/ai.js'
import db from '../models/dbhelper.js'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { validateBaziInput } from '../middleware/security.js'

const router = Router()

router.post('/analyze', validateBaziInput, (req, res) => {
  try {
    const { birthDate, birthTime, gender } = req.body
    if (!birthDate || !birthTime || !gender) {
      return res.status(400).json({ error: '请提供完整的出生信息' })
    }
    const result = calculateBazi(birthDate, birthTime, gender)
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '八字计算失败' })
  }
})

router.post('/report', authMiddleware, validateBaziInput, async (req: AuthRequest, res) => {
  try {
    const { birthDate, birthTime, gender, location, apiKey, aiProvider, modelName } = req.body
    if (!birthDate || !birthTime || !gender) {
      return res.status(400).json({ error: '请提供完整的出生信息' })
    }

    const baziData = calculateBazi(birthDate, birthTime, gender)

    let userApiKey = apiKey
    let provider = aiProvider || 'doubao'
    let model = modelName

    if (!userApiKey) {
      const stmt = db.prepare('SELECT ai_provider, api_key, model_name FROM settings WHERE user_id = ?')
      const settings = stmt.get(req.userId) as any
      userApiKey = settings?.api_key || 'c671b870-ec9c-4118-a7c4-99d6b2e31d02'
      provider = settings?.ai_provider || 'doubao'
      model = settings?.model_name || modelName
      console.log('从数据库读取设置:', { provider, apiKey: userApiKey ? '已配置' : '使用默认', model })
    }

    console.log('开始生成报告，使用配置:', { provider, apiKeyLength: userApiKey.length, model })

    const report = await generateBaziReport(baziData, { provider: provider as 'doubao' | 'minimax', apiKey: userApiKey, model })

    res.json({
      ...report,
      bazi: baziData,
      location
    })
  } catch (err) {
    console.error('生成报告失败:', err)
    res.status(500).json({ error: '生成报告失败' })
  }
})

export default router
