<template>
  <router-link 
    :to="to" 
    class="feature-card-compact flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 active:scale-[0.98] transition-transform"
    :class="borderClass"
  >
    <!-- 图标 -->
    <div class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" :class="iconBgClass">
      <ChineseIcon :type="iconType" :size="32" />
    </div>
    
    <!-- 内容 -->
    <div class="flex-1 min-w-0">
      <h3 class="text-base font-semibold text-gray-800 mb-0.5 truncate">
        {{ title }}
      </h3>
      <p class="text-xs text-gray-500 line-clamp-2 leading-tight">
        {{ description }}
      </p>
    </div>
    
    <!-- 箭头 -->
    <div class="flex-shrink-0 text-gray-400">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import ChineseIcon from './ChineseIcon.vue'

interface Props {
  to: string
  iconType: 'bazi' | 'archive' | 'daily' | 'yearly' | 'marriage'
  title: string
  description: string
  color: 'red' | 'gold' | 'orange' | 'green' | 'pink'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'red'
})

const colorClasses = {
  red: {
    border: 'hover:border-red-300',
    iconBg: 'bg-red-50'
  },
  gold: {
    border: 'hover:border-yellow-400',
    iconBg: 'bg-yellow-50'
  },
  orange: {
    border: 'hover:border-orange-300',
    iconBg: 'bg-orange-50'
  },
  green: {
    border: 'hover:border-green-300',
    iconBg: 'bg-green-50'
  },
  pink: {
    border: 'hover:border-pink-300',
    iconBg: 'bg-pink-50'
  }
}

const borderClass = colorClasses[props.color]?.border || colorClasses.red.border
const iconBgClass = colorClasses[props.color]?.iconBg || colorClasses.red.iconBg
</script>

<style scoped>
.feature-card-compact {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
