import { Router } from 'express'
import { calculateBazi } from '../services/bazi.js'
import { calculateFortuneKline, generateKeyEvents } from '../services/fortune.js'
import { validateBaziInput } from '../middleware/security.js'
import db from '../models/dbhelper.js'

const router = Router()

router.post('/kline', validateBaziInput, (req, res) => {
  try {
    const { profileId, birthDate, birthTime, gender, startYear, endYear } = req.body

    let finalBirthDate = birthDate
    let finalBirthTime = birthTime
    let finalGender = gender

    if (profileId) {
      const stmt = db.prepare('SELECT birth_date, birth_time, gender FROM profiles WHERE id = ?')
      const profile = stmt.get(profileId) as any
      
      if (profile) {
        finalBirthDate = profile.birth_date
        finalBirthTime = profile.birth_time
        finalGender = profile.gender
      }
    }

    const bazi = calculateBazi(finalBirthDate, finalBirthTime, finalGender)
    const currentYear = new Date().getFullYear()
    const birthYear = parseInt(finalBirthDate.split('-')[0])
    const start = startYear || birthYear
    const end = endYear || currentYear + 30
    const data = calculateFortuneKline(bazi, start, end)
    const events = generateKeyEvents(bazi, data, birthYear)
    res.json({ data, events, bazi, birthYear, profileId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '运势计算失败' })
  }
})

export default router
