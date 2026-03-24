<template>
  <div class="device-info-panel fixed bottom-4 left-4 z-[9999]">
    <!-- 设备信息面板 -->
    <div 
      v-if="showPanel"
      class="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 mb-2 min-w-[200px] text-xs"
    >
      <div class="flex items-center justify-between mb-2">
        <span class="font-semibold text-china-brown">设备信息</span>
        <button 
          @click="showPanel = false"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-1 text-gray-600">
        <div class="flex justify-between">
          <span>设备类型:</span>
          <span class="font-medium" :class="deviceClass">{{ deviceTypeLabel }}</span>
        </div>
        <div class="flex justify-between">
          <span>屏幕宽度:</span>
          <span class="font-medium">{{ windowWidth }}px</span>
        </div>
        <div class="flex justify-between">
          <span>屏幕高度:</span>
          <span class="font-medium">{{ windowHeight }}px</span>
        </div>
        <div class="flex justify-between">
          <span>触摸设备:</span>
          <span class="font-medium">{{ isTouchDevice ? '是' : '否' }}</span>
        </div>
        <div class="flex justify-between">
          <span>显示模式:</span>
          <span class="font-medium" :class="modeClass">{{ displayModeLabel }}</span>
        </div>
      </div>
      
      <!-- 模式切换按钮 -->
      <div class="mt-3 pt-2 border-t border-gray-200">
        <button
          @click="toggleMode"
          class="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="displayMode === 'mobile' 
            ? 'bg-china-gold text-white hover:bg-yellow-600' 
            : 'bg-china-red text-white hover:bg-red-700'"
        >
          {{ displayMode === 'mobile' ? '切换到桌面模式' : '切换到手机模式' }}
        </button>
      </div>
    </div>
    
    <!-- 切换按钮 -->
    <button
      v-if="!showPanel"
      @click="showPanel = true"
      class="bg-white text-china-brown p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
      title="显示设备信息"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDevice } from '@/composables/useDevice'

const { 
  windowWidth, 
  windowHeight, 
  deviceType, 
  isTouchDevice, 
  displayMode,
  setMobilePreview 
} = useDevice()

const showPanel = ref(false)

const deviceTypeLabel = computed(() => {
  const labels: Record<string, string> = {
    mobile: '📱 手机',
    tablet: '📱 平板',
    desktop: '💻 桌面'
  }
  return labels[deviceType.value] || deviceType.value
})

const displayModeLabel = computed(() => {
  return displayMode.value === 'mobile' ? '📱 手机视图' : '💻 桌面视图'
})

const deviceClass = computed(() => {
  return {
    'text-china-red': deviceType.value === 'mobile',
    'text-blue-600': deviceType.value === 'tablet',
    'text-green-600': deviceType.value === 'desktop'
  }
})

const modeClass = computed(() => {
  return {
    'text-china-red': displayMode.value === 'mobile',
    'text-green-600': displayMode.value === 'desktop'
  }
})

function toggleMode() {
  setMobilePreview(displayMode.value === 'mobile')
}
</script>

<style scoped>
.device-info-panel {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
</style>
