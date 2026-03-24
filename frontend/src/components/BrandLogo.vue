<template>
  <svg 
    :width="size" 
    :height="size" 
    :viewBox="'0 0 64 64'" 
    :class="className"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 外圈装饰 -->
    <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="2" stroke-opacity="0.3"/>
    
    <!-- 内圈装饰 -->
    <circle cx="32" cy="32" r="26" stroke="currentColor" stroke-width="1" stroke-opacity="0.2" stroke-dasharray="4 4"/>
    
    <!-- 太极图案背景 -->
    <circle cx="32" cy="32" r="20" fill="currentColor" fill-opacity="0.1"/>
    
    <!-- 太极阴阳鱼 -->
    <g transform="translate(32, 32)">
      <!-- 阳鱼 (上方) -->
      <path d="M0,-18 Q8,-14 8,0 Q8,10 0,14 Q-8,10 -8,0 Q-8,-14 0,-18" 
            fill="currentColor" fill-opacity="0.9"/>
      <circle cx="0" cy="-8" r="3" fill="white"/>
      
      <!-- 阴鱼 (下方) -->
      <path d="M0,18 Q-8,14 -8,0 Q-8,-10 0,-14 Q8,-10 8,0 Q8,14 0,18" 
            fill="white" stroke="currentColor" stroke-width="1" stroke-opacity="0.5"/>
      <circle cx="0" cy="8" r="3" fill="currentColor"/>
    </g>
    
    <!-- 四角装饰 - 八卦符号简化 -->
    <!-- 乾 (左上) -->
    <line x1="8" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-opacity="0.6"/>
    <line x1="8" y1="12" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-opacity="0.6"/>
    <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-opacity="0.6"/>
    
    <!-- 坤 (右上) -->
    <line x1="52" y1="8" x2="56" y2="8" stroke="currentColor" stroke-width="2" stroke-opacity="0.6"/>
    <line x1="52" y1="12" x2="56" y2="12" stroke="currentColor" stroke-width="2" stroke-opacity="0.6"/>
    <line x1="52" y1="16" x2="56" y2="16" stroke="currentColor" stroke-width="2" stroke-opacity="0.6"/>
    
    <!-- 震 (左下) -->
    <line x1="8" y1="48" x2="12" y2="48" stroke="currentColor" stroke-width="2" stroke-opacity="0.6"/>
    <line x1="10" y1="52" x2="10" y2="56" stroke="currentColor" stroke-width="2" stroke-opacity="0.6"/>
    
    <!-- 巽 (右下) -->
    <line x1="52" y1="48" x2="56" y2="48" stroke="currentColor" stroke-width="2" stroke-opacity="0.6"/>
    <line x1="52" y1="52" x2="52" y2="56" stroke="currentColor" stroke-width="2" stroke-opacity="0.6"/>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string
  className?: string
}

withDefaults(defineProps<Props>(), {
  size: 40,
  className: ''
})
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: middle;
}
</style>
