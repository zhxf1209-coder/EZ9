// 时辰转换工具

export interface ShichenInfo {
  name: string      // 时辰名称，如"子时"
  label: string     // 完整标签，如"子时 (23:00-00:59)"
  value: string     // 用于表单的值
  startHour: number // 开始小时
  endHour: number   // 结束小时
}

export const SHICHEN_LIST: ShichenInfo[] = [
  { name: '子时', label: '子时 (23:00-00:59)', value: '子时 (23:00-00:59)', startHour: 23, endHour: 1 },
  { name: '丑时', label: '丑时 (01:00-02:59)', value: '丑时 (01:00-02:59)', startHour: 1, endHour: 3 },
  { name: '寅时', label: '寅时 (03:00-04:59)', value: '寅时 (03:00-04:59)', startHour: 3, endHour: 5 },
  { name: '卯时', label: '卯时 (05:00-06:59)', value: '卯时 (05:00-06:59)', startHour: 5, endHour: 7 },
  { name: '辰时', label: '辰时 (07:00-08:59)', value: '辰时 (07:00-08:59)', startHour: 7, endHour: 9 },
  { name: '巳时', label: '巳时 (09:00-10:59)', value: '巳时 (09:00-10:59)', startHour: 9, endHour: 11 },
  { name: '午时', label: '午时 (11:00-12:59)', value: '午时 (11:00-12:59)', startHour: 11, endHour: 13 },
  { name: '未时', label: '未时 (13:00-14:59)', value: '未时 (13:00-14:59)', startHour: 13, endHour: 15 },
  { name: '申时', label: '申时 (15:00-16:59)', value: '申时 (15:00-16:59)', startHour: 15, endHour: 17 },
  { name: '酉时', label: '酉 (17:00-18:59)', value: '酉时 (17:00-18:59)', startHour: 17, endHour: 19 },
  { name: '戌时', label: '戌时 (19:00-20:59)', value: '戌时 (19:00-20:59)', startHour: 19, endHour: 21 },
  { name: '亥时', label: '亥时 (21:00-22:59)', value: '亥时 (21:00-22:59)', startHour: 21, endHour: 23 }
]

/**
 * 将 HH:MM 格式的时间转换为时辰
 * @param time HH:MM 格式的时间字符串，如 "14:30"
 * @returns 时辰信息
 */
export function timeToShichen(time: string): ShichenInfo {
  if (!time) return SHICHEN_LIST[6] // 默认午时

  // 如果已经是时辰格式，直接返回匹配的
  if (time.includes('时')) {
    const found = SHICHEN_LIST.find(s => time.includes(s.name))
    return found || SHICHEN_LIST[6]
  }

  // 解析 HH:MM 格式
  const parts = time.split(':')
  const hour = parseInt(parts[0], 10)

  if (isNaN(hour)) return SHICHEN_LIST[6]

  // 根据小时确定时辰
  if (hour === 23 || hour === 0) return SHICHEN_LIST[0]  // 子时
  if (hour >= 1 && hour < 3) return SHICHEN_LIST[1]      // 丑时
  if (hour >= 3 && hour < 5) return SHICHEN_LIST[2]      // 寅时
  if (hour >= 5 && hour < 7) return SHICHEN_LIST[3]      // 卯时
  if (hour >= 7 && hour < 9) return SHICHEN_LIST[4]      // 辰时
  if (hour >= 9 && hour < 11) return SHICHEN_LIST[5]     // 巳时
  if (hour >= 11 && hour < 13) return SHICHEN_LIST[6]    // 午时
  if (hour >= 13 && hour < 15) return SHICHEN_LIST[7]    // 未时
  if (hour >= 15 && hour < 17) return SHICHEN_LIST[8]    // 申时
  if (hour >= 17 && hour < 19) return SHICHEN_LIST[9]    // 酉时
  if (hour >= 19 && hour < 21) return SHICHEN_LIST[10]   // 戌时
  if (hour >= 21 && hour < 23) return SHICHEN_LIST[11]   // 亥时

  return SHICHEN_LIST[6] // 默认午时
}

/**
 * 将时辰转换为代表性的 HH:MM 时间（取时辰中间时间）
 * @param shichen 时辰字符串
 * @returns HH:MM 格式时间
 */
export function shichenToTime(shichen: string): string {
  const found = SHICHEN_LIST.find(s => shichen.includes(s.name))
  if (!found) return '12:00'

  // 返回时辰的起始小时
  const hour = found.startHour
  return `${hour.toString().padStart(2, '0')}:00`
}

/**
 * 格式化显示时间（用于档案列表等显示）
 * @param time 时间字符串（可能是 HH:MM 或时辰格式）
 * @returns 格式化后的显示字符串
 */
export function formatTimeDisplay(time: string): string {
  if (!time) return ''
  if (time.includes('时')) return time
  const shichen = timeToShichen(time)
  return `${time} (${shichen.name})`
}
