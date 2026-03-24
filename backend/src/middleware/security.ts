import { Request, Response, NextFunction } from 'express'

// 简单的内存存储用于速率限制
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// 速率限制配置
const RATE_LIMIT_WINDOW = 60 * 1000 // 1分钟
const RATE_LIMIT_MAX_REQUESTS = 60 // 每分钟最多60个请求
const AUTH_RATE_LIMIT_MAX = 10 // 认证接口每分钟最多10个请求

/**
 * 速率限制中间件
 */
export function rateLimiter(maxRequests: number = RATE_LIMIT_MAX_REQUESTS) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown'
    const key = `${ip}:${req.path}`
    const now = Date.now()

    const record = rateLimitStore.get(key)

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
      return next()
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        error: '请求过于频繁，请稍后再试',
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      })
    }

    record.count++
    next()
  }
}

/**
 * 认证接口专用的更严格速率限制
 */
export const authRateLimiter = rateLimiter(AUTH_RATE_LIMIT_MAX)

/**
 * 安全响应头中间件
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // 防止点击劫持
  res.setHeader('X-Frame-Options', 'DENY')
  // 防止 MIME 类型嗅探
  res.setHeader('X-Content-Type-Options', 'nosniff')
  // XSS 保护
  res.setHeader('X-XSS-Protection', '1; mode=block')
  // 引用策略
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  // 内容安全策略
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';")

  next()
}

/**
 * 输入清理 - 移除潜在的危险字符
 */
export function sanitizeString(str: string): string {
  if (typeof str !== 'string') return str
  return str
    .replace(/[<>]/g, '') // 移除 HTML 标签字符
    .replace(/javascript:/gi, '') // 移除 javascript: 协议
    .replace(/on\w+=/gi, '') // 移除事件处理器
    .trim()
}

/**
 * 递归清理对象中的所有字符串
 */
export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj)
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }
  if (obj && typeof obj === 'object') {
    const sanitized: any = {}
    for (const key of Object.keys(obj)) {
      sanitized[sanitizeString(key)] = sanitizeObject(obj[key])
    }
    return sanitized
  }
  return obj
}

/**
 * 请求体清理中间件
 */
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    req.body = sanitizeObject(req.body)
  }
  if (req.query) {
    req.query = sanitizeObject(req.query) as any
  }
  if (req.params) {
    req.params = sanitizeObject(req.params)
  }
  next()
}

/**
 * 验证日期格式 (YYYY-MM-DD)
 */
export function isValidDate(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateStr)) return false
  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}

/**
 * 验证时间格式 (HH:MM 或 时辰格式)
 */
export function isValidTime(timeStr: string): boolean {
  if (!timeStr || typeof timeStr !== 'string') return false
  // HH:MM 格式
  if (/^\d{2}:\d{2}$/.test(timeStr)) return true
  // 时辰格式
  if (timeStr.includes('时')) return true
  return false
}

/**
 * 验证性别
 */
export function isValidGender(gender: string): boolean {
  return gender === 'male' || gender === 'female'
}

/**
 * 通用输入验证中间件工厂
 */
export function validateBaziInput(req: Request, res: Response, next: NextFunction) {
  const { birthDate, birthTime, gender } = req.body

  if (birthDate && !isValidDate(birthDate)) {
    return res.status(400).json({ error: '无效的出生日期格式' })
  }

  if (birthTime && !isValidTime(birthTime)) {
    return res.status(400).json({ error: '无效的出生时间格式' })
  }

  if (gender && !isValidGender(gender)) {
    return res.status(400).json({ error: '无效的性别值' })
  }

  next()
}

/**
 * 请求大小限制检查
 */
export function checkRequestSize(maxSize: number = 100 * 1024) { // 默认 100KB
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10)
    if (contentLength > maxSize) {
      return res.status(413).json({ error: '请求体过大' })
    }
    next()
  }
}

/**
 * 清理过期的速率限制记录（定期调用）
 */
export function cleanupRateLimitStore() {
  const now = Date.now()
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// 每5分钟清理一次过期记录
setInterval(cleanupRateLimitStore, 5 * 60 * 1000)
