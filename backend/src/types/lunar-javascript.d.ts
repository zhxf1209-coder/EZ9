declare module 'lunar-javascript' {
  export class Solar {
    constructor(year: number, month: number, day: number, hour?: number, minute?: number)
    static fromYmdHms(year: number, month: number, day: number, hour?: number, minute?: number, second?: number): Solar
    toString(): string
    getYear(): number
    getMonth(): number
    getDay(): number
    getHour(): number
    getMinute(): number
    getSecond(): number
    getSolar(): Solar
    getLunar(): Lunar
    getEightChar(): EightChar
    [key: string]: any
  }

  export class Lunar {
    constructor(year: number, month: number, day: number, hour?: number, minute?: number)
    static fromYmdHms(year: number, month: number, day: number, hour?: number, minute?: number, second?: number): Lunar
    toString(): string
    getYear(): number
    getMonth(): number
    getDay(): number
    getHour(): number
    getMinute(): number
    getSecond(): number
    getLunar(): Lunar
    getEightChar(): EightChar
    getYearInGanZhi(): string
    getMonthInGanZhi(): string
    getDayInGanZhi(): string
    getHourInGanZhi(): string
    getShengXiao(): string
    getNaYin(): string
    getWuXing(): string
    [key: string]: any
  }

  export class EightChar {
    constructor(lunar: Lunar)
    getYear(): string
    getMonth(): string
    getDay(): string
    getHour(): string
    getYearGan(): string
    getYearZhi(): string
    getMonthGan(): string
    getMonthZhi(): string
    getDayGan(): string
    getDayZhi(): string
    getTimeGan(): string
    getTimeZhi(): string
    getYearNaYin(): string
    getMonthNaYin(): string
    getDayNaYin(): string
    getTimeNaYin(): string
    getYun(gender: number): any
    [key: string]: any
  }

  export class LunarSolarConverter {
    static lunarToSolar(lunar: Lunar): Solar
    static solarToLunar(solar: Solar): Lunar
  }
}
