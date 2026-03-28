<template>
  <div class="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 flex flex-col items-center justify-center p-4 sm:p-6">
    <div class="text-center mb-6">
      <div class="text-6xl sm:text-7xl mb-3 text-china-red">囍</div>
      <h2 class="text-xl sm:text-2xl font-bold text-china-red mb-1">姻缘合婚分析</h2>
      <p class="text-sm sm:text-base text-china-brown/80">正在为您测算天作之合...</p>
    </div>

    <div class="w-full max-w-md mb-5">
      <div class="relative">
        <div class="overflow-hidden h-2.5 sm:h-3 flex rounded-full bg-gray-200">
          <div
            :style="{ width: progress + '%' }"
            class="h-full bg-gradient-to-r from-china-red to-pink-400 transition-all duration-500"
          ></div>
        </div>
      </div>
      <div class="flex justify-between mt-1.5 text-xs text-gray-500">
        <span>开始分析</span>
        <span class="text-china-red font-semibold">{{ progress.toFixed(1) }}%</span>
        <span>分析完成</span>
      </div>
    </div>

    <div class="w-full max-w-md space-y-2 mb-5">
      <div
        v-for="(step, index) in analysisSteps"
        :key="index"
        class="flex items-center space-x-2.5 p-2.5 rounded-lg transition-all text-sm"
        :class="getStepClass(step.status)"
      >
        <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
             :class="getIconClass(step.status)">
          <span v-if="step.status === 'completed'">✓</span>
          <span v-else-if="step.status === 'active'" class="animate-pulse">{{ index + 1 }}</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <p class="flex-1 font-medium" :class="step.status === 'active' ? 'text-china-red' : 'text-gray-600'">
          {{ step.text }}
        </p>
        <div v-if="step.status === 'completed'" class="text-green-500">✓</div>
        <div v-else-if="step.status === 'active'" class="text-china-red animate-pulse">...</div>
      </div>
    </div>

    <div class="w-full max-w-md mb-4">
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-china-gold/20">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="text-lg">💡</span>
          <p class="text-xs text-china-gold font-medium">婚缘小知识</p>
        </div>
        <p class="text-center text-china-brown text-sm leading-relaxed">{{ currentTip }}</p>
      </div>
    </div>

    <div class="text-center">
      <p class="text-base sm:text-lg text-china-gold font-medium">🌸 良缘由夙缔，佳偶自天成 🌸</p>
      <p class="text-xs sm:text-sm text-gray-500 mt-2">报告预计需要 2-3 分钟生成，请稍候...</p>
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

const getStepClass = (status: string) => {
  return {
    'bg-green-50': status === 'completed',
    'bg-red-50': status === 'active',
    'bg-gray-50': status === 'pending'
  }
}

const getIconClass = (status: string) => {
  return {
    'bg-green-500 text-white': status === 'completed',
    'bg-china-red text-white': status === 'active',
    'bg-gray-300 text-gray-600': status === 'pending'
  }
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
