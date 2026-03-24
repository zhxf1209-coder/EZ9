<template>
  <div
    class="chinese-card p-4 sm:p-6 transition-all duration-300 touch-manipulation"
    :class="[
      hoverable ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer active:scale-[0.98]' : 'shadow-md',
      customClass
    ]"
  >
    <!-- 图标 -->
    <div v-if="icon" class="text-4xl sm:text-5xl mb-3 sm:mb-4 text-center select-none">
      {{ icon }}
    </div>

    <!-- 标题 -->
    <h3
      v-if="title"
      class="chinese-title text-lg sm:text-xl mb-2 sm:mb-3 text-center"
      :class="titleClass"
    >
      {{ title }}
    </h3>

    <!-- 描述 -->
    <p
      v-if="description"
      class="text-china-brown text-sm sm:text-base text-center mb-3 sm:mb-4 leading-relaxed"
    >
      {{ description }}
    </p>

    <!-- 额外内容插槽 -->
    <slot name="extra"></slot>

    <!-- 默认插槽 -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  description?: string
  icon?: string
  hoverable?: boolean
  titleClass?: string
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  icon: '',
  hoverable: false,
  titleClass: '',
  customClass: ''
})
</script>

<style scoped>
.chinese-card {
  background: linear-gradient(145deg, #fff9f0 0%, #fff5eb 100%);
  border-radius: 1rem;
  border: 1px solid rgba(180, 83, 9, 0.1);
}

/* 移动端触摸优化 */
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* 移动端点击效果 */
@media (hover: none) {
  .chinese-card:active {
    transform: scale(0.98);
  }
}

/* 优化移动端滚动 */
@media (max-width: 640px) {
  .chinese-card {
    padding: 1rem;
  }
}
</style>
