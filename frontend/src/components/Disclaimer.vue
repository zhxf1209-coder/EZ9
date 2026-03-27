<template>
  <div class="disclaimer-footer bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200 py-6 mt-8">
    <div class="max-w-6xl mx-auto px-4 text-center">
      <div class="flex flex-col items-center gap-3 text-sm">
        <div class="flex items-center gap-2 text-amber-800">
          <span class="text-lg">⚠️</span>
          <span class="font-medium">仅供娱乐与文化研究，请勿迷信</span>
        </div>
        <div class="flex items-center gap-4 text-amber-700 text-xs">
          <router-link to="/terms" class="hover:text-amber-900 underline">
            服务条款
          </router-link>
          <span>|</span>
          <router-link to="/privacy" class="hover:text-amber-900 underline">
            隐私政策
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
