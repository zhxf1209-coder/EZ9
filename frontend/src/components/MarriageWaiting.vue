<template>
  <div class="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 flex flex-col items-center justify-center p-6">
    <div class="text-center mb-8">
      <div class="text-6xl mb-4">🪷☯🪷</div>
      <h2 class="text-2xl font-bold text-china-red mb-2">姻缘合婚分析中</h2>
      <p class="text-china-brown mb-2">正在分析两人的八字命理匹配度...</p>
      <p class="text-sm text-gray-500">预计需要 2-3 分钟，请稍候</p>
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
        <span>{{ progress.toFixed(2) }}%</span>
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

    <!-- 小贴士 -->
    <div class="mt-8 w-full max-w-md">
      <div class="bg-white/60 rounded-lg p-4">
        <p class="text-xs text-gray-500 mb-2">💡 小贴士</p>
        <p class="text-sm text-china-brown">{{ currentTip }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const progress = ref(0)

const tips = [
  '八字合婚不仅看属相，更要看命局的整体配合',
  '五行相生相助的两个人，生活上更容易互相扶持',
  '婚姻宫的状态决定了婚后的感情稳定性',
  '大运同步的两个人，人生节奏更契合',
  '日主关系反映了婚后相处模式'
]

const currentTip = ref(tips[0])

const analysisSteps = ref([
  { text: '解析命主八字四柱', status: 'pending' },
  { text: '解析配偶八字四柱', status: 'pending' },
  { text: '分析五行互补关系', status: 'pending' },
  { text: '推算婚姻缘分指数', status: 'pending' },
  { text: '测算最佳结婚吉日', status: 'pending' },
  { text: '生成合婚报告', status: 'pending' }
])

let progressInterval: any = null
let tipInterval: any = null

const startProgress = () => {
  progressInterval = setInterval(() => {
    if (progress.value < 95) {
      progress.value += Math.random() * 3
    }
  }, 500)
  
  tipInterval = setInterval(() => {
    currentTip.value = tips[Math.floor(Math.random() * tips.length)]
  }, 3000)
}

const completeProgress = () => {
  clearInterval(progressInterval)
  clearInterval(tipInterval)
  progress.value = 100
  analysisSteps.value.forEach(step => step.status = 'completed')
}

const resetProgress = () => {
  progress.value = 0
  analysisSteps.value.forEach(step => step.status = 'pending')
}

onMounted(() => {
  startProgress()
})

defineExpose({
  completeProgress,
  resetProgress,
  analysisSteps
})
</script>
