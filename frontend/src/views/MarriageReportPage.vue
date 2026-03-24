<template>
  <div class="marriage-report-page max-w-6xl mx-auto p-4">
    <div v-if="loading" class="text-center py-20">
      <div class="text-6xl mb-4 animate-pulse">🪷</div>
      <p class="text-china-brown text-lg">正在加载报告...</p>
    </div>

    <div v-else-if="marriageData" class="marriage-report">
      <div class="flex justify-between items-center mb-6">
        <h2 class="chinese-title text-2xl">姻缘合婚分析报告</h2>
        <button @click="goBack" class="px-4 py-2 border border-china-gold rounded-lg hover:bg-gray-50">
          返回
        </button>
      </div>

      <div class="bg-gradient-to-br from-red-50 to-yellow-50 rounded-xl p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-4">
            <div class="text-6xl">{{ marriageData.compatibility?.icon || '🪷' }}</div>
            <div>
              <div class="text-lg text-china-brown">综合契合度</div>
              <div class="text-4xl font-bold text-china-red">{{ marriageData.overallScore || 75 }}</div>
              <div class="text-xl text-china-gold">{{ marriageData.compatibility?.level || '中吉' }}</div>
            </div>
          </div>
          <div class="text-right max-w-lg">
            <div class="text-sm text-gray-500 mb-1">总体评价</div>
            <div class="text-china-brown">{{ marriageData.overallSummary || '命局配合良好，缘分深厚。' }}</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="chinese-card p-4 bg-red-50">
          <div class="text-center mb-3">
            <div class="text-sm text-gray-500">{{ name1 || '命主' }}</div>
            <div class="text-2xl font-bold text-china-red">{{ bazi1Data?.dayMaster || '' }}日主</div>
          </div>
          <div class="grid grid-cols-4 gap-2 text-center text-sm">
            <div>
              <div class="text-xs text-gray-500">年柱</div>
              <div class="font-bold">{{ bazi1Data?.fourPillars?.year || '' }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500">月柱</div>
              <div class="font-bold">{{ bazi1Data?.fourPillars?.month || '' }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500">日柱</div>
              <div class="font-bold">{{ bazi1Data?.fourPillars?.day || '' }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500">时柱</div>
              <div class="font-bold">{{ bazi1Data?.fourPillars?.hour || '' }}</div>
            </div>
          </div>
          <div class="mt-3 text-center text-sm text-china-brown">
            五行：{{ bazi1Data?.wuxingStr || '' }}
          </div>
        </div>

        <div class="chinese-card p-4 bg-blue-50">
          <div class="text-center mb-3">
            <div class="text-sm text-gray-500">{{ name2 || '配偶' }}</div>
            <div class="text-2xl font-bold text-china-blue">{{ bazi2Data?.dayMaster || '' }}日主</div>
          </div>
          <div class="grid grid-cols-4 gap-2 text-center text-sm">
            <div>
              <div class="text-xs text-gray-500">年柱</div>
              <div class="font-bold">{{ bazi2Data?.fourPillars?.year || '' }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500">月柱</div>
              <div class="font-bold">{{ bazi2Data?.fourPillars?.month || '' }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500">日柱</div>
              <div class="font-bold">{{ bazi2Data?.fourPillars?.day || '' }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500">时柱</div>
              <div class="font-bold">{{ bazi2Data?.fourPillars?.hour || '' }}</div>
            </div>
          </div>
          <div class="mt-3 text-center text-sm text-china-brown">
            五行：{{ bazi2Data?.wuxingStr || '' }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          v-for="(module, key) in modules"
          :key="key"
          class="chinese-card p-4 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-start space-x-4">
            <div class="text-4xl">{{ module.icon }}</div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-china-brown">{{ module.title }}</h3>
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold text-china-red">{{ module.score }}</span>
                  <span class="px-2 py-1 rounded text-xs" :class="getLevelClass(module.level)">
                    {{ module.level }}
                  </span>
                </div>
              </div>
              <p class="text-china-brown text-sm leading-relaxed">{{ module.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="chinese-card p-4 bg-green-50">
          <h3 class="font-bold text-china-brown mb-3 flex items-center">
            <span class="text-2xl mr-2">✅</span> 宜结婚月份
          </h3>
          <ul class="space-y-2 mb-4">
            <li v-for="(month, idx) in marriageData.goodMonths" :key="idx" class="flex items-center text-china-brown">
              <span class="w-2 h-2 bg-china-gold rounded-full mr-2"></span>
              {{ month }}
            </li>
          </ul>
          <div class="border-t border-green-200 pt-3">
            <h4 class="text-sm font-semibold text-china-brown mb-2 flex items-center">
              <span class="mr-2">☰</span> 宜结婚日期
            </h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(day, idx) in marriageData.goodDays"
                :key="idx"
                class="px-2 py-1 bg-white border border-china-gold rounded text-xs text-china-brown"
              >
                {{ day }}
              </span>
            </div>
          </div>
        </div>

        <div class="chinese-card p-4 bg-red-50">
          <h3 class="font-bold text-china-brown mb-3 flex items-center">
            <span class="text-2xl mr-2">⚠️</span> 宜避开月份
          </h3>
          <ul class="space-y-2 mb-4">
            <li v-for="(month, idx) in marriageData.avoidMonths" :key="idx" class="flex items-center text-china-brown">
              <span class="w-2 h-2 bg-china-red rounded-full mr-2"></span>
              {{ month }}
            </li>
          </ul>
          <div class="border-t border-red-200 pt-3">
            <h4 class="text-sm font-semibold text-china-brown mb-2 flex items-center">
              <span class="mr-2">☷</span> 避开结婚日期
            </h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(day, idx) in marriageData.avoidDays"
                :key="idx"
                class="px-2 py-1 bg-white border border-china-red rounded text-xs text-china-red"
              >
                {{ day }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="chinese-card p-6 bg-china-cream mb-6">
        <h3 class="font-bold text-china-brown mb-4 text-center">
          <span class="text-2xl mr-2">💡</span> 相处建议与增福锦囊
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(tip, idx) in marriageData.tips"
            :key="idx"
            class="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm"
          >
            <span class="text-2xl">{{ getTipIcon(idx) }}</span>
            <span class="text-china-brown">{{ tip }}</span>
          </div>
        </div>
      </div>

      <div class="chinese-card p-6">
        <h3 class="font-bold text-china-brown mb-4 text-center">
          <span class="text-2xl mr-2">☲</span> 推荐结婚吉日（万年历精选）
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(day, idx) in recommendedDays"
            :key="idx"
            class="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-china-gold"
          >
            <div class="text-center">
              <div class="text-lg font-bold text-china-red">{{ day.date }}</div>
              <div class="text-sm text-china-brown mt-2">{{ day.lunar }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ day.fitness }}</div>
              <div class="mt-2 px-2 py-1 bg-china-gold text-white text-xs rounded">
                {{ day.reason }}
              </div>
            </div>
          </div>
          <div v-if="recommendedDays.length === 0" class="col-span-full text-center py-8 text-gray-500">
            暂无推荐吉日数据
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <div class="text-6xl mb-4">🔍</div>
      <p class="text-china-brown text-lg mb-4">未找到报告数据</p>
      <button @click="goBack" class="px-6 py-2 bg-china-red text-white rounded-lg hover:bg-red-700">
        返回上一页
      </button>
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
    '上吉': 'bg-china-gold text-white',
    '大吉': 'bg-green-500 text-white',
    '中吉': 'bg-blue-500 text-white',
    '小吉': 'bg-yellow-500 text-white',
    '凶': 'bg-red-500 text-white'
  }
  return classes[level] || 'bg-gray-500 text-white'
}

const getTipIcon = (idx: number) => {
  const icons = ['☀️', '🌙', '⭐', '🌟', '✨', '💫']
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
.chinese-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
