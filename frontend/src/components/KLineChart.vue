<template>
  <div class="chinese-card p-4">
    <h3 class="chinese-title text-lg mb-4 text-center">人生运势K线</h3>
    <div ref="chartRef" class="w-full h-80"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{ data: Array<{ year: number; score: number; ganZhi: string; description: string }> }>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const renderChart = () => {
  if (!chartRef.value || !props.data?.length) return

  if (!chart) {
    chart = echarts.init(chartRef.value)
  }

  const currentYear = new Date().getFullYear()

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const d = props.data[params[0].dataIndex]
        return `${d.year}年 (${d.ganZhi})<br/>运势指数: ${d.score}<br/>${d.description}`
      }
    },
    xAxis: {
      type: 'category',
      data: props.data.map(d => d.year),
      axisLine: { lineStyle: { color: '#C41E3A' } },
      axisLabel: { color: '#4A3728' }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: { lineStyle: { color: '#C41E3A' } },
      axisLabel: { color: '#4A3728' },
      splitLine: { lineStyle: { color: '#D4A84B', opacity: 0.3 } }
    },
    series: [{
      type: 'line',
      data: props.data.map(d => d.score),
      smooth: true,
      lineStyle: { color: '#C41E3A', width: 3 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(196, 30, 58, 0.4)' },
          { offset: 1, color: 'rgba(196, 30, 58, 0.05)' }
        ])
      },
      itemStyle: { color: '#C41E3A' },
      markLine: {
        silent: true,
        data: [{ xAxis: currentYear, lineStyle: { color: '#E67E22', type: 'dashed' }, label: { formatter: '今年' } }]
      },
      markPoint: {
        data: [
          { type: 'max', name: '最高', itemStyle: { color: '#27ae60' } },
          { type: 'min', name: '最低', itemStyle: { color: '#e74c3c' } }
        ]
      }
    }],
    grid: { left: 50, right: 30, top: 30, bottom: 40 }
  }

  chart.setOption(option)
}

onMounted(renderChart)
watch(() => props.data, renderChart, { deep: true })
</script>
