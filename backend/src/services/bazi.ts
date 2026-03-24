import { Solar, Lunar, EightChar } from 'lunar-javascript'

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
// 五行
const WU_XING = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水', '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水' }
// 十神
const SHI_SHEN_MAP: Record<string, Record<string, string>> = {
  '甲': { '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印' },
  '乙': { '乙': '比肩', '甲': '劫财', '丁': '食神', '丙': '伤官', '己': '偏财', '戊': '正财', '辛': '七杀', '庚': '正官', '癸': '偏印', '壬': '正印' },
  '丙': { '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官', '甲': '偏印', '乙': '正印' },
  '丁': { '丁': '比肩', '丙': '劫财', '己': '食神', '戊': '伤官', '辛': '偏财', '庚': '正财', '癸': '七杀', '壬': '正官', '乙': '偏印', '甲': '正印' },
  '戊': { '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财', '甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印' },
  '己': { '己': '比肩', '戊': '劫财', '辛': '食神', '庚': '伤官', '癸': '偏财', '壬': '正财', '乙': '七杀', '甲': '正官', '丁': '偏印', '丙': '正印' },
  '庚': { '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官', '甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', '己': '正印' },
  '辛': { '辛': '比肩', '庚': '劫财', '癸': '食神', '壬': '伤官', '乙': '偏财', '甲': '正财', '丁': '七杀', '丙': '正官', '己': '偏印', '戊': '正印' },
  '壬': { '壬': '比肩', '癸': '劫财', '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', '己': '正官', '庚': '偏印', '辛': '正印' },
  '癸': { '癸': '比肩', '壬': '劫财', '乙': '食神', '甲': '伤官', '丁': '偏财', '丙': '正财', '己': '七杀', '戊': '正官', '辛': '偏印', '庚': '正印' }
}

export interface BaziResult {
  fourPillars: { year: string; month: string; day: string; hour: string }
  tianGan: string[]
  diZhi: string[]
  wuxing: Record<string, number>
  wuxingStr: string
  shiShen: string[]
  dayMaster: string
  dayMasterWuxing: string
  naYin: { year: string; month: string; day: string; hour: string }
  daYun: Array<{ startAge: number; endAge: number; ganZhi: string; wuxing: string }>
  spilit: string
  lunar: { year: number; month: number; day: number; yearGanZhi: string; monthGanZhi: string }
}

// 时辰到小时的映射
const SHI_CHEN_HOUR_MAP: Record<string, number> = {
  '子时': 23, '丑时': 1, '寅时': 3, '卯时': 5,
  '辰时': 7, '巳时': 9, '午时': 11, '未时': 13,
  '申时': 15, '酉时': 17, '戌时': 19, '亥时': 21
}

// 解析出生时间，返回小时
function parseBirthTime(birthTime: string): number {
  // 如果是 HH:MM 格式
  if (birthTime.includes(':')) {
    const match = birthTime.match(/(\d{1,2}):(\d{2})/)
    if (match) {
      return parseInt(match[1])
    }
  }

  // 如果是 "子时 (23:00-00:59)" 格式
  const shiChenMatch = birthTime.match(/^([^\s]+)/)
  if (shiChenMatch) {
    const shiChen = shiChenMatch[1]
    if (SHI_CHEN_HOUR_MAP[shiChen] !== undefined) {
      return SHI_CHEN_HOUR_MAP[shiChen]
    }
  }

  // 尝试直接解析数字
  const num = parseInt(birthTime)
  if (!isNaN(num) && num >= 0 && num <= 23) {
    return num
  }

  return 12 // 默认中午
}

export function calculateBazi(birthDate: string, birthTime: string, gender: string): BaziResult {
  const [year, month, day] = birthDate.split('-').map(Number)
  const hour = parseBirthTime(birthTime)

  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0)
  const lunar = solar.getLunar()
  const eightChar = lunar.getEightChar()

  const yearGan = eightChar.getYearGan()
  const yearZhi = eightChar.getYearZhi()
  const monthGan = eightChar.getMonthGan()
  const monthZhi = eightChar.getMonthZhi()
  const dayGan = eightChar.getDayGan()
  const dayZhi = eightChar.getDayZhi()
  const hourGan = eightChar.getTimeGan()
  const hourZhi = eightChar.getTimeZhi()

  const tianGan = [yearGan, monthGan, dayGan, hourGan]
  const diZhi = [yearZhi, monthZhi, dayZhi, hourZhi]

  // 计算五行
  const wuxing: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
  ;[...tianGan, ...diZhi].forEach(char => {
    const wx = WU_XING[char as keyof typeof WU_XING]
    if (wx) wuxing[wx]++
  })

  const wuxingStr = Object.entries(wuxing).map(([k, v]) => `${k}${v}`).join(' ')

  // 计算十神
  const shiShen = [...tianGan.slice(0, 2), ...tianGan.slice(3)].map(gan => SHI_SHEN_MAP[dayGan]?.[gan] || '')

  // 纳音
  const naYin = {
    year: eightChar.getYearNaYin(),
    month: eightChar.getMonthNaYin(),
    day: eightChar.getDayNaYin(),
    hour: eightChar.getTimeNaYin()
  }

  // 大运
  const yun = eightChar.getYun(gender === 'male' ? 1 : 0)
  const daYunList = yun.getDaYun()
  const daYun = daYunList.slice(1, 9).map((dy: any) => ({
    startAge: dy.getStartAge(),
    endAge: dy.getEndAge(),
    ganZhi: dy.getGanZhi(),
    wuxing: WU_XING[dy.getGanZhi()[0] as keyof typeof WU_XING] || ''
  }))

  return {
    fourPillars: {
      year: yearGan + yearZhi,
      month: monthGan + monthZhi,
      day: dayGan + dayZhi,
      hour: hourGan + hourZhi
    },
    tianGan,
    diZhi,
    wuxing,
    wuxingStr,
    shiShen,
    dayMaster: dayGan,
    dayMasterWuxing: WU_XING[dayGan as keyof typeof WU_XING],
    naYin,
    daYun,
    spilit: yun.getStartYear() + '年起运',
    lunar: {
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay(),
      yearGanZhi: lunar.getYearInGanZhi(),
      monthGanZhi: lunar.getMonthInGanZhi()
    }
  }
}
