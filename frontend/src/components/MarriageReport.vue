<template>
  <div class="marriage-report">
    <!-- 标题 -->
    <div class="text-center mb-8">
      <h2 class="chinese-title text-2xl mb-2">姻缘合婚分析报告</h2>
      <p class="text-china-brown">八字命理 · 传统智慧</p>
    </div>

    <!-- 综合评分卡片 -->
    <div class="bg-gradient-to-br from-red-50 to-yellow-50 rounded-xl p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div class="flex flex-col sm:flex-row items-center sm:items-center gap-4 text-center sm:text-left">
          <div class="text-5xl md:text-6xl">{{ marriageData.compatibility?.icon || '🪷' }}</div>
          <div>
            <div class="text-lg text-china-brown">综合契合度</div>
            <div class="text-3xl md:text-4xl font-bold text-china-red">{{ marriageData.overallScore || 75 }}</div>
            <div class="text-lg text-china-gold">{{ marriageData.compatibility?.level || '中吉' }}</div>
          </div>
        </div>
        <div class="text-center md:text-right">
          <div class="text-sm text-gray-500 mb-1">总体评价</div>
          <div class="text-china-brown">{{ marriageData.overallSummary || '命局配合良好，缘分深厚。' }}</div>
        </div>
      </div>
    </div>

    <!-- 八字信息对比 -->
    <div v-if="bazi1Data && bazi2Data" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="chinese-card p-4 md:p-6 bg-red-50">
        <div class="text-center mb-3">
          <div class="text-sm text-gray-500">{{ name1 || '命主' }}</div>
          <div class="text-2xl md:text-3xl font-bold text-china-red">{{ bazi1Data.dayMaster || '' }}日主</div>
        </div>
        <div class="grid grid-cols-4 gap-2 text-center text-sm">
          <div>
            <div class="text-xs text-gray-500">年柱</div>
            <div class="font-bold text-sm md:text-base">{{ bazi1Data.fourPillars?.year || '' }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500">月柱</div>
            <div class="font-bold text-sm md:text-base">{{ bazi1Data.fourPillars?.month || '' }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500">日柱</div>
            <div class="font-bold text-sm md:text-base">{{ bazi1Data.fourPillars?.day || '' }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500">时柱</div>
            <div class="font-bold text-sm md:text-base">{{ bazi1Data.fourPillars?.hour || '' }}</div>
          </div>
        </div>
        <div class="mt-3 text-center text-sm text-china-brown">
          五行：{{ bazi1Data.wuxingStr || '' }}
        </div>
      </div>

      <div class="chinese-card p-4 md:p-6 bg-blue-50">
        <div class="text-center mb-3">
          <div class="text-sm text-gray-500">{{ name2 || '配偶' }}</div>
          <div class="text-2xl md:text-3xl font-bold text-china-blue">{{ bazi2Data.dayMaster || '' }}日主</div>
        </div>
        <div class="grid grid-cols-4 gap-2 text-center text-sm">
          <div>
            <div class="text-xs text-gray-500">年柱</div>
            <div class="font-bold text-sm md:text-base">{{ bazi2Data.fourPillars?.year || '' }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500">月柱</div>
            <div class="font-bold text-sm md:text-base">{{ bazi2Data.fourPillars?.month || '' }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500">日柱</div>
            <div class="font-bold text-sm md:text-base">{{ bazi2Data.fourPillars?.day || '' }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500">时柱</div>
            <div class="font-bold text-sm md:text-base">{{ bazi2Data.fourPillars?.hour || '' }}</div>
          </div>
        </div>
        <div class="mt-3 text-center text-sm text-china-brown">
          五行：{{ bazi2Data.wuxingStr || '' }}
        </div>
      </div>
    </div>

    <!-- 六大分析模块 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div
        v-for="(module, key) in modules"
        :key="key"
        class="chinese-card p-4 md:p-5 hover:shadow-lg transition-shadow"
      >
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div class="text-4xl md:text-5xl">{{ module.icon }}</div>
          <div class="flex-1 w-full">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h3 class="font-bold text-china-brown text-base md:text-lg">{{ module.title }}</h3>
              <div class="flex items-center gap-2">
                <span class="text-xl md:text-2xl font-bold text-china-red">{{ module.score }}</span>
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

    <!-- 吉凶月份 -->
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
            <span class="mr-2">📅</span> 宜结婚日期
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
            <span class="mr-2">📅</span> 避开结婚日期
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

    <!-- 相处建议 -->
    <div class="chinese-card p-6 bg-china-cream">
      <h3 class="font-bold text-china-brown mb-4 text-center text-lg md:text-xl">
        <span class="text-2xl mr-2">💡</span> 相处建议与增福锦囊
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(tip, idx) in marriageData.tips"
          :key="idx"
          class="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-3 bg-white rounded-lg shadow-sm text-center sm:text-left"
        >
          <span class="text-2xl md:text-3xl">{{ getTipIcon(idx) }}</span>
          <span class="text-china-brown text-sm md:text-base">{{ tip }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  marriageData: any
  bazi1Data?: any
  bazi2Data?: any
  name1?: string
  name2?: string
}

const props = defineProps<Props>()

const modules = computed(() => {
  if (!props.marriageData?.modules) return {}
  return props.marriageData.modules
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
  const icons = ['🤝', '💪', '💕', '🏠', '💰', '🎯']
  return icons[idx % icons.length]
}
</script>

<style scoped>
.marriage-report {
  max-width: 1200px;
  margin: 0 auto;
}

.chinese-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
