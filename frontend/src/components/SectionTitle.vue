<template>
  <div class="section-title flex items-center gap-3 px-1 mb-4">
    <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    <h2 class="text-sm font-medium text-gray-600 whitespace-nowrap">
      {{ title }}
    </h2>
    <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>
