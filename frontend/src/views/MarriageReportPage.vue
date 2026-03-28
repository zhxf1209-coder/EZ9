<template>
  <div class="marriage-report-page bg-gradient-to-b from-red-50 to-orange-50">
    <div class="max-w-6xl mx-auto p-3 sm:p-4">
      <div v-if="loading" class="flex flex-col items-center justify-center min-h-screen">
        <div class="text-7xl text-china-red mb-4">囍</div>
        <p class="text-china-red text-xl font-bold">正在加载婚缘报告...</p>
      </div>

      <div v-else-if="marriageData" class="marriage-report space-y-4">
        
        <div class="flex justify-between items-center">
          <h2 class="text-xl sm:text-2xl font-bold text-china-red">囍 姻缘合婚分析报告</h2>
          <button @click="goBack" 
                  class="px-3 py-1.5 sm:px-4 sm:py-2 bg-china-red text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base">
            返回
          </button>
        </div>

        <div class="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg sm:rounded-xl p-4 sm:p-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 sm:space-x-4">
              <div class="text-4xl sm:text-5xl sm:text-6xl">{{ marriageData.compatibility?.icon || '💕' }}</div>
              <div>
                <div class="text-sm sm:text-base text-gray-600 mb-1">综合契合度</div>
                <div class="text-3xl sm:text-4xl sm:text-5xl font-bold text-china-red">{{ marriageData.overallScore || 75 }}</div>
                <div class="text-lg sm:text-xl text-china-gold font-bold">{{ marriageData.compatibility?.level || '中吉' }}</div>
              </div>
            </div>
            <div class="text-right max-w-xs sm:max-w-md">
              <div class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">总体评价</div>
              <div class="text-sm sm:text-base text-china-brown">{{ marriageData.overallSummary || '命局配合良好，缘分深厚。' }}</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white rounded-lg p-3 sm:p-4 shadow">
            <div class="text-center mb-2 sm:mb-3">
              <div class="text-xs sm:text-sm text-gray-500">{{ name1 || '命主' }}</div>
              <div class="text-lg sm:text-xl sm:text-2xl font-bold text-china-red mt-1">{{ bazi1Data?.dayMaster || '' }}日主</div>
            </div>
            <div class="grid grid-cols-4 gap-1 sm:gap-2 text-center text-xs sm:text-sm">
              <div class="bg-gray-50 rounded p-1.5 sm:p-2">
                <div class="text-xs text-gray-500">年柱</div>
                <div class="font-bold text-xs sm:text-sm">{{ bazi1Data?.fourPillars?.year || '' }}</div>
              </div>
              <div class="bg-gray-50 rounded p-1.5 sm:p-2">
                <div class="text-xs text-gray-500">月柱</div>
                <div class="font-bold text-xs sm:text-sm">{{ bazi1Data?.fourPillars?.month || '' }}</div>
              </div>
              <div class="bg-gray-50 rounded p-1.5 sm:p-2">
                <div class="text-xs text-gray-500">日柱</div>
                <div class="font-bold text-xs sm:text-sm">{{ bazi1Data?.fourPillars?.day || '' }}</div>
              </div>
              <div class="bg-gray-50 rounded p-1.5 sm:p-2">
                <div class="text-xs text-gray-500">时柱</div>
                <div class="font-bold text-xs sm:text-sm">{{ bazi1Data?.fourPillars?.hour || '' }}</div>
              </div>
            </div>
            <div class="mt-2 sm:mt-3 text-center text-xs sm:text-sm text-china-brown">
              五行：{{ bazi1Data?.wuxingStr || '' }}
            </div>
          </div>

          <div class="bg-white rounded-lg p-3 sm:p-4 shadow">
            <div class="text-center mb-2 sm:mb-3">
              <div class="text-xs sm:text-sm text-gray-500">{{ name2 || '配偶' }}</div>
              <div class="text-lg sm:text-xl sm:text-2xl font-bold text-blue-600 mt-1">{{ bazi2Data?.dayMaster || '' }}日主</div>
            </div>
            <div class="grid grid-cols-4 gap-1 sm:gap-2 text-center text-xs sm:text-sm">
              <div class="bg-gray-50 rounded p-1.5 sm:p-2">
                <div class="text-xs text-gray-500">年柱</div>
                <div class="font-bold text-xs sm:text-sm">{{ bazi2Data?.fourPillars?.year || '' }}</div>
              </div>
              <div class="bg-gray-50 rounded p-1.5 sm:p-2">
                <div class="text-xs text-gray-500">月柱</div>
                <div class="font-bold text-xs sm:text-sm">{{ bazi2Data?.fourPillars?.month || '' }}</div>
              </div>
              <div class="bg-gray-50 rounded p-1.5 sm:p-2">
                <div class="text-xs text-gray-500">日柱</div>
                <div class="font-bold text-xs sm:text-sm">{{ bazi2Data?.fourPillars?.day || '' }}</div>
              </div>
              <div class="bg-gray-50 rounded p-1.5 sm:p-2">
                <div class="text-xs text-gray-500">时柱</div>
                <div class="font-bold text-xs sm:text-sm">{{ bazi2Data?.fourPillars?.hour || '' }}</div>
              </div>
            </div>
            <div class="mt-2 sm:mt-3 text-center text-xs sm:text-sm text-china-brown">
              五行：{{ bazi2Data?.wuxingStr || '' }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(module, key) in modules"
            :key="key"
            class="bg-white rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition"
          >
            <div class="flex items-start space-x-2 sm:space-x-3">
              <div class="text-3xl sm:text-4xl">{{ module.icon }}</div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1 sm:mb-2">
                  <h3 class="font-bold text-sm sm:text-base text-china-brown">{{ module.title }}</h3>
                  <div class="flex items-center space-x-1 sm:space-x-2">
                    <span class="text-lg sm:text-xl sm:text-2xl font-bold text-china-red">{{ module.score }}</span>
                    <span class="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs text-white" :class="getLevelClass(module.level)">
                      {{ module.level }}
                    </span>
                  </div>
                </div>
                <p class="text-xs sm:text-sm text-china-brown leading-relaxed">{{ module.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-green-50 rounded-lg p-3 sm:p-4">
            <h3 class="font-bold text-sm sm:text-base text-green-700 mb-2 sm:mb-3">✅ 宜结婚月份</h3>
            <ul class="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
              <li v-for="(month, idx) in marriageData.goodMonths" :key="idx" class="text-green-800 text-sm">
                {{ month }}
              </li>
            </ul>
            <div class="border-t border-green-200 pt-2 sm:pt-3">
              <h4 class="text-xs sm:text-sm font-semibold text-green-700 mb-1 sm:mb-2">📅 宜结婚日期</h4>
              <div class="flex flex-wrap gap-1 sm:gap-2">
                <span
                  v-for="(day, idx) in marriageData.goodDays"
                  :key="idx"
                  class="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-500 text-white rounded text-xs sm:text-sm"
                >
                  {{ day }}
                </span>
              </div>
            </div>
          </div>

          <div class="bg-red-50 rounded-lg p-3 sm:p-4">
            <h3 class="font-bold text-sm sm:text-base text-red-700 mb-2 sm:mb-3">⚠️ 宜避开月份</h3>
            <ul class="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
              <li v-for="(month, idx) in marriageData.avoidMonths" :key="idx" class="text-red-800 text-sm">
                {{ month }}
              </li>
            </ul>
            <div class="border-t border-red-200 pt-2 sm:pt-3">
              <h4 class="text-xs sm:text-sm font-semibold text-red-700 mb-1 sm:mb-2">📅 避开结婚日期</h4>
              <div class="flex flex-wrap gap-1 sm:gap-2">
                <span
                  v-for="(day, idx) in marriageData.avoidDays"
                  :key="idx"
                  class="px-2 sm:px-3 py-0.5 sm:py-1 bg-red-500 text-white rounded text-xs sm:text-sm"
                >
                  {{ day }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-purple-50 rounded-lg p-3">
          <h3 class="font-bold text-sm text-china-brown mb-2 text-center">💡 相处建议与增福锦囊</h3>
          <div class="space-y-2">
            <div
              v-for="(tip, idx) in marriageData.tips"
              :key="idx"
              class="flex items-center gap-2 p-2 bg-white rounded-lg"
            >
              <span class="text-lg flex-shrink-0">{{ getTipIcon(idx) }}</span>
              <span class="text-xs sm:text-sm text-china-brown">{{ tip }}</span>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 rounded-lg p-3">
          <h3 class="font-bold text-sm text-china-red mb-2 text-center">☲ 推荐结婚吉日</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <div
              v-for="(day, idx) in recommendedDays"
              :key="idx"
              class="p-2 bg-white rounded-lg text-center"
            >
              <div class="text-sm sm:text-base font-bold text-china-red">{{ day.date }}</div>
              <div class="text-xs text-china-brown mt-0.5">{{ day.lunar }}</div>
              <div class="text-xs text-gray-500 mt-0.5">{{ day.fitness }}</div>
              <div class="mt-1 px-2 py-0.5 bg-china-gold text-white rounded text-xs">
                {{ day.reason }}
              </div>
            </div>
            <div v-if="recommendedDays.length === 0" class="col-span-full text-center py-3 text-gray-500">
              暂无推荐吉日数据
            </div>
          </div>
        </div>

        <div class="text-center py-3 sm:py-4 bg-china-red text-white rounded-lg">
          <p class="text-sm sm:text-base font-bold">🌸 良缘由夙缔，佳偶自天成 🌸</p>
          <p class="text-xs opacity-90 mt-0.5">愿天下有情人终成眷属，白头偕老</p>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center min-h-screen">
        <div class="text-7xl text-china-red mb-4">🔍</div>
        <p class="text-china-brown text-xl mb-4">未找到报告数据</p>
        <button @click="goBack" 
                class="px-5 py-2.5 bg-china-red text-white rounded-lg hover:bg-red-700 text-base">
          返回上一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const marriageData = ref<any>(null)
const bazi1Data = ref<any>(null)
const bazi2Data = ref<any>(null)
const name1 = ref('')
const name2 = ref('')

const modules = computed(() => {
  if (!marriageData.value?.modules) return {}
  return marriageData.value.modules
})

const recommendedDays = computed(() => {
  if (!marriageData.value?.recommendedDays) return []
  return marriageData.value.recommendedDays
})

const getLevelClass = (level: string) => {
  const classes: Record<string, string> = {
    '上吉': 'bg-china-gold',
    '大吉': 'bg-green-500',
    '中吉': 'bg-blue-500',
    '小吉': 'bg-yellow-500',
    '凶': 'bg-red-500'
  }
  return classes[level] || 'bg-gray-500'
}

const getTipIcon = (idx: number) => {
  const icons = ['☀️', '🌙', '⭐', '🌟', '✨', '💫', '🎊', '🎉', '💕']
  return icons[idx % icons.length]
}

const goBack = () => {
  router.push('/event')
}

onMounted(() => {
  try {
    const savedData = localStorage.getItem('marriageReport')
    if (savedData) {
      const data = JSON.parse(savedData)
      marriageData.value = data.marriageResult
      bazi1Data.value = data.bazi1
      bazi2Data.value = data.bazi2
      name1.value = data.name1
      name2.value = data.name2
    }
  } catch (e) {
    console.error('加载报告数据失败:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
</style>
