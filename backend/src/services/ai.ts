import { buildPrompt, buildReportPrompt, buildMarriageReportPrompt } from '../prompts/bazi.js'

interface AIConfig {
  provider: 'doubao' | 'minimax'
  apiKey: string
  model?: string
}

// 默认配置
const DOUBAO_API_KEY = 'c671b870-ec9c-4118-a7c4-99d6b2e31d02'
const DOUBAO_MODEL = 'doubao-seed-2-0-lite-260215'
const MINIMAX_MODEL = 'MiniMax-M2.7'

// 豆包API调用 (新版responses接口)
export async function callDoubao(prompt: string, apiKey: string = DOUBAO_API_KEY, model?: string): Promise<string> {
  const modelName = model || DOUBAO_MODEL
  console.log('豆包API请求:', { model: modelName, promptLength: prompt.length })

  const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelName,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: prompt
            }
          ]
        }
      ]
    })
  })

  if (!response.ok) {
    const errText = await response.text()
    console.error('豆包API错误:', response.status, errText)
    throw new Error(`豆包API错误: ${response.status} - ${errText}`)
  }

  const data = await response.json()
  console.log('豆包API响应结构:', JSON.stringify(data.output).slice(0, 500))

  // 新版API响应格式 - 提取output中的文本内容
  let content = ''
  if (data.output && Array.isArray(data.output)) {
    for (const item of data.output) {
      if (item.type === 'message' && item.content) {
        // 消息类型的输出
        for (const contentItem of item.content) {
          if (contentItem.type === 'output_text' && contentItem.text) {
            content = contentItem.text
            break
          }
        }
      } else if (item.type === 'reasoning' && item.summary) {
        // 推理过程，可以跳过或忽略
        console.log('跳过推理过程')
      }
      if (content) break
    }
  }

  // 备选：从 choices 中提取（兼容旧格式）
  if (!content) {
    content = data.choices?.[0]?.message?.content || ''
  }

  console.log('提取内容:', content.slice(0, 200))
  return content
}

// MiniMax API调用
export async function callMinimax(prompt: string, apiKey: string, model?: string): Promise<string> {
  const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || MINIMAX_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096
    })
  })

  if (!response.ok) {
    throw new Error(`MiniMax API错误: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

export async function analyzeWithAI(
  type: string,
  baziData: any,
  config: AIConfig,
  partnerBaziData?: any,
  year?: number
): Promise<string> {
  const prompt = buildPrompt(type, baziData, partnerBaziData, year)

  if (config.provider === 'doubao') {
    return callDoubao(prompt, config.apiKey)
  } else if (config.provider === 'minimax') {
    return callMinimax(prompt, config.apiKey)
  }

  throw new Error('不支持的AI提供商')
}

// 流式响应（用于前端实时显示）
export async function* analyzeWithAIStream(
  type: string,
  baziData: any,
  config: AIConfig,
  partnerBaziData?: any,
  year?: number
): AsyncGenerator<string> {
  const prompt = buildPrompt(type, baziData, partnerBaziData, year)

  let url: string
  let body: any

  if (config.provider === 'doubao') {
    url = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
    body = {
      model: 'doubao-pro-32k',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
      stream: true
    }
  } else {
    url = 'https://api.minimax.chat/v1/text/chatcompletion_v2'
    body = {
      model: 'abab6.5s-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
      stream: true
    }
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify(body)
  })

  if (!response.ok || !response.body) {
    throw new Error(`AI API错误: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter(line => line.startsWith('data: '))

    for (const line of lines) {
      const data = line.slice(6)
      if (data === '[DONE]') return

      try {
        const json = JSON.parse(data)
        const content = json.choices?.[0]?.delta?.content
        if (content) yield content
      } catch {}
    }
  }
}

// 生成完整命理报告（九宫格模块）
export async function generateBaziReport(baziData: any, config?: AIConfig): Promise<any> {
  const prompt = buildReportPrompt(baziData)

  const apiKey = config?.apiKey || DOUBAO_API_KEY
  const provider = config?.provider || 'doubao'
  const model = config?.model

  console.log('调用AI生成报告，模型:', model)

  let content: string
  try {
    if (provider === 'doubao') {
      content = await callDoubao(prompt, apiKey, model)
    } else if (provider === 'minimax') {
      content = await callMinimax(prompt, apiKey, model)
    } else {
      content = await callDoubao(prompt, apiKey, model)
    }
    console.log('AI响应长度:', content?.length || 0)
    console.log('AI响应内容:', content?.slice(0, 500))
  } catch (err: any) {
    console.error('AI调用失败:', err.message)
    throw err
  }

  try {
    // 尝试多种方式提取JSON
    let jsonStr = content

    // 方式1：提取 ```json ... ``` 包裹的内容
    const codeBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1]
    }

    // 方式2：直接匹配 JSON 对象
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }

    // 修复常见的JSON问题
    jsonStr = jsonStr
      .replace(/'/g, '"')  // 单引号转双引号
      .replace(/,\s*([}\]])/g, '$1')  // 移除尾部逗号
      .replace(/(\w+):/g, '"$1":')  // 给属性名加引号
      .replace(/:\s*'([^']*)'/g, ': "$1"')  // 字符串值的引号统一
      .replace(/:\s*"([^"]*)'/g, ': "$1"')  // 混合引号统一

    const parsed = JSON.parse(jsonStr)
    console.log('JSON解析成功')
    return parsed
  } catch (e: any) {
    console.error('解析AI响应失败:', e.message)
    console.error('原始内容:', content.slice(0, 500))
  }

  return generateDefaultReport(baziData, content)
}

function generateDefaultReport(baziData: any, aiContent: string) {
  const currentYear = new Date().getFullYear()
  return {
    bazi: baziData,
    overallScore: 6,
    overallSummary: aiContent.slice(0, 200) || '命主八字结构平衡，整体运势稳定。',
    modules: {
      trading: { score: 6, content: '投资需谨慎，建议稳健操作。', year: `${currentYear + 10}年 (丙辰)` },
      personality: { score: 7, content: '性格沉稳，为人正直，有领导才能。' },
      career: { score: 6, content: '事业发展稳定，适合从事管理类工作。' },
      fengshui: { score: 5, content: '宜居东南方位，注意家居布局。' },
      wealth: { score: 6, content: '财运平稳，正财为主，偏财需谨慎。' },
      marriage: { score: 7, content: '感情运势良好，婚姻和谐美满。' },
      health: { score: 6, content: '注意脾胃保养，适当运动。' },
      family: { score: 7, content: '六亲关系和睦，贵人运较好。' }
    }
  }
}

// 生成婚姻合婚分析报告
export async function generateMarriageReport(bazi1Data: any, bazi2Data: any, config?: AIConfig): Promise<any> {
  const prompt = buildMarriageReportPrompt(bazi1Data, bazi2Data)

  const apiKey = config?.apiKey || DOUBAO_API_KEY
  const provider = config?.provider || 'doubao'
  const model = config?.model

  console.log('调用AI生成婚姻合婚报告，模型:', model)

  let content: string
  try {
    if (provider === 'doubao') {
      content = await callDoubao(prompt, apiKey, model)
    } else if (provider === 'minimax') {
      content = await callMinimax(prompt, apiKey, model)
    } else {
      content = await callDoubao(prompt, apiKey, model)
    }
    console.log('婚姻合婚AI响应长度:', content?.length || 0)
    console.log('婚姻合婚AI响应内容:', content?.slice(0, 500))
  } catch (err: any) {
    console.error('婚姻合婚AI调用失败:', err.message)
    throw err
  }

  try {
    // 尝试多种方式提取JSON
    let jsonStr = content

    // 方式1：提取 ```json ... ``` 包裹的内容
    const codeBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1]
    }

    // 方式2：直接匹配 JSON 对象
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }

    // 修复常见的JSON问题
    jsonStr = jsonStr
      .replace(/'/g, '"')  // 单引号转双引号
      .replace(/,\s*([}\]])/g, '$1')  // 移除尾部逗号
      .replace(/(\w+):/g, '"$1":')  // 给属性名加引号
      .replace(/:\s*'([^']*)'/g, ': "$1"')  // 字符串值的引号统一
      .replace(/:\s*"([^"]*)'/g, ': "$1"')  // 混合引号统一

    const parsed = JSON.parse(jsonStr)
    console.log('婚姻合婚JSON解析成功')
    return parsed
  } catch (e: any) {
    console.error('婚姻合婚JSON解析失败:', e.message)
    console.error('原始内容:', content.slice(0, 500))
  }

  return generateDefaultMarriageReport(bazi1Data, bazi2Data, content)
}

function generateDefaultMarriageReport(bazi1Data: any, bazi2Data: any, aiContent: string) {
  const currentYear = new Date().getFullYear()
  return {
    overallScore: 70,
    overallSummary: '两人命局各有特点，需要相互理解包容。缘分还不错，在一起后会挺幸福的。',
    compatibility: {
      icon: "💑",
      title: "综合契合度",
      score: 70,
      level: "小吉",
      content: "你们俩在一起后，应该会像...挺般配的一对。"
    },
    modules: {
      personalityFit: {
        icon: "🧠",
        title: "性格与心性契合",
        score: 68,
        level: "小吉",
        content: "性格上有点像...需要慢慢磨合，但问题不大。"
      },
      emotionalBond: {
        icon: "💕",
        title: "夫妻缘分与情感默契",
        score: 70,
        level: "小吉",
        content: "缘分还是有的，在一起后会越来越默契。"
      },
      wuxing互补: {
        icon: "⚡",
        title: "五行互补与生活助力",
        score: 72,
        level: "小吉",
        content: "五行上能互补，谁缺啥另一方能补上。"
      },
      futureProsperity: {
        icon: "📈",
        title: "未来运势同步与发展",
        score: 68,
        level: "小吉",
        content: "未来几年你们会...遇到问题多商量就好。"
      },
      relationshipAdvice: {
        icon: "💡",
        title: "相处建议与增福方向",
        score: 75,
        level: "中吉",
        content: "记住多沟通、小吵小闹别隔夜，日常多点仪式感。"
      }
    },
    goodMonths: ["2026年农历三月", "2026年农历九月", "2027年农历二月"],
    avoidMonths: ["2026年农历七月", "2026年农历十二月"],
    goodDays: ["2026年10月18日", "2026年11月8日", "2027年2月14日", "2027年5月1日", "2027年8月20日", "2027年10月1日"],
    avoidDays: ["2026年7月15日", "2026年12月20日"],
    tips: ["婚后多沟通，遇到问题别憋着", "日常小惊喜能增进感情", "遇到大事多商量"],
    recommendedDays: [
      {
        date: `${currentYear}年10月18日`,
        lunar: "九月初六（甲子日）",
        fitness: "宜嫁娶，开光",
        reason: "天干地支相生，夫妻宫旺盛"
      },
      {
        date: `${currentYear}年11月8日`,
        lunar: "十月初十（丙寅日）",
        fitness: "宜嫁娶、订盟",
        reason: "寅日与双方喜用神相合"
      },
      {
        date: "2027年2月14日",
        lunar: "正月二十（庚午日）",
        fitness: "宜嫁娶、纳采",
        reason: "情人节当天，感情加持，双喜临门"
      },
      {
        date: "2027年5月1日",
        lunar: "四月初五（癸丑日）",
        fitness: "宜嫁娶、祭祀",
        reason: "丑日与命主日主相合"
      },
      {
        date: "2027年8月20日",
        lunar: "七月初七（辛酉日）",
        fitness: "宜嫁娶、祈福",
        reason: "七夕佳节，情定终身"
      },
      {
        date: "2027年10月1日",
        lunar: "九月初九（癸亥日）",
        fitness: "宜嫁娶、求子",
        reason: "重阳节，寓意长久，天地相合"
      }
    ]
  }
}
