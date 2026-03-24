<template>
  <div class="home-page">
    <!-- Hero区域 - 移动端简化版 -->
    <div class="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-2xl md:rounded-3xl p-4 md:p-12 mb-6 md:mb-8">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 right-0 w-64 h-64 bg-red-200 rounded-full filter blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl"></div>
      </div>
      <div class="relative text-center max-w-3xl mx-auto">
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-chinese text-china-red mb-2 md:mb-4">
          命理殿堂
        </h1>
        <p class="text-sm sm:text-base md:text-lg text-china-brown mb-1 md:mb-2">
          知命而行，顺势而为
        </p>
        <p class="text-xs sm:text-sm md:text-base text-gray-600">
          四柱窥天机，八字断吉凶
        </p>
      </div>
    </div>

    <!-- ==================== 桌面端布局 (lg以上) ==================== -->
    <div class="hidden lg:block">
      <!-- 核心功能入口 -->
      <div class="mb-8">
        <h2 class="text-xl md:text-2xl font-bold font-chinese text-china-brown mb-6 text-center">
          ✦ 命理服务 ✦
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 八字分析 -->
          <router-link to="/bazi" class="block group">
            <div class="chinese-card p-6 md:p-8 hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-1 border-2 border-transparent hover:border-china-red/30">
              <div class="flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
                <ChineseIcon type="bazi" :size="80" class-name="text-5xl md:text-6xl" />
                <div class="flex-1 text-center sm:text-left">
                  <h3 class="text-xl md:text-2xl font-bold font-chinese text-china-red mb-2">
                    八字分析
                  </h3>
                  <p class="text-china-brown mb-3">洞悉命格密码，解读人生轨迹</p>
                  <div class="flex flex-wrap justify-center sm:justify-start gap-2">
                    <span class="px-3 py-1 bg-red-50 text-china-red text-xs rounded-full">排四柱</span>
                    <span class="px-3 py-1 bg-red-50 text-china-red text-xs rounded-full">析五行</span>
                    <span class="px-3 py-1 bg-red-50 text-china-red text-xs rounded-full">明喜忌</span>
                    <span class="px-3 py-1 bg-red-50 text-china-red text-xs rounded-full">知祸福</span>
                  </div>
                </div>
              </div>
              <div class="mt-4 flex items-center justify-center sm:justify-start text-china-red">
                <span class="text-sm font-medium">命由天定·开始详批</span>
                <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </router-link>

          <!-- 档案管理 -->
          <router-link to="/profiles" class="block group">
            <div class="chinese-card p-6 md:p-8 hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-1 border-2 border-transparent hover:border-china-gold/30">
              <div class="flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
                <ChineseIcon type="archive" :size="80" class-name="text-5xl md:text-6xl" />
                <div class="flex-1 text-center sm:text-left">
                  <h3 class="text-xl md:text-2xl font-bold font-chinese text-china-gold mb-2">
                    档案管理
                  </h3>
                  <p class="text-china-brown mb-3">收藏命盘信息，便于随时查阅</p>
                  <div class="flex flex-wrap justify-center sm:justify-start gap-2">
                    <span class="px-3 py-1 bg-yellow-50 text-china-gold text-xs rounded-full">一人入库</span>
                    <span class="px-3 py-1 bg-yellow-50 text-china-gold text-xs rounded-full">全家共享</span>
                  </div>
                </div>
              </div>
              <div class="mt-4 flex items-center justify-center sm:justify-start text-china-gold">
                <span class="text-sm font-medium">命主档案·珍藏记录</span>
                <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- 日常功能入口 -->
      <div class="mb-8">
        <h2 class="text-xl md:text-2xl font-bold font-chinese text-china-brown mb-6 text-center">
          ✦ 日常吉凶 ✦
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- 今日运势 -->
          <router-link to="/daily" class="block group">
            <div class="chinese-card p-6 hover:shadow-xl transition-all duration-300">
              <div class="flex flex-col items-center text-center">
                <ChineseIcon type="daily" :size="72" class-name="mb-4" />
                <h3 class="text-xl font-bold font-chinese text-china-brown mb-2">今日运势</h3>
                <p class="text-china-brown text-sm mb-4">顺应天时，把握每日先机</p>
                <div class="flex flex-wrap justify-center gap-2 mb-4">
                  <span class="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-full">今日宜忌</span>
                  <span class="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-full">趋吉避凶</span>
                </div>
                <div class="flex items-center text-china-red">
                  <span class="text-sm font-medium">阴阳流转·详批今日</span>
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </router-link>

          <!-- 年度运势 -->
          <router-link to="/yearly" class="block group">
            <div class="chinese-card p-6 hover:shadow-xl transition-all duration-300">
              <div class="flex flex-col items-center text-center">
                <ChineseIcon type="yearly" :size="72" class-name="mb-4" />
                <h3 class="text-xl font-bold font-chinese text-china-brown mb-2">年度运势</h3>
                <p class="text-china-brown text-sm mb-4">预知年度运势，趋吉避凶</p>
                <div class="flex flex-wrap justify-center gap-2 mb-4">
                  <span class="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">年度分析</span>
                  <span class="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">把握时机</span>
                </div>
                <div class="flex items-center text-china-red">
                  <span class="text-sm font-medium">四季轮回·解读流年</span>
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </router-link>

          <!-- 良缘匹配 -->
          <router-link to="/event" class="block group">
            <div class="chinese-card p-6 hover:shadow-xl transition-all duration-300">
              <div class="flex flex-col items-center text-center">
                <ChineseIcon type="marriage" :size="72" class-name="mb-4" />
                <h3 class="text-xl font-bold font-chinese text-china-brown mb-2">良缘匹配</h3>
                <p class="text-china-brown text-sm mb-4">命格相合与否，携手共度此生</p>
                <div class="flex flex-wrap justify-center gap-2 mb-4">
                  <span class="px-2 py-1 bg-pink-50 text-pink-600 text-xs rounded-full">双人合盘</span>
                  <span class="px-2 py-1 bg-pink-50 text-pink-600 text-xs rounded-full">佳偶天成</span>
                </div>
                <div class="flex items-center text-china-red">
                  <span class="text-sm font-medium">良缘天定·开始合婚</span>
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- ==================== 移动端布局 (lg以下) ==================== -->
    <div class="lg:hidden">
      <!-- 紧凑功能列表 -->
      <div class="space-y-4">
        <!-- 命理服务标题 -->
        <SectionTitle title="命理服务" />
        
        <div class="space-y-2">
          <FeatureCardCompact 
            to="/bazi" 
            icon-type="bazi" 
            title="八字分析"
            description="洞悉命格密码，解读人生轨迹"
            color="red"
          />
          <FeatureCardCompact 
            to="/profiles" 
            icon-type="archive" 
            title="档案管理"
            description="收藏命盘信息，便于随时查阅"
            color="gold"
          />
        </div>

        <!-- 日常吉凶标题 -->
        <SectionTitle title="日常吉凶" />
        
        <div class="space-y-2">
          <FeatureCardCompact 
            to="/daily" 
            icon-type="daily" 
            title="今日运势"
            description="顺应天时，把握每日先机"
            color="orange"
          />
          <FeatureCardCompact 
            to="/yearly" 
            icon-type="yearly" 
            title="年度运势"
            description="预知年度运势，趋吉避凶"
            color="green"
          />
          <FeatureCardCompact 
            to="/event" 
            icon-type="marriage" 
            title="良缘匹配"
            description="命格相合与否，携手共度此生"
            color="pink"
          />
        </div>
      </div>
    </div>

    <!-- 关于八字命理 - 移动端简化版 -->
    <div class="chinese-card p-4 md:p-8 mt-6 md:mt-8">
      <h2 class="chinese-title text-lg md:text-2xl mb-4 md:mb-6 text-center">关于四柱命理</h2>
      <div class="text-china-brown leading-relaxed space-y-3 md:space-y-4">
        <p class="text-xs sm:text-sm md:text-base">
          四柱命理，又称八字预测学，是中国传统命理学的重要组成部分。它以人出生的年、月、日、时为基础，通过天干地支的组合，推演人生的吉凶祸福。
        </p>
        <p class="text-xs sm:text-sm md:text-base">
          本系统结合<strong>渊海子平</strong>、<strong>三命通会</strong>、<strong>滴天髓</strong>等多种命理学说，运用AI智能分析技术，为您提供专业的命理解读。
        </p>
        <div class="mt-4 md:mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-center">
          <div class="p-2 md:p-4 bg-red-50 rounded-lg md:rounded-xl">
            <div class="text-xl md:text-2xl mb-1 md:mb-2">🌟</div>
            <div class="text-xs md:text-sm font-medium text-china-red">年柱</div>
            <div class="text-xs text-gray-500">祖辈根基</div>
          </div>
          <div class="p-2 md:p-4 bg-yellow-50 rounded-lg md:rounded-xl">
            <div class="text-xl md:text-2xl mb-1 md:mb-2">🌙</div>
            <div class="text-xs md:text-sm font-medium text-china-gold">月柱</div>
            <div class="text-xs text-gray-500">父母兄弟</div>
          </div>
          <div class="p-2 md:p-4 bg-green-50 rounded-lg md:rounded-xl">
            <div class="text-xl md:text-2xl mb-1 md:mb-2">☀️</div>
            <div class="text-xs md:text-sm font-medium text-green-600">日柱</div>
            <div class="text-xs text-gray-500">本人命格</div>
          </div>
          <div class="p-2 md:p-4 bg-blue-50 rounded-lg md:rounded-xl">
            <div class="text-xl md:text-2xl mb-1 md:mb-2">⏰</div>
            <div class="text-xs md:text-sm font-medium text-blue-600">时柱</div>
            <div class="text-xs text-gray-500">子女晚年</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChineseCard from '@/components/ChineseCard.vue'
import ChineseIcon from '@/components/ChineseIcon.vue'
import FeatureCardCompact from '@/components/FeatureCardCompact.vue'
import SectionTitle from '@/components/SectionTitle.vue'
</script>

<style scoped>
.home-page {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
