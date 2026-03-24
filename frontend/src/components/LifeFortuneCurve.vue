<template>
  <div class="chinese-card p-4">
    <h3 class="chinese-title text-lg mb-4 text-center">人生运势曲线</h3>
    <div ref="chartRef" class="w-full h-80"></div>
    
    <!-- 关键点详情 - 只显示近十年3项 -->
    <div v-if="recentKeyPoints.length" class="mt-4 space-y-3">
      <h4 class="font-semibold text-china-brown text-center">近十年关键事件</h4>
      <div 
        v-for="point in recentKeyPoints" 
        :key="point.year"
        class="p-4 rounded-lg border-l-4"
        :class="getPointClass(point.type)"
      >
        <div class="flex justify-between items-start mb-2">
          <div>
            <span class="font-bold text-china-red text-lg">{{ point.year }}年</span>
            <span v-if="birthYear" class="text-sm text-gray-500 ml-2">({{ point.year - birthYear }}岁)</span>
          </div>
          <span class="text-sm px-3 py-1 rounded-full font-medium" :class="getBadgeClass(point.type)">
            {{ getTypeLabel(point.type) }}
          </span>
        </div>
        <div class="font-medium text-china-brown text-base mb-1">{{ point.title }}</div>
        <div class="text-sm text-gray-600 leading-relaxed mb-2">{{ point.description }}</div>
        <div v-if="point.advice" class="text-sm bg-green-50 p-2 rounded border border-green-200">
          <span class="font-semibold text-green-700">💡 建议：</span>
          <span class="text-green-700">{{ point.advice }}</span>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="mt-4 flex flex-wrap justify-center gap-4 text-sm">
      <div class="flex items-center">
        <span class="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
        <span class="text-gray-600">吉事</span>
      </div>
      <div class="flex items-center">
        <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
        <span class="text-gray-600">转折</span>
      </div>
      <div class="flex items-center">
        <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
        <span class="text-gray-600">需注意</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'

export interface KeyEvent {
  year: number
  type: 'good' | 'neutral' | 'caution'
  title: string
  description: string
  advice?: string
}

export interface FortuneData {
  year: number
  score: number
  ganZhi: string
  description: string
}

const props = defineProps<{
  data: FortuneData[]
  events?: KeyEvent[]
  birthYear?: number
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const keyPoints = ref<KeyEvent[]>([])

// 计算近十年的关键点（最多3项）
const recentKeyPoints = computed(() => {
  const currentYear = new Date().getFullYear()
  const tenYearsAgo = currentYear - 10
  
  // 筛选近十年或未来十年的关键点
  const recent = keyPoints.value.filter(p => p.year >= tenYearsAgo && p.year <= currentYear + 10)
  
  // 按与当前年的距离排序，优先显示最近的
  return recent
    .sort((a, b) => Math.abs(a.year - currentYear) - Math.abs(b.year - currentYear))
    .slice(0, 3)
})

// 限制时间线到80岁
const filteredData = computed(() => {
  if (!props.data?.length) return []
  const maxYear = props.birthYear ? props.birthYear + 80 : new Date().getFullYear()
  return props.data.filter(d => d.year <= maxYear)
})

const getEventColor = (type: string) => {
  switch (type) {
    case 'good': return '#22c55e'
    case 'caution': return '#ef4444'
    default: return '#eab308'
  }
}

const getPointClass = (type: string) => {
  switch (type) {
    case 'good': return 'bg-green-50 border-green-400'
    case 'caution': return 'bg-red-50 border-red-400'
    default: return 'bg-yellow-50 border-yellow-400'
  }
}

const getBadgeClass = (type: string) => {
  switch (type) {
    case 'good': return 'bg-green-100 text-green-700'
    case 'caution': return 'bg-red-100 text-red-700'
    default: return 'bg-yellow-100 text-yellow-700'
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'good': return '✨ 吉祥'
    case 'caution': return '⚠️ 需注意'
    default: return '🔄 转折'
  }
}

const processKeyPoints = () => {
  if (!props.events || !props.events.length) {
    keyPoints.value = []
    return
  }
  
  const maxYear = props.birthYear ? props.birthYear + 80 : new Date().getFullYear()
  
  // 过滤到80岁的范围内
  let filteredEvents = props.events.filter(e => e.year <= maxYear)
  
  // 按年份排序
  filteredEvents = [...filteredEvents].sort((a, b) => a.year - b.year)
  
  // 选择关键点：3-5年一个
  const selected: KeyEvent[] = []
  let lastYear = 0
  const minInterval = 3 // 最小间隔3年
  const maxInterval = 5 // 最大间隔5年
  
  for (const event of filteredEvents) {
    const interval = event.year - lastYear
    
    // 如果间隔超过5年，选择这个点
    if (interval >= maxInterval) {
      // 查找最近的重要事件
      const nearbyEvents = filteredEvents.filter(
        e => e.year >= event.year - 2 && e.year <= event.year + 2
      )
      // 优先选择需注意或吉事
      const priorityEvent = nearbyEvents.find(e => e.type === 'caution') ||
                           nearbyEvents.find(e => e.type === 'good') ||
                           event
      if (!selected.find(s => s.year === priorityEvent.year)) {
        selected.push(priorityEvent)
        lastYear = priorityEvent.year
      }
    } else if (selected.length === 0 || interval >= minInterval) {
      // 确保至少每3年有一个点
      selected.push(event)
      lastYear = event.year
    }
  }
  
  // 按年份排序
  keyPoints.value = selected.sort((a, b) => a.year - b.year)
}

const getEventForYear = (year: number) => {
  return props.events?.find(e => e.year === year)
}

// 检查是否是关键点年份
const isKeyPointYear = (year: number) => {
  return keyPoints.value.some(p => p.year === year)
}

const renderChart = () => {
  if (!chartRef.value || !filteredData.value.length) return

  processKeyPoints()

  if (!chart) {
    chart = echarts.init(chartRef.value)
  }

  const currentYear = new Date().getFullYear()

  // 生成标记点
  const eventMarkers = keyPoints.value.map(point => ({
    coord: [point.year, filteredData.value.find(d => d.year === point.year)?.score || 50],
    itemStyle: { color: getEventColor(point.type) },
    symbol: 'circle',
    symbolSize: 14
  }))

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line', lineStyle: { color: '#C41E3A', type: 'dashed' } },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#C41E3A',
      borderWidth: 2,
      textStyle: { color: '#4A3728' },
      formatter: (params: any) => {
        const dataIndex = params[0]?.dataIndex
        if (dataIndex === undefined) return ''

        const d = filteredData.value[dataIndex]
        const age = props.birthYear ? d.year - props.birthYear : null
        const ageStr = age !== null ? ` (${age}岁)` : ''
        
        const event = getEventForYear(d.year)
        
        let tooltipContent = `
          <div style="font-weight:bold; font-size:14px; margin-bottom:8px">${d.year}年${ageStr}</div>
          <div style="color:#888; margin-bottom:4px">${d.ganZhi}年</div>
          <div style="margin-bottom:4px">运势指数: <span style="color:#C41E3A;font-weight:bold;font-size:16px">${d.score}</span></div>
        `
        
        if (event) {
          tooltipContent += `
            <div style="margin-top:8px; padding-top:8px; border-top:1px solid #eee">
              <div style="font-weight:bold; color:${getEventColor(event.type)}; margin-bottom:4px">${event.title}</div>
              <div style="font-size:12px; color:#666; margin-bottom:4px">${event.description}</div>
            `
          if (event.advice) {
            tooltipContent += `
              <div style="font-size:12px; color:#22c55e; background:#f0fdf4; padding:4px; border-radius:4px; margin-top:4px">
                💡 ${event.advice}
              </div>
            `
          }
          tooltipContent += '</div>'
        }
        
        return tooltipContent
      }
    },
    xAxis: {
      type: 'category',
      data: filteredData.value.map(d => d.year),
      axisLine: { lineStyle: { color: '#C41E3A' } },
      axisLabel: {
        color: '#4A3728',
        interval: Math.floor(filteredData.value.length / 10),
        rotate: 0,
        fontSize: 11
      },
      name: '年份',
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: { lineStyle: { color: '#C41E3A' } },
      axisLabel: { color: '#4A3728', formatter: '{value}分' },
      splitLine: { lineStyle: { color: '#D4A84B', opacity: 0.3 } },
      name: '运势指数',
      nameLocation: 'middle',
      nameGap: 40
    },
    series: [{
      type: 'line',
      data: filteredData.value.map(d => {
        const year = d.year
        const isKey = isKeyPointYear(year)
        return {
          value: d.score,
          itemStyle: {
            color: isKey ? getEventColor(getEventForYear(year)?.type || 'neutral') : 'rgba(196, 30, 58, 0.3)',
            borderColor: isKey ? getEventColor(getEventForYear(year)?.type || 'neutral') : 'transparent',
            borderWidth: isKey ? 3 : 0,
            shadowColor: isKey ? getEventColor(getEventForYear(year)?.type || 'neutral') : 'transparent',
            shadowBlur: isKey ? 10 : 0
          },
          symbolSize: isKey ? 14 : 0 // 非关键点不显示
        }
      }),
      smooth: 0.6,
      lineStyle: { 
        color: '#C41E3A', 
        width: 3,
        shadowColor: 'rgba(196, 30, 58, 0.3)',
        shadowBlur: 10
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(196, 30, 58, 0.3)' },
          { offset: 1, color: 'rgba(196, 30, 58, 0.02)' }
        ])
      },
      symbol: 'circle',
      markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: { type: 'dashed' },
        data: [
          {
            xAxis: currentYear,
            lineStyle: { color: '#3b82f6', width: 2 },
            label: { formatter: '今年', color: '#3b82f6', position: 'end' }
          }
        ]
      },
      markPoint: {
        data: eventMarkers,
        symbol: 'circle',
        symbolSize: 16,
        itemStyle: {
          color: (params: any) => {
            const year = filteredData.value[params.dataIndex]?.year
            const event = getEventForYear(year)
            return event ? getEventColor(event.type) : '#22c55e'
          },
          borderColor: '#fff',
          borderWidth: 3,
          shadowColor: 'rgba(0,0,0,0.3)',
          shadowBlur: 8
        },
        label: {
          show: false
        }
      }
    }],
    grid: { left: 50, right: 30, top: 30, bottom: 50 }
  }

  chart.setOption(option)
}

const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  renderChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

watch(() => [props.data, props.events, props.birthYear], renderChart, { deep: true })
</script>
