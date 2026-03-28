<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- 喜庆背景 - 红色渐变 -->
    <div class="absolute inset-0 bg-gradient-to-br from-rose-500 via-red-500 to-pink-600"></div>
    
    <!-- 动态背景装饰 -->
    <div class="absolute inset-0 opacity-20">
      <!-- 浮动的心形 -->
      <div class="absolute top-10 left-10 w-16 h-16 animate-float-1">
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-white">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div class="absolute top-20 right-20 w-12 h-12 animate-float-2">
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-white">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div class="absolute bottom-20 left-1/4 w-14 h-14 animate-float-3">
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-white">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div class="absolute bottom-10 right-10 w-10 h-10 animate-float-1">
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-white">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
    </div>

    <!-- 双喜装饰 -->
    <div class="absolute top-4 left-4 text-6xl text-white opacity-20 font-bold animate-spin-slow">囍</div>
    <div class="absolute top-4 right-4 text-6xl text-white opacity-20 font-bold animate-spin-slow">囍</div>
    <div class="absolute bottom-4 left-1/4 text-4xl text-white opacity-10 font-bold">囍</div>
    <div class="absolute bottom-4 right-1/4 text-4xl text-white opacity-10 font-bold">囍</div>

    <!-- 主要内容 -->
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
      <!-- 中央图案 -->
      <div class="text-center mb-8">
        <!-- 圆形装饰框 -->
        <div class="relative inline-block">
          <div class="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <div class="relative w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-white to-rose-100 rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-400">
            <!-- 莲花图案 -->
            <svg class="w-20 h-20 md:w-24 md:h-24" viewBox="0 0 100 100">
              <!-- 莲花花瓣 -->
              <g fill="#f43f5e">
                <ellipse cx="50" cy="30" rx="12" ry="20" transform="rotate(0 50 50)"/>
                <ellipse cx="50" cy="30" rx="12" ry="20" transform="rotate(45 50 50)"/>
                <ellipse cx="50" cy="30" rx="12" ry="20" transform="rotate(90 50 50)"/>
                <ellipse cx="50" cy="30" rx="12" ry="20" transform="rotate(135 50 50)"/>
                <ellipse cx="50" cy="30" rx="12" ry="20" transform="rotate(180 50 50)"/>
                <ellipse cx="50" cy="30" rx="12" ry="20" transform="rotate(225 50 50)"/>
                <ellipse cx="50" cy="30" rx="12" ry="20" transform="rotate(270 50 50)"/>
                <ellipse cx="50" cy="30" rx="12" ry="20" transform="rotate(315 50 50)"/>
              </g>
              <!-- 花蕊 -->
              <circle cx="50" cy="50" r="15" fill="#fbbf24"/>
              <text x="50" y="55" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">缘</text>
            </svg>
          </div>
          <!-- 旋转光环 -->
          <div class="absolute inset-0 animate-spin" style="animation-duration: 10s;">
            <svg class="w-full h-full" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="75" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="8 8"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 标题 -->
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-200 to-yellow-300 animate-pulse">
          姻缘合婚分析中
        </h2>
        <p class="text-rose-100 text-base md:text-lg mb-2">红线牵缘，佳偶天成</p>
        <p class="text-rose-200 text-sm">正在分析两人的八字命理匹配度...</p>
      </div>

      <!-- 进度条 - 喜庆风格 -->
      <div class="w-full max-w-md mb-8">
        <div class="relative">
          <div class="h-4 bg-white/30 backdrop-blur rounded-full overflow-hidden shadow-inner border-2 border-yellow-400">
            <div
              :style="{ width: progress + '%' }"
              class="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 transition-all duration-700 ease-out rounded-full relative overflow-hidden"
            >
              <!-- 进度条光泽效果 -->
              <div class="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent"></div>
              <!-- 进度条动画 -->
              <div class="absolute inset-0 animate-shimmer"></div>
            </div>
          </div>
          <!-- 进度点 -->
          <div class="absolute top-0 left-0 right-0 h-4 flex items-center">
            <div
              v-for="i in 10"
              :key="i"
              class="absolute w-3 h-3 rounded-full border-2 border-white transition-all duration-300"
              :class="progress >= i * 10 ? 'bg-yellow-400 transform -translate-x-1/2 shadow-lg' : 'bg-white/50'"
              :style="{ left: `${i * 10}%` }"
            ></div>
          </div>
        </div>
        <div class="flex justify-between mt-6 text-sm font-medium">
          <span class="text-rose-100 flex items-center gap-2">
            <span class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            红线牵引
          </span>
          <span class="text-3xl font-bold text-white animate-bounce">{{ progress.toFixed(0) }}%</span>
          <span class="text-rose-100 flex items-center gap-2">
            良缘天定
            <span class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
          </span>
        </div>
      </div>

      <!-- 分析步骤 - 喜庆风格 -->
      <div class="w-full max-w-md space-y-3 mb-8">
        <div
          v-for="(step, index) in analysisSteps"
          :key="index"
          class="flex items-center gap-3 p-4 rounded-xl transition-all duration-500 backdrop-blur-sm"
          :class="{
            'bg-gradient-to-r from-green-400/80 to-emerald-400/80 border-2 border-green-300 shadow-lg': step.status === 'completed',
            'bg-gradient-to-r from-yellow-400/80 to-orange-400/80 border-2 border-yellow-300 shadow-lg animate-pulse': step.status === 'active',
            'bg-white/30 border-2 border-white/30': step.status === 'pending'
          }"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-md transition-all duration-300"
            :class="{
              'bg-gradient-to-br from-green-500 to-emerald-600 text-white': step.status === 'completed',
              'bg-gradient-to-br from-yellow-500 to-orange-500 text-white': step.status === 'active',
              'bg-white/50 text-rose-300 border-2 border-rose-200': step.status === 'pending'
            }"
          >
            <span v-if="step.status === 'completed'" class="text-xl">✓</span>
            <span v-else-if="step.status === 'active'" class="animate-bounce">{{ index + 1 }}</span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div class="flex-1">
            <p
              class="text-sm font-semibold transition-colors"
              :class="{
                'text-white': step.status === 'completed' || step.status === 'active',
                'text-rose-200': step.status === 'pending'
              }"
            >
              {{ step.text }}
            </p>
            <p
              v-if="step.status === 'active'"
              class="text-xs text-yellow-100 mt-1"
            >
              ✨ 正在分析中...
            </p>
            <p
              v-else-if="step.status === 'completed'"
              class="text-xs text-green-100 mt-1"
            >
              ✅ 已完成
            </p>
          </div>
          <!-- 完成时的对勾动画 -->
          <div
            v-if="step.status === 'completed'"
            class="text-2xl animate-bounce"
          >
            💕
          </div>
        </div>
      </div>

      <!-- 小贴士 -->
      <div class="w-full max-w-md">
        <div class="bg-gradient-to-r from-yellow-400/90 to-orange-400/90 rounded-xl p-4 shadow-xl border-2 border-yellow-300 backdrop-blur">
          <div class="flex items-start gap-3">
            <div class="text-3xl animate-pulse">💡</div>
            <div class="flex-1">
              <p class="text-yellow-900 text-xs font-semibold mb-1">温馨提示</p>
              <p class="text-yellow-800 text-sm leading-relaxed">{{ currentTip }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div class="mt-8 text-center">
        <p class="text-rose-200 text-sm italic animate-pulse">
          🎊 愿有情人终成眷属 🎊
        </p>
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
  '日主关系反映了婚后相处模式',
  '缘分天定，更需彼此珍惜经营'
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

<style scoped>
/* 浮动动画 */
@keyframes float-1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

@keyframes float-2 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-10deg); }
}

@keyframes float-3 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-25px) rotate(15deg); }
}

.animate-float-1 {
  animation: float-1 4s ease-in-out infinite;
}

.animate-float-2 {
  animation: float-2 5s ease-in-out infinite;
}

.animate-float-3 {
  animation: float-3 6s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin 20s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 光泽动画 */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
}
</style>
