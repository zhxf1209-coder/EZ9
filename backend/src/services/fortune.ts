import { BaziResult } from './bazi.js'

// 关键事件类型
export interface KeyEvent {
  year: number
  type: 'good' | 'neutral' | 'caution'
  title: string
  description: string
}

// 计算某年的流年运势分数
function calculateYearScore(bazi: BaziResult, year: number): number {
  const yearGanZhi = getYearGanZhi(year)
  const dayMaster = bazi.dayMaster

  // 基础分数
  let score = 50

  // 根据流年与日主的关系调整分数
  const yearGan = yearGanZhi[0]
  const yearZhi = yearGanZhi[1]

  // 五行生克关系
  const wuxingRelation = getWuxingRelation(bazi.dayMasterWuxing, getWuxing(yearGan))
  score += wuxingRelation * 10

  // 地支关系
  const zhiRelation = getDizhiRelation(bazi.diZhi[2], yearZhi)
  score += zhiRelation * 8

  // 大运影响
  const daYun = bazi.daYun.find(dy => {
    const currentAge = year - parseInt(bazi.lunar.year.toString())
    return currentAge >= dy.startAge && currentAge <= dy.endAge
  })
  if (daYun) {
    const daYunRelation = getWuxingRelation(bazi.dayMasterWuxing, daYun.wuxing)
    score += daYunRelation * 5
  }

  // 添加随机波动使曲线更自然
  score += Math.sin(year * 0.5) * 5

  return Math.max(20, Math.min(95, Math.round(score)))
}

function getYearGanZhi(year: number): string {
  const ganIndex = (year - 4) % 10
  const zhiIndex = (year - 4) % 12
  const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  return gan[ganIndex] + zhi[zhiIndex]
}

function getWuxing(char: string): string {
  const map: Record<string, string> = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' }
  return map[char] || '土'
}

function getWuxingRelation(a: string, b: string): number {
  // 生我为正，克我为负
  const sheng: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' }
  const ke: Record<string, string> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' }

  if (sheng[b] === a) return 2  // 生我
  if (sheng[a] === b) return 1  // 我生
  if (ke[b] === a) return -2    // 克我
  if (ke[a] === b) return -1    // 我克
  if (a === b) return 1         // 同类
  return 0
}

function getDizhiRelation(a: string, b: string): number {
  // 六合
  const liuhe = [['子', '丑'], ['寅', '亥'], ['卯', '戌'], ['辰', '酉'], ['巳', '申'], ['午', '未']]
  // 六冲
  const liuchong = [['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥']]

  for (const pair of liuhe) {
    if ((pair[0] === a && pair[1] === b) || (pair[1] === a && pair[0] === b)) return 2
  }
  for (const pair of liuchong) {
    if ((pair[0] === a && pair[1] === b) || (pair[1] === a && pair[0] === b)) return -2
  }
  return 0
}

export interface FortuneData {
  year: number
  score: number
  ganZhi: string
  description: string
}

export function calculateFortuneKline(bazi: BaziResult, startYear: number, endYear: number): FortuneData[] {
  const result: FortuneData[] = []

  for (let year = startYear; year <= endYear; year++) {
    const score = calculateYearScore(bazi, year)
    const ganZhi = getYearGanZhi(year)

    let description = ''
    if (score >= 80) description = '大吉之年，诸事顺遂'
    else if (score >= 65) description = '吉年，运势平稳向上'
    else if (score >= 50) description = '平年，宜守不宜进'
    else if (score >= 35) description = '小凶，需谨慎行事'
    else description = '凶年，宜静不宜动'

    result.push({ year, score, ganZhi, description })
  }

  return result
}

// 生成关键人生事件
export function generateKeyEvents(bazi: BaziResult, fortuneData: FortuneData[], birthYear: number): KeyEvent[] {
  const events: KeyEvent[] = []
  const currentYear = new Date().getFullYear()

  // 分析大运转换点
  bazi.daYun.forEach((dy, index) => {
    const eventYear = birthYear + dy.startAge
    if (eventYear >= birthYear && eventYear <= currentYear + 30) {
      const isGoodDaYun = getWuxingRelation(bazi.dayMasterWuxing, dy.wuxing) > 0
      events.push({
        year: eventYear,
        type: isGoodDaYun ? 'good' : 'neutral',
        title: `${dy.ganZhi}运起`,
        description: `进入${dy.ganZhi}大运，${isGoodDaYun ? '运势向好，可积极进取' : '运势平稳，宜稳中求进'}`
      })
    }
  })

  // 找出运势高峰和低谷
  const sortedByScore = [...fortuneData].sort((a, b) => b.score - a.score)
  const peaks = sortedByScore.slice(0, 3)
  const valleys = sortedByScore.slice(-3)

  // 添加高峰事件
  peaks.forEach(peak => {
    if (peak.score >= 75 && !events.find(e => e.year === peak.year)) {
      const age = peak.year - birthYear
      let title = '运势高峰'
      let description = '此年运势极佳，'

      if (age >= 22 && age <= 35) {
        title = '事业良机'
        description += '适合事业发展、创业投资'
      } else if (age >= 25 && age <= 40) {
        title = '姻缘佳期'
        description += '感情运势旺盛，利于婚恋'
      } else if (age >= 35 && age <= 55) {
        title = '财运亨通'
        description += '财运旺盛，投资理财皆宜'
      } else {
        description += '诸事顺遂，把握机遇'
      }

      events.push({ year: peak.year, type: 'good', title, description })
    }
  })

  // 添加低谷事件
  valleys.forEach(valley => {
    if (valley.score <= 40 && !events.find(e => e.year === valley.year)) {
      const age = valley.year - birthYear
      let title = '运势低谷'
      let description = '此年运势较弱，'

      if (age >= 20 && age <= 40) {
        title = '谨慎行事'
        description += '不宜冒进，稳扎稳打为上'
      } else if (age >= 40 && age <= 60) {
        title = '注意健康'
        description += '关注身体健康，劳逸结合'
      } else {
        description += '宜守不宜攻，静待时机'
      }

      events.push({ year: valley.year, type: 'caution', title, description })
    }
  })

  // 添加特殊年份事件（本命年等）
  for (let year = birthYear; year <= currentYear + 30; year++) {
    const age = year - birthYear
    // 本命年（每12年一次）
    if (age > 0 && age % 12 === 0 && !events.find(e => e.year === year)) {
      events.push({
        year,
        type: 'neutral',
        title: '本命年',
        description: `${age}岁本命年，犯太岁之年，宜低调行事，可佩戴红色饰品化解`
      })
    }
  }

  // 按年份排序
  events.sort((a, b) => a.year - b.year)

  return events
}
