import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { calculateBazi } from '../services/bazi.js'
import { analyzeWithAI, analyzeWithAIStream, generateMarriageReport } from '../services/ai.js'
import db from '../models/dbhelper.js'

const router = Router()

router.post('/interpret', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { 
      profileId,
      name,
      birthDate, 
      birthTime, 
      gender, 
      type, 
      partnerBirthDate, 
      partnerBirthTime, 
      partnerGender,
      partnerProfileId,
      partnerName,
      year, 
      stream,
      location 
    } = req.body

    const stmt = db.prepare('SELECT ai_provider, api_key FROM settings WHERE user_id = ?')
    const settings = stmt.get(req.userId) as any

    if (!settings?.api_key) {
      return res.status(400).json({ error: '请先在设置中配置AI API密钥' })
    }

    let finalBirthDate = birthDate
    let finalBirthTime = birthTime
    let finalGender = gender
    let finalLocation = location
    let finalName = name

    if (profileId) {
      const profileStmt = db.prepare('SELECT * FROM profiles WHERE id = ? AND user_id = ?')
      const profile = profileStmt.get(profileId, req.userId) as any
      
      if (profile) {
        finalBirthDate = profile.birth_date
        finalBirthTime = profile.birth_time
        finalGender = profile.gender
        finalName = profile.name
        if (profile.location) {
          try {
            finalLocation = JSON.parse(profile.location)
          } catch (e) {
            finalLocation = location || {}
          }
        }
      }
    }

    let finalPartnerBirthDate = partnerBirthDate
    let finalPartnerBirthTime = partnerBirthTime
    let finalPartnerGender = partnerGender
    let finalPartnerName = partnerName

    if (partnerProfileId) {
      const partnerProfileStmt = db.prepare('SELECT * FROM profiles WHERE id = ? AND user_id = ?')
      const partnerProfile = partnerProfileStmt.get(partnerProfileId, req.userId) as any
      
      if (partnerProfile) {
        finalPartnerBirthDate = partnerProfile.birth_date
        finalPartnerBirthTime = partnerProfile.birth_time
        finalPartnerGender = partnerProfile.gender
        finalPartnerName = partnerProfile.name
      }
    }

    const baziData = calculateBazi(finalBirthDate, finalBirthTime, finalGender)
    let partnerBaziData = null
    if (finalPartnerBirthDate && finalPartnerBirthTime && finalPartnerGender) {
      partnerBaziData = calculateBazi(finalPartnerBirthDate, finalPartnerBirthTime, finalPartnerGender)
    }

    const config = { provider: settings.ai_provider, apiKey: settings.api_key }

    // 婚姻合婚特殊处理
    if (type === 'marriage' && partnerBaziData) {
      const marriageResult = await generateMarriageReport(baziData, partnerBaziData, config)
      res.json({
        type: 'marriage',
        content: marriageResult,
        bazi: baziData,
        partnerBazi: partnerBaziData,
        profileId: profileId,
        partnerProfileId: partnerProfileId,
        location: finalLocation,
        name: finalName,
        partnerName: finalPartnerName
      })
      return
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      const generator = analyzeWithAIStream(type, baziData, config, partnerBaziData, year)
      for await (const chunk of generator) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
      }
      res.write('data: [DONE]\n\n')
      res.end()
    } else {
      const result = await analyzeWithAI(type, baziData, config, partnerBaziData, year)
      res.json({ 
        content: result, 
        bazi: baziData, 
        partnerBazi: partnerBaziData,
        profileId: profileId,
        partnerProfileId: partnerProfileId,
        location: finalLocation,
        name: finalName,
        partnerName: finalPartnerName
      })
    }
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: err.message || 'AI分析失败' })
  }
})

export default router
