<template>
  <div class="marriage-report">
    <!-- 标题区 -->
    <div class="text-center mb-8 relative">
      <!-- 装饰双喜 -->
      <div class="absolute top-0 left-0 text-4xl opacity-20">囍</div>
      <div class="absolute top-0 right-0 text-4xl opacity-20">囍</div>
      
      <h2 class="text-2xl md:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-red-500">
        姻缘合婚分析报告
      </h2>
      <p class="text-rose-600 text-sm md:text-base">红线牵缘 · 佳偶天成</p>
    </div>

    <!-- 综合评分卡片 - 喜庆风格 -->
    <div class="bg-gradient-to-br from-rose-50 via-pink-50 to-yellow-50 rounded-2xl p-6 mb-6 border-2 border-rose-200 shadow-lg relative overflow-hidden">
      <!-- 装饰 -->
      <div class="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-dashed border-rose-300 rounded-tl-xl"></div>
      <div class="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-dashed border-rose-300 rounded-br-xl"></div>
      
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div class="flex flex-col sm:flex-row items-center sm:items-center gap-4 text-center sm:text-left">
          <!-- 圆形评分 -->
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-lg opacity-50"></div>
            <div class="relative w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl border-4 border-yellow-400">
              <div class="text-center">
                <div class="text-3xl md:text-4xl font-bold text-white">{{ marriageData.overallScore || 75 }}</div>
                <div class="text-xs text-rose-100">分</div>
              </div>
            </div>
          </div>
          <div>
            <div class="text-sm text-rose-600 mb-1">综合契合度</div>
            <div class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              {{ marriageData.compatibility?.level || '中吉' }}
            </div>
            <div class="text-2xl mt-1">{{ marriageData.compatibility?.icon || '💕' }}</div>
          </div>
        </div>
        <div class="text-center md:text-right bg-white/60 rounded-xl p-3">
          <div class="text-xs text-rose-500 mb-1 font-medium">总体评价</div>
          <div class="text-rose-700 text-sm md:text-base">{{ marriageData.overallSummary || '命局配合良好，缘分深厚。' }}</div>
        </div>
      </div>
      
      <!-- 评分条 -->
      <div class="mt-4">
        <div class="h-3 bg-white/50 rounded-full overflow-hidden shadow-inner">
          <div
            :style="{ width: (marriageData.overallScore || 75) * 10 + '%' }"
            class="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-red-400 transition-all duration-1000 rounded-full shadow-lg"
          ></div>
        </div>
      </div>
    </div>

    <!-- 八字信息对比 - 双卡片 -->
    <div v-if="bazi1Data && bazi2Data" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <!-- 命主卡片 -->
      <div class="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4 md:p-6 border-2 border-rose-200 shadow-md relative overflow-hidden group hover:shadow-xl transition-all">
        <!-- 装饰 -->
        <div class="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-bl-full"></div>
        
        <div class="text-center mb-4">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-full text-sm font-medium shadow-md">
            <span class="text-lg">👤</span>
            <span>{{ name1 || '命主' }}</span>
          </div>
        </div>
        
        <div class="text-center mb-4">
          <div class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-1">
            {{ bazi1Data.dayMaster || '' }}日主
          </div>
          <div class="text-sm text-rose-600">{{ bazi1Data.dayMasterWuxing || '' }}</div>
        </div>
        
        <!-- 四柱 -->
        <div class="grid grid-cols-4 gap-2 text-center text-sm">
          <div class="bg-white/60 rounded-lg p-2 shadow-sm">
            <div class="text-xs text-rose-500 mb-1">年柱</div>
            <div class="font-bold text-rose-700">{{ bazi1Data.fourPillars?.year || '' }}</div>
          </div>
          <div class="bg-white/60 rounded-lg p-2 shadow-sm">
            <div class="text-xs text-rose-500 mb-1">月柱</div>
            <div class="font-bold text-rose-700">{{ bazi1Data.fourPillars?.month || '' }}</div>
          </div>
          <div class="bg-white/60 rounded-lg p-2 shadow-sm">
            <div class="text-xs text-rose-500 mb-1">日柱</div>
            <div class="font-bold text-rose-700">{{ bazi1Data.fourPillars?.day || '' }}</div>
          </div>
          <div class="bg-white/60 rounded-lg p-2 shadow-sm">
            <div class="text-xs text-rose-500 mb-1">时柱</div>
            <div class="font-bold text-rose-700">{{ bazi1Data.fourPillars?.hour || '' }}</div>
          </div>
        </div>
        
        <!-- 五行 -->
        <div class="mt-4 text-center">
          <div class="inline-block px-4 py-2 bg-gradient-to-r from-yellow-400/80 to-orange-400/80 rounded-full text-sm font-medium text-yellow-800 shadow-sm">
            五行：{{ bazi1Data.wuxingStr || '' }}
          </div>
        </div>
      </div>

      <!-- 配偶卡片 -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border-2 border-blue-200 shadow-md relative overflow-hidden group hover:shadow-xl transition-all">
        <!-- 装饰 -->
        <div class="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-bl-full"></div>
        
        <div class="text-center mb-4">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium shadow-md">
            <span class="text-lg">💑</span>
            <span>{{ name2 || '配偶' }}</span>
          </div>
        </div>
        
        <div class="text-center mb-4">
          <div class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            {{ bazi2Data.dayMaster || '' }}日主
          </div>
          <div class="text-sm text-blue-600">{{ bazi2Data.dayMasterWuxing || '' }}</div>
        </div>
        
        <!-- 四柱 -->
        <div class="grid grid-cols-4 gap-2 text-center text-sm">
          <div class="bg-white/60 rounded-lg p-2 shadow-sm">
            <div class="text-xs text-blue-500 mb-1">年柱</div>
            <div class="font-bold text-blue-700">{{ bazi2Data.fourPillars?.year || '' }}</div>
          </div>
          <div class="bg-white/60 rounded-lg p-2 shadow-sm">
            <div class="text-xs text-blue-500 mb-1">月柱</div>
            <div class="font-bold text-blue-700">{{ bazi2Data.fourPillars?.month || '' }}</div>
          </div>
          <div class="bg-white/60 rounded-lg p-2 shadow-sm">
            <div class="text-xs text-blue-500 mb-1">日柱</div>
            <div class="font-bold text-blue-700">{{ bazi2Data.fourPillars?.day || '' }}</div>
          </div>
          <div class="bg-white/60 rounded-lg p-2 shadow-sm">
            <div class="text-xs text-blue-500 mb-1">时柱</div>
            <div class="font-bold text-blue-700">{{ bazi2Data.fourPillars?.hour || '' }}</div>
          </div>
        </div>
        
        <!-- 五行 -->
        <div class="mt-4 text-center">
          <div class="inline-block px-4 py-2 bg-gradient-to-r from-yellow-400/80 to-orange-400/80 rounded-full text-sm font-medium text-yellow-800 shadow-sm">
            五行：{{ bazi2Data.wuxingStr || '' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 六大分析模块 - 双列布局 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div
        v-for="(module, key) in modules"
        :key="key"
        class="bg-white rounded-xl p-4 md:p-5 border-2 border-rose-100 shadow-md hover:shadow-xl hover:border-rose-300 transition-all duration-300 group"
      >
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <!-- 图标 -->
          <div class="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center text-3xl md:text-4xl shadow-md group-hover:scale-110 transition-transform border-2 border-rose-200">
            {{ module.icon }}
          </div>
          
          <!-- 内容 -->
          <div class="flex-1 w-full">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h3 class="font-bold text-rose-700 text-base md:text-lg">{{ module.title }}</h3>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">{{ module.score }}</span>
                <span class="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md" :class="getLevelClass(module.level)">
                  {{ module.level }}
                </span>
              </div>
            </div>
            <p class="text-rose-600 text-sm leading-relaxed line-clamp-3">{{ module.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 吉凶月份 - 双卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <!-- 宜结婚月份 -->
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 shadow-md">
        <h3 class="font-bold text-green-700 mb-3 flex items-center text-lg">
          <span class="text-3xl mr-2 animate-bounce">✨</span>
          <span class="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">宜结婚月份</span>
        </h3>
        <ul class="space-y-2 mb-4">
          <li v-for="(month, idx) in marriageData.goodMonths" :key="idx" class="flex items-center text-green-700">
            <span class="w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mr-3 shadow-sm"></span>
            <span class="font-medium">{{ month }}</span>
          </li>
        </ul>
        
        <!-- 宜结婚日期 -->
        <div class="border-t-2 border-green-200 pt-3">
          <h4 class="text-sm font-semibold text-green-700 mb-2 flex items-center">
            <span class="text-xl mr-2">📅</span>
            <span>宜结婚日期</span>
          </h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(day, idx) in marriageData.goodDays"
              :key="idx"
              class="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-xs font-semibold text-yellow-900 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              {{ day }}
            </span>
          </div>
        </div>
      </div>

      <!-- 宜避开月份 -->
      <div class="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200 shadow-md">
        <h3 class="font-bold text-orange-700 mb-3 flex items-center text-lg">
          <span class="text-3xl mr-2">⚠️</span>
          <span class="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">宜避开月份</span>
        </h3>
        <ul class="space-y-2 mb-4">
          <li v-for="(month, idx) in marriageData.avoidMonths" :key="idx" class="flex items-center text-orange-700">
            <span class="w-3 h-3 bg-gradient-to-br from-red-400 to-rose-400 rounded-full mr-3 shadow-sm"></span>
            <span class="font-medium">{{ month }}</span>
          </li>
        </ul>
        
        <!-- 避开结婚日期 -->
        <div class="border-t-2 border-orange-200 pt-3">
          <h4 class="text-sm font-semibold text-orange-700 mb-2 flex items-center">
            <span class="text-xl mr-2">📅</span>
            <span>避开结婚日期</span>
          </h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(day, idx) in marriageData.avoidDays"
              :key="idx"
              class="px-3 py-1 bg-gradient-to-r from-red-400 to-rose-400 rounded-full text-xs font-semibold text-white shadow-sm"
            >
              {{ day }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 相处建议 -->
    <div class="bg-gradient-to-br from-yellow-50 via-orange-50 to-rose-50 rounded-2xl p-6 border-2 border-yellow-200 shadow-lg relative overflow-hidden">
      <!-- 装饰 -->
      <div class="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-br-full"></div>
      <div class="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-tl-full"></div>
      
      <h3 class="font-bold text-yellow-800 mb-4 text-center text-xl md:text-2xl">
        <span class="text-3xl mr-2">💡</span>
        <span class="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">相处建议与增福锦囊</span>
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(tip, idx) in marriageData.tips"
          :key="idx"
          class="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-4 bg-white/80 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-yellow-100"
        >
          <span class="text-3xl md:text-4xl animate-bounce">{{ getTipIcon(idx) }}</span>
          <span class="text-yellow-800 text-sm md:text-base text-center sm:text-left leading-relaxed">{{ tip }}</span>
        </div>
      </div>
    </div>

    <!-- 底部吉祥语 -->
    <div class="mt-8 text-center">
      <div class="inline-block px-8 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 rounded-full shadow-xl">
        <p class="text-white text-lg md:text-xl font-bold animate-pulse">
          🎊 愿百年好合，白头偕老 🎊
        </p>
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
    '上吉': 'bg-gradient-to-r from-yellow-400 to-orange-400',
    '大吉': 'bg-gradient-to-r from-green-400 to-emerald-500',
    '中吉': 'bg-gradient-to-r from-blue-400 to-indigo-500',
    '小吉': 'bg-gradient-to-r from-yellow-400 to-amber-500',
    '凶': 'bg-gradient-to-r from-red-400 to-rose-500'
  }
  return classes[level] || 'bg-gradient-to-r from-gray-400 to-gray-500'
}

const getTipIcon = (idx: number) => {
  const icons = ['🤝', '💪', '💕', '🏠', '💰', '🎯', '🌟', '✨', '💖']
  return icons[idx % icons.length]
}
</script>

<style scoped>
.marriage-report {
  max-width: 1200px;
  margin: 0 auto;
}

/* 渐变文字动画 */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

/* 卡片悬浮效果 */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* 进度条光泽 */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
