<template>
  <div class="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
    <!-- 加载界面 -->
    <div v-if="loading" class="min-h-screen flex flex-col items-center justify-center p-6">
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">☰⚋☵☷</div>
        <h2 class="text-2xl font-bold text-china-red mb-2">命理分析中</h2>
        <p class="text-china-brown">请稍候，AI正在深度分析您的八字命理...</p>
      </div>

      <!-- 进度条 -->
      <div class="w-full max-w-md mb-8">
        <div class="relative">
          <div class="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
            <div
              :style="{ width: progress + '%' }"
              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-china-red to-red-400 transition-all duration-500"
            ></div>
          </div>
        </div>
        <div class="flex justify-between mt-2 text-xs text-gray-500">
          <span>开始分析</span>
          <span>{{ progress }}%</span>
          <span>分析完成</span>
        </div>
      </div>

      <!-- 分析步骤 -->
      <div class="w-full max-w-md space-y-3">
        <div
          v-for="(step, index) in analysisSteps"
          :key="index"
          class="flex items-center space-x-3 p-3 rounded-lg transition-all duration-300"
          :class="step.status === 'completed' ? 'bg-green-50' : step.status === 'active' ? 'bg-china-red/10' : 'bg-gray-50'"
        >
          <div class="w-8 h-8 rounded-full flex items-center justify-center"
               :class="step.status === 'completed' ? 'bg-green-500 text-white' : step.status === 'active' ? 'bg-china-red text-white' : 'bg-gray-300 text-gray-500'">
            <span v-if="step.status === 'completed'" class="text-sm">✓</span>
            <span v-else-if="step.status === 'active'" class="text-sm animate-pulse">{{ index + 1 }}</span>
            <span v-else class="text-sm">{{ index + 1 }}</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium" :class="step.status === 'active' ? 'text-china-red' : 'text-gray-700'">
              {{ step.text }}
            </p>
            <p v-if="step.status === 'active'" class="text-xs text-gray-500">正在分析中...</p>
            <p v-else-if="step.status === 'completed'" class="text-xs text-green-600">已完成</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 报告内容 -->
    <template v-else-if="report">
      <div class="max-w-4xl mx-auto p-4 pb-20">
        <!-- 顶部四柱展示 -->
        <div class="chinese-card p-4 md:p-6 mb-6">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            <div v-for="(pillar, key) in fourPillars" :key="key" class="text-center">
              <div class="bg-gradient-to-b from-red-50 to-red-100 rounded-xl p-3 md:p-4 border-2 border-red-200 shadow-sm">
                <div class="text-2xl md:text-3xl font-bold text-china-red mb-1 md:mb-2">{{ pillar.value }}</div>
                <div class="text-xs text-gray-600">{{ pillar.ganZhi }}</div>
              </div>
              <div class="text-sm text-china-brown mt-2 font-medium">{{ pillar.label }}</div>
            </div>
          </div>

          <!-- 日主说明 -->
          <div class="mt-4 text-center">
            <span class="text-china-brown">日主：</span>
            <span class="text-china-red font-bold">{{ report?.bazi?.dayMaster || '' }}</span>
            <span class="text-china-brown ml-2">{{ report?.bazi?.dayMasterWuxing || '' }}</span>
          </div>
        </div>

        <!-- 五行占比图 -->
        <div class="chinese-card p-4 md:p-6 mb-6">
          <h3 class="text-lg font-bold text-china-brown mb-4 text-center">五行分布</h3>
          <div class="grid grid-cols-3 sm:grid-cols-5 gap-3 md:gap-4 mb-4">
            <div
              v-for="(item, key) in wuxingData"
              :key="key"
              class="text-center"
            >
              <div class="relative inline-block">
                <svg class="w-14 h-14 md:w-16 md:h-16 transform -rotate-90">
                  <circle
                    cx="32" cy="32" r="28"
                    stroke="#e5e7eb"
                    stroke-width="8"
                    fill="none"
                  />
                  <circle
                    cx="32" cy="32" r="28"
                    :stroke="item.color"
                    stroke-width="8"
                    fill="none"
                    :stroke-dasharray="`${item.percentage * 1.76} 176`"
                    class="transition-all duration-1000"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-xs font-bold text-gray-700">{{ item.count }}</span>
                </div>
              </div>
              <div class="mt-2">
                <div class="text-base md:text-lg font-bold" :style="{ color: item.color }">{{ item.label }}</div>
                <div class="text-xs text-gray-500">{{ item.percentage }}%</div>
              </div>
            </div>
          </div>

          <!-- 五行条形图 -->
          <div class="space-y-2">
            <div v-for="(item, key) in wuxingData" :key="key" class="flex items-center">
              <div class="w-10 md:w-12 text-xs md:text-sm text-gray-600">{{ item.label }}</div>
              <div class="flex-1 bg-gray-200 rounded-full h-3 md:h-4 overflow-hidden">
                <div
                  :style="{ width: item.percentage + '%', backgroundColor: item.color }"
                  class="h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                >
                  <span v-if="item.percentage > 10" class="text-xs text-white font-bold">{{ item.count }}</span>
                </div>
              </div>
              <div class="w-10 md:w-12 text-xs md:text-sm text-gray-500 text-right">{{ item.count }}</div>
            </div>
          </div>
        </div>

        <!-- 命理总评 -->
        <div class="chinese-card p-4 md:p-6 mb-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 class="text-lg font-bold text-china-brown text-center sm:text-left">命理总评</h3>
            <div class="flex items-center justify-center sm:justify-end space-x-2">
              <span class="text-3xl md:text-4xl font-bold text-china-red">{{ report.overallScore }}</span>
              <span class="text-gray-500">/10</span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              class="h-3 rounded-full transition-all duration-500"
              :style="{ width: report.overallScore * 10 + '%', backgroundColor: getScoreColor(report.overallScore) }"
            ></div>
          </div>
          <p class="text-china-brown leading-relaxed text-base">{{ report.overallSummary }}</p>
        </div>

        <!-- 人生运势曲线图 -->
        <LifeFortuneCurve
          v-if="fortuneData.length"
          :data="fortuneData"
          :events="fortuneEvents"
          :birth-year="birthYear"
          class="mb-6"
        />

        <!-- 八大分析模块 -->
        <div class="space-y-4">
          <div
            v-for="(module, key) in modules"
            :key="key"
            class="chinese-card p-4 md:p-5 hover:shadow-lg transition-shadow"
          >
            <div class="flex flex-col sm:flex-row items-start gap-4">
              <!-- 图标和标题 -->
              <div class="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-3xl mx-auto sm:mx-0"
                   :class="getModuleBgClass(key)">
                {{ module.icon }}
              </div>

              <!-- 内容 -->
              <div class="flex-1 w-full">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h4 class="font-bold text-base md:text-lg text-china-brown text-center sm:text-left">{{ module.title }}</h4>
                  <div class="flex items-center justify-center sm:justify-end gap-2">
                    <div class="w-20 md:w-24 bg-gray-200 rounded-full h-2">
                      <div
                        class="h-2 rounded-full"
                        :style="{ width: module.score * 10 + '%', backgroundColor: getScoreColor(module.score) }"
                      ></div>
                    </div>
                    <span class="font-bold text-lg" :style="{ color: getScoreColor(module.score) }">
                      {{ module.score }}
                    </span>
                    <span class="text-gray-400 text-sm">分</span>
                  </div>
                </div>
                <p class="text-gray-600 leading-relaxed text-sm md:text-base">{{ module.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 评分说明 -->
        <div class="chinese-card p-6 mt-6">
          <h4 class="font-bold text-china-brown mb-4 text-center">评分说明</h4>
          <div class="grid grid-cols-5 gap-2 text-center">
            <div class="p-2 rounded-lg" style="background-color: rgba(34, 197, 94, 0.1)">
              <div class="text-2xl font-bold text-green-500">9-10</div>
              <div class="text-xs text-gray-600 mt-1">极佳</div>
            </div>
            <div class="p-2 rounded-lg" style="background-color: rgba(132, 204, 22, 0.1)">
              <div class="text-2xl font-bold text-lime-500">7-8</div>
              <div class="text-xs text-gray-600 mt-1">良好</div>
            </div>
            <div class="p-2 rounded-lg" style="background-color: rgba(234, 179, 8, 0.1)">
              <div class="text-2xl font-bold text-yellow-500">5-6</div>
              <div class="text-xs text-gray-600 mt-1">一般</div>
            </div>
            <div class="p-2 rounded-lg" style="background-color: rgba(249, 115, 22, 0.1)">
              <div class="text-2xl font-bold text-orange-500">3-4</div>
              <div class="text-xs text-gray-600 mt-1">较弱</div>
            </div>
            <div class="p-2 rounded-lg" style="background-color: rgba(239, 68, 68, 0.1)">
              <div class="text-2xl font-bold text-red-500">1-2</div>
              <div class="text-xs text-gray-600 mt-1">需注意</div>
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-4 text-center leading-relaxed">
            本报告基于河洛数理、八字命理、渊海子平、三命通会、盲派八字等传统命理典籍，由AI结合现代解读生成，仅供参考。
          </p>
        </div>
      </div>
    </template>

    <!-- 无数据 -->
    <div v-else class="min-h-screen flex flex-col items-center justify-center p-6">
      <div class="text-center">
        <div class="text-6xl mb-4">📋</div>
        <h2 class="text-xl font-bold text-gray-700 mb-2">暂无命理报告</h2>
        <p class="text-gray-500 mb-6">请先创建档案或选择已有档案进行命理分析</p>
        <button @click="$router.push('/bazi')" class="chinese-btn">
          去测算
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'
import LifeFortuneCurve from '@/components/LifeFortuneCurve.vue'

const route = useRoute()
const loading = ref(false)
const report = ref<any>(null)
const profile = ref<any>(null)
const progress = ref(0)
const fortuneData = ref<any[]>([])
const fortuneEvents = ref<any[]>([])
const birthYear = ref<number>(0)
const analysisSteps = ref([
  { text: '解析四柱八字', status: 'pending' },
  { text: '分析五行配置', status: 'pending' },
  { text: '推算大运流年', status: 'pending' },
  { text: '解读十神关系', status: 'pending' },
  { text: '生成命理报告', status: 'pending' }
])

const wuxingData = computed(() => {
  if (!report.value?.wuxing) return []
  const wuxing = report.value.wuxing
  const total = wuxing.total || (wuxing.金 + wuxing.木 + wuxing.水 + wuxing.火 + wuxing.土) || 1
  return [
    { label: '金', count: wuxing.金 || 0, color: '#fbbf24', percentage: Math.round(((wuxing.金 || 0) / total) * 100) },
    { label: '木', count: wuxing.木 || 0, color: '#22c55e', percentage: Math.round(((wuxing.木 || 0) / total) * 100) },
    { label: '水', count: wuxing.水 || 0, color: '#3b82f6', percentage: Math.round(((wuxing.水 || 0) / total) * 100) },
    { label: '火', count: wuxing.火 || 0, color: '#ef4444', percentage: Math.round(((wuxing.火 || 0) / total) * 100) },
    { label: '土', count: wuxing.土 || 0, color: '#a855f7', percentage: Math.round(((wuxing.土 || 0) / total) * 100) }
  ]
})

const fourPillars = computed(() => {
  // 优先从report获取bazi数据
  const bazi = report.value?.bazi
  if (!bazi) return []
  
  const fp = bazi.fourPillars
  const tianGan = bazi.tianGan || []
  const diZhi = bazi.diZhi || []
  
  return [
    { label: '年柱', value: fp?.year || '', ganZhi: tianGan[0] || '' },
    { label: '月柱', value: fp?.month || '', ganZhi: tianGan[1] || '' },
    { label: '日柱', value: fp?.day || '', ganZhi: tianGan[2] || '' },
    { label: '时柱', value: fp?.hour || '', ganZhi: tianGan[3] || '' }
  ]
})

const modules = computed(() => {
  if (!report.value?.modules) return []
  return report.value.modules
})

const getScoreColor = (score: number) => {
  if (score >= 9) return '#22c55e'
  if (score >= 7) return '#84cc16'
  if (score >= 5) return '#eab308'
  if (score >= 3) return '#f97316'
  return '#ef4444'
}

const getModuleBgClass = (key: string) => {
  const bgClasses: Record<string, string> = {
    personality: 'bg-blue-100',
    career: 'bg-yellow-100',
    marriage: 'bg-pink-100',
    wealth: 'bg-green-100',
    health: 'bg-red-100',
    guiren: 'bg-purple-100',
    yearly: 'bg-orange-100',
    attention: 'bg-gray-100'
  }
  return bgClasses[key] || 'bg-gray-100'
}

const updateProgress = (stepIndex: number, status: 'pending' | 'active' | 'completed') => {
  analysisSteps.value.forEach((step, index) => {
    if (index < stepIndex) {
      step.status = 'completed'
    } else if (index === stepIndex) {
      step.status = status
    } else {
      step.status = 'pending'
    }
  })
  progress.value = Math.min(100, (stepIndex + 1) * 20)
}

const simulateProgress = () => {
  let step = 0
  const interval = setInterval(() => {
    if (step < 5) {
      updateProgress(step, 'active')
      if (step > 0) {
        updateProgress(step - 1, 'completed')
      }
      step++
    } else {
      clearInterval(interval)
    }
  }, 2000)
  return interval
}

const generateReport = async () => {
  // 优先从历史记录读取数据
  const historyDataStr = localStorage.getItem('historyReport')
  if (historyDataStr) {
    try {
      const historyData = JSON.parse(historyDataStr)
      
      // 填充 profile
      profile.value = {
        name: '历史记录',
        gender: historyData.gender || 'male',
        birthDate: historyData.birthDate || '',
        birthTime: historyData.birthTime || '',
        location: {}
      }
      
      // 计算出生年份
      const birthDateStr = historyData.birthDate || ''
      birthYear.value = birthDateStr ? parseInt(birthDateStr.split('-')[0]) : 1990
      
      // 解析 ai_result
      const aiResult = typeof historyData.aiResult === 'string' 
        ? JSON.parse(historyData.aiResult) 
        : historyData.aiResult
      
      // 构建 report 数据
      report.value = {
        overallScore: aiResult?.overallScore || 7,
        overallSummary: aiResult?.overallSummary || '',
        wuxing: aiResult?.wuxing || { 金: 1, 木: 1, 水: 1, 火: 1, 土: 1, total: 5 },
        modules: aiResult?.modules || {},
        // 从历史记录或 aiResult 中获取 bazi 数据
        bazi: aiResult?.bazi || historyData.baziData || null
      }
      
      // 填充运势数据
      fortuneData.value = aiResult?.fortuneData || []
      fortuneEvents.value = aiResult?.fortuneEvents || []
      
      // 清理历史记录数据
      localStorage.removeItem('historyReport')
      
      loading.value = false
      return
    } catch (e) {
      console.error('解析历史记录失败:', e)
      // 继续使用正常流程
    }
  }
  
  // 正常流程：从 currentProfile 读取并生成报告
  const stored = localStorage.getItem('currentProfile')
  if (!stored) {
    loading.value = false
    return
  }

  profile.value = JSON.parse(stored)
  loading.value = true
  progress.value = 0

  // 计算出生年份
  const birthDateStr = profile.value.birthDate || ''
  birthYear.value = birthDateStr ? parseInt(birthDateStr.split('-')[0]) : 1990

  const progressInterval = simulateProgress()

  try {
    // 并行请求报告和运势曲线数据
    const [reportRes, fortuneRes] = await Promise.all([
      api.post('/bazi/report', {
        birthDate: profile.value.birthDate,
        birthTime: profile.value.birthTime,
        gender: profile.value.gender,
        location: profile.value.location
      }),
      api.post('/fortune/kline', {
        birthDate: profile.value.birthDate,
        birthTime: profile.value.birthTime,
        gender: profile.value.gender
      }).catch(err => {
        console.warn('获取运势曲线失败:', err)
        return { data: { data: [], events: [] } }
      })
    ])

    report.value = reportRes.data
    fortuneData.value = fortuneRes.data.data || []
    fortuneEvents.value = fortuneRes.data.events || []

    // 保存到历史记录
    try {
      await api.post('/history', {
        type: 'full',
        birthDate: profile.value.birthDate || '',
        birthTime: profile.value.birthTime || '',
        gender: profile.value.gender || 'male',
        baziData: reportRes.data.bazi || null,
        aiResult: JSON.stringify({
          overallScore: reportRes.data.overallScore,
          overallSummary: reportRes.data.overallSummary,
          wuxing: reportRes.data.wuxing,
          modules: reportRes.data.modules,
          fortuneData: fortuneData.value,
          fortuneEvents: fortuneEvents.value,
          birthYear: birthYear.value,
          // 将 bazi 数据也保存到 aiResult 中，方便历史记录显示
          bazi: reportRes.data.bazi
        })
      })
    } catch (historyErr) {
      console.warn('保存历史记录失败:', historyErr)
    }

    analysisSteps.value.forEach(step => step.status = 'completed')
    progress.value = 100
  } catch (e: any) {
    console.error('生成报告失败:', e)
    const errorMessage = e.response?.data?.error || e.message || '生成报告失败，请重试'
    alert(errorMessage)
  } finally {
    clearInterval(progressInterval)
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
}

// 从历史记录加载报告
const loadFromHistory = async (historyId: string) => {
  loading.value = true
  try {
    const res = await api.get(`/history/${historyId}`)
    const record = res.data
    // 解析存储的完整报告数据
    try {
      const savedData = JSON.parse(record.ai_result)
      report.value = savedData
      // 加载运势曲线数据
      fortuneData.value = savedData.fortuneData || []
      fortuneEvents.value = savedData.fortuneEvents || []
      birthYear.value = savedData.birthYear || parseInt(record.birth_date?.split('-')[0] || '1990')
    } catch {
      // 如果不是JSON格式，说明是旧格式的纯文本结果
      report.value = null
      alert('该历史记录格式不支持完整展示，请重新测算')
    }
  } catch (e) {
    console.error('加载历史记录失败:', e)
    alert('加载历史记录失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const historyId = route.params.historyId as string
  if (historyId) {
    loadFromHistory(historyId)
  } else {
    generateReport()
  }
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
