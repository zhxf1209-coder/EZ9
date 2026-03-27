<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="viewBox"
    :class="className"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="chinese-icon"
  >
    <!-- 八字分析图标 - 阴阳八卦 + 四柱 -->
    <template v-if="type === 'bazi'">
      <!-- 背景圆 -->
      <circle cx="32" cy="32" r="30" fill="#FEF2F2" stroke="#DC2626" stroke-width="2"/>
      <!-- 太极图案 -->
      <circle cx="32" cy="32" r="18" :fill="yinColor" stroke="#DC2626" stroke-width="1.5"/>
      <circle cx="38" cy="26" r="6" :fill="yangColor"/>
      <circle cx="26" cy="38" r="6" :fill="yinColor"/>
      <circle cx="38" cy="26" r="2" :fill="yinColor"/>
      <circle cx="26" cy="38" r="2" :fill="yangColor"/>
      <!-- 四柱符号 -->
      <rect x="8" y="8" width="8" height="2" fill="#DC2626"/>
      <rect x="8" y="12" width="8" height="2" fill="#DC2626"/>
      <rect x="48" y="8" width="8" height="2" fill="#DC2626"/>
      <rect x="48" y="12" width="8" height="2" fill="#DC2626"/>
      <rect x="8" y="48" width="8" height="2" fill="#DC2626"/>
      <rect x="8" y="52" width="8" height="2" fill="#DC2626"/>
      <rect x="48" y="48" width="8" height="2" fill="#DC2626"/>
      <rect x="48" y="52" width="8" height="2" fill="#DC2626"/>
    </template>

    <!-- 档案管理图标 - 卷轴 -->
    <template v-else-if="type === 'archive'">
      <!-- 卷轴背景 -->
      <rect x="8" y="12" width="48" height="40" rx="2" fill="#FFFBEB" stroke="#D97706" stroke-width="2"/>
      <!-- 卷轴两端 -->
      <ellipse cx="8" cy="32" rx="4" ry="20" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
      <ellipse cx="56" cy="32" rx="4" ry="20" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
      <!-- 卷轴纹路 -->
      <line x1="16" y1="20" x2="48" y2="20" stroke="#D97706" stroke-width="1.5"/>
      <line x1="16" y1="28" x2="48" y2="28" stroke="#D97706" stroke-width="1.5"/>
      <line x1="16" y1="36" x2="48" y2="36" stroke="#D97706" stroke-width="1.5"/>
      <line x1="16" y1="44" x2="48" y2="44" stroke="#D97706" stroke-width="1.5"/>
      <!-- 中心装饰 -->
      <circle cx="32" cy="32" r="6" fill="#FEF3C7" stroke="#D97706" stroke-width="1.5"/>
      <text x="32" y="36" font-size="8" fill="#D97706" text-anchor="middle" font-weight="bold">档</text>
    </template>

    <!-- 今日运势图标 - 日月交替 -->
    <template v-else-if="type === 'daily'">
      <!-- 背景圆 -->
      <circle cx="32" cy="32" r="30" fill="#FFF7ED" stroke="#EA580C" stroke-width="2"/>
      <!-- 太阳 -->
      <circle cx="24" cy="26" r="10" fill="#FBBF24" stroke="#EA580C" stroke-width="1.5"/>
      <g stroke="#EA580C" stroke-width="1.5">
        <line x1="24" y1="10" x2="24" y2="14"/>
        <line x1="24" y1="38" x2="24" y2="42"/>
        <line x1="8" y1="26" x2="12" y2="26"/>
        <line x1="36" y1="26" x2="40" y2="26"/>
        <line x1="12" y1="14" x2="15" y2="17"/>
        <line x1="33" y1="35" x2="36" y2="38"/>
        <line x1="12" y1="38" x2="15" y2="35"/>
        <line x1="33" y1="17" x2="36" y2="14"/>
      </g>
      <!-- 月亮 -->
      <path d="M44 36 Q40 32 44 28 Q48 32 44 36" fill="#1F2937" stroke="#EA580C" stroke-width="1.5"/>
      <!-- 阴阳线 -->
      <path d="M20 44 Q32 40 44 44" stroke="#EA580C" stroke-width="2" fill="none"/>
    </template>

    <!-- 年度运势图标 - 四季轮回 -->
    <template v-else-if="type === 'yearly'">
      <!-- 背景 -->
      <circle cx="32" cy="32" r="30" fill="#F0FDF4" stroke="#16A34A" stroke-width="2"/>
      <!-- 四个季节符号 -->
      <!-- 春 - 桃花 -->
      <g transform="translate(16, 12)">
        <circle cx="0" cy="0" r="6" fill="#F9A8D4"/>
        <circle cx="-3" cy="-3" r="4" fill="#FBCFE8"/>
        <circle cx="3" cy="-3" r="4" fill="#FBCFE8"/>
        <circle cx="0" cy="0" r="2" fill="#FBBF24"/>
      </g>
      <!-- 夏 - 太阳 -->
      <circle cx="48" cy="16" r="6" fill="#FBBF24" stroke="#EA580C" stroke-width="1"/>
      <!-- 秋 - 枫叶 -->
      <g transform="translate(48, 48)">
        <path d="M0 0 L-4 -4 L0 -8 L4 -4 Z" fill="#F97316"/>
        <line x1="0" y1="0" x2="0" y2="6" stroke="#92400E" stroke-width="1"/>
      </g>
      <!-- 冬 - 雪花 -->
      <g transform="translate(16, 48)">
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#3B82F6" stroke-width="1.5"/>
        <line x1="-4" y1="0" x2="4" y2="0" stroke="#3B82F6" stroke-width="1.5"/>
        <line x1="-3" y1="-3" x2="3" y2="3" stroke="#3B82F6" stroke-width="1"/>
        <line x1="3" y1="-3" x2="-3" y2="3" stroke="#3B82F6" stroke-width="1"/>
      </g>
      <!-- 中心太极 -->
      <circle cx="32" cy="32" r="8" fill="#F0FDF4" stroke="#16A34A" stroke-width="1.5"/>
      <path d="M32 24 A8 8 0 0 1 32 40 A4 4 0 0 0 32 32 A4 4 0 0 1 32 24" fill="#16A34A"/>
    </template>

    <!-- 良缘匹配图标 - 并蒂莲 -->
    <template v-else-if="type === 'marriage'">
      <!-- 背景心形光晕 -->
      <path d="M32 52 C16 36 4 28 4 18 C4 8 12 4 22 4 C28 4 32 8 32 12 C32 8 36 4 42 4 C52 4 60 8 60 18 C60 28 48 36 32 52Z" fill="#FDF2F8" stroke="#EC4899" stroke-width="2"/>
      <!-- 并蒂莲 -->
      <!-- 左花 -->
      <ellipse cx="26" cy="28" rx="6" ry="10" fill="#F9A8D4"/>
      <ellipse cx="22" cy="26" rx="4" ry="8" fill="#FBCFE8"/>
      <ellipse cx="30" cy="26" rx="4" ry="8" fill="#FBCFE8"/>
      <ellipse cx="26" cy="24" rx="3" ry="6" fill="#FDF2F8"/>
      <!-- 右花 -->
      <ellipse cx="38" cy="28" rx="6" ry="10" fill="#F9A8D4"/>
      <ellipse cx="34" cy="26" rx="4" ry="8" fill="#FBCFE8"/>
      <ellipse cx="42" cy="26" rx="4" ry="8" fill="#FBCFE8"/>
      <ellipse cx="38" cy="24" rx="3" ry="6" fill="#FDF2F8"/>
      <!-- 茎 -->
      <path d="M32 38 Q32 44 32 52" stroke="#16A34A" stroke-width="2" fill="none"/>
      <!-- 叶子 -->
      <ellipse cx="24" cy="42" rx="6" ry="3" fill="#22C55E" transform="rotate(-30 24 42)"/>
      <ellipse cx="40" cy="42" rx="6" ry="3" fill="#22C55E" transform="rotate(30 40 42)"/>
    </template>

    <!-- 性格分析图标 - 山水人物 -->
    <template v-else-if="type === 'personality'">
      <circle cx="32" cy="32" r="30" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/>
      <!-- 山 -->
      <path d="M12 44 L22 28 L28 36 L38 24 L52 44 Z" fill="#3B82F6" opacity="0.3"/>
      <path d="M16 44 L24 32 L30 38 L40 26 L48 44 Z" fill="#3B82F6" opacity="0.5"/>
      <!-- 水 -->
      <path d="M8 48 Q20 44 32 48 Q44 52 56 48" stroke="#3B82F6" stroke-width="2" fill="none"/>
      <!-- 太阳 -->
      <circle cx="48" cy="16" r="6" fill="#FBBF24"/>
    </template>

    <!-- 事业财运图标 - 铜钱 -->
    <template v-else-if="type === 'career'">
      <circle cx="32" cy="32" r="30" fill="#FEF9C3" stroke="#CA8A04" stroke-width="2"/>
      <!-- 外圆 -->
      <circle cx="32" cy="32" r="20" stroke="#CA8A04" stroke-width="3" fill="none"/>
      <!-- 内方 -->
      <rect x="24" y="24" width="16" height="16" fill="none" stroke="#CA8A04" stroke-width="2" transform="rotate(45 32 32)"/>
      <!-- 装饰 -->
      <text x="32" y="38" font-size="16" fill="#CA8A04" text-anchor="middle" font-weight="bold">财</text>
    </template>

    <!-- 姻缘感情图标 - 桃花 -->
    <template v-else-if="type === 'love'">
      <circle cx="32" cy="32" r="30" fill="#FDF2F8" stroke="#EC4899" stroke-width="2"/>
      <!-- 桃花 -->
      <g transform="translate(32, 32)">
        <ellipse cx="0" cy="-8" rx="6" ry="8" fill="#F9A8D4"/>
        <ellipse cx="-7" cy="-3" rx="6" ry="8" fill="#FBCFE8" transform="rotate(-45)"/>
        <ellipse cx="7" cy="-3" rx="6" ry="8" fill="#FBCFE8" transform="rotate(45)"/>
        <ellipse cx="-7" cy="3" rx="6" ry="8" fill="#F9A8D4" transform="rotate(-90)"/>
        <ellipse cx="7" cy="3" rx="6" ry="8" fill="#F9A8D4" transform="rotate(90)"/>
        <circle cx="0" cy="0" r="4" fill="#FBBF24"/>
      </g>
    </template>

    <!-- 健康养生图标 - 葫芦 -->
    <template v-else-if="type === 'health'">
      <circle cx="32" cy="32" r="30" fill="#F0FDF4" stroke="#16A34A" stroke-width="2"/>
      <!-- 葫芦 -->
      <path d="M32 20 C24 20 20 28 20 36 C20 44 24 48 32 48 C40 48 44 44 44 36 C44 28 40 20 32 20 Z" fill="#22C55E" stroke="#16A34A" stroke-width="2"/>
      <!-- 葫芦口 -->
      <rect x="28" y="16" width="8" height="6" fill="#16A34A"/>
      <!-- 葫芦藤 -->
      <path d="M32 16 Q36 12 40 14" stroke="#16A34A" stroke-width="2" fill="none"/>
    </template>

    <!-- 默认/加载图标 -->
    <template v-else>
      <circle cx="32" cy="32" r="20" stroke="currentColor" stroke-width="2" stroke-dasharray="4 2"/>
      <text x="32" y="38" font-size="20" fill="currentColor" text-anchor="middle">玄</text>
    </template>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  type?: 'bazi' | 'archive' | 'daily' | 'yearly' | 'marriage' | 'personality' | 'career' | 'love' | 'health' | 'default'
  size?: number | string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 64,
  className: ''
})

const viewBox = '0 0 64 64'

// 太极颜色
const yinColor = '#1F2937' // 阴 - 黑色
const yangColor = '#FEF3C7' // 阳 - 白色/金色
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: middle;
}

.chinese-icon {
  transition: all 0.3s ease;
}

.chinese-icon:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}
</style>
