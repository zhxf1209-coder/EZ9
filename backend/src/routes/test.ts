import { Router } from 'express'
import { callDoubao, callMinimax } from '../services/ai.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { aiProvider, apiKey, modelName } = req.body

    if (!apiKey) {
      return res.status(400).json({ success: false, error: '请提供API密钥' })
    }

    const testPrompt = '请回复"测试成功"，只需回复这四个字，不要有其他内容。'

    let result: string
    if (aiProvider === 'doubao') {
      result = await callDoubao(testPrompt, apiKey, modelName)
    } else if (aiProvider === 'minimax') {
      result = await callMinimax(testPrompt, apiKey, modelName)
    } else {
      return res.status(400).json({ success: false, error: '不支持的AI提供商' })
    }

    if (result && result.includes('测试成功')) {
      res.json({ success: true, message: 'API连接成功！' })
    } else {
      res.json({ success: true, message: 'API连接成功（响应正常）' })
    }
  } catch (err: any) {
    console.error('API测试失败:', err)
    res.status(400).json({
      success: false,
      error: err.message || 'API连接失败，请检查密钥和模型名称是否正确'
    })
  }
})

export default router
