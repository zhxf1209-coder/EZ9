<template>
  <div class="min-h-screen bg-gradient-to-br from-china-cream via-white to-red-50">
    <!-- 顶部导航 -->
    <nav class="bg-gradient-to-r from-china-red to-red-700 text-china-white shadow-xl sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo区域 -->
          <router-link to="/" class="flex items-center space-x-3">
            <BrandLogo :size="40" class-name="text-white" />
            <div>
              <span class="text-xl font-bold font-chinese tracking-wide">知命而行</span>
              <span class="hidden sm:inline text-sm ml-2 opacity-80">| 易经命理</span>
            </div>
          </router-link>

          <!-- 桌面端导航 -->
          <div class="hidden lg:flex items-center space-x-1">
            <router-link
              to="/"
              class="px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 font-medium whitespace-nowrap"
              active-class="bg-white/30"
            >
              命理殿堂
            </router-link>
            <router-link
              to="/bazi"
              class="px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 font-medium whitespace-nowrap"
              active-class="bg-white/30"
            >
              八字分析
            </router-link>
            <!-- 今日运势和年度运势暂时隐藏，用户可从首页进入 -->
            <router-link
              to="/event"
              class="px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 font-medium whitespace-nowrap"
              active-class="bg-white/30"
            >
              良缘匹配
            </router-link>

            <!-- 登录后的导航 -->
            <template v-if="userStore.isLoggedIn">
              <div class="border-l border-white/30 mx-2 h-6"></div>
              <router-link
                to="/profiles"
                class="px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 font-medium whitespace-nowrap"
                active-class="bg-white/30"
              >
                档案管理
              </router-link>
              <router-link
                to="/history"
                class="px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 font-medium whitespace-nowrap"
                active-class="bg-white/30"
              >
                命理档案
              </router-link>
              <button
                @click="logout"
                class="ml-2 px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 text-white/80 whitespace-nowrap"
              >
                退 出
              </button>
            </template>
            <template v-else>
              <router-link
                to="/login"
                class="ml-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300 font-medium whitespace-nowrap"
              >
                登 录
              </router-link>
            </template>
          </div>

          <!-- 移动端汉堡菜单按钮 -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2 rounded-lg hover:bg-white/20 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <div
        v-show="mobileMenuOpen"
        class="lg:hidden bg-china-red/95 backdrop-blur-sm"
      >
        <div class="px-4 py-3 space-y-1">
          <router-link
            to="/"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg hover:bg-white/20 transition whitespace-nowrap"
            active-class="bg-white/20"
          >
            命理殿堂
          </router-link>
          <router-link
            to="/bazi"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg hover:bg-white/20 transition whitespace-nowrap"
            active-class="bg-white/20"
          >
            八字分析
          </router-link>
          <!-- 今日运势和年度运势暂时隐藏，用户可从首页进入 -->
          <router-link
            to="/event"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg hover:bg-white/20 transition whitespace-nowrap"
            active-class="bg-white/20"
          >
            良缘匹配
          </router-link>

          <template v-if="userStore.isLoggedIn">
            <div class="border-t border-white/20 my-2"></div>
            <router-link
              to="/profiles"
              @click="mobileMenuOpen = false"
              class="block px-4 py-3 rounded-lg hover:bg-white/20 transition whitespace-nowrap"
              active-class="bg-white/20"
            >
              档案管理
            </router-link>
            <router-link
              to="/history"
              @click="mobileMenuOpen = false"
              class="block px-4 py-3 rounded-lg hover:bg-white/20 transition whitespace-nowrap"
              active-class="bg-white/20"
            >
              命理档案
            </router-link>
            <button
              @click="logout"
              class="block w-full text-left px-4 py-3 rounded-lg hover:bg-white/20 transition text-white/80 whitespace-nowrap"
            >
              退出登录
            </button>
          </template>
          <template v-else>
            <div class="border-t border-white/20 my-2"></div>
            <router-link
              to="/login"
              @click="mobileMenuOpen = false"
              class="block px-4 py-3 rounded-lg bg-white/20 hover:bg-white/30 transition text-center font-medium whitespace-nowrap"
            >
              登录 / 注册
            </router-link>
          </template>
        </div>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 页脚 -->
    <footer class="bg-gradient-to-r from-china-brown to-brown-800 text-china-cream py-8 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="font-chinese text-lg mb-2">知命而行，顺势而为</p>
          <p class="text-sm text-white/70">以易理为根，以AI为翼，助君趋吉避凶</p>
          <div class="mt-4 pt-4 border-t border-white/20">
            <p class="text-xs text-white/50">© {{ currentYear }} 易经命理智能分析系统 | 传承千年智慧</p>
          </div>
        </div>
      </div>
    </footer>

    <!-- 设备信息面板 (开发调试用) -->
    <DeviceInfo />
    
    <!-- 手机预览切换按钮 (桌面端显示) -->
    <MobilePreviewToggle />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from './stores/user'
import DeviceInfo from './components/DeviceInfo.vue'
import MobilePreviewToggle from './components/MobilePreviewToggle.vue'
import BrandLogo from './components/BrandLogo.vue'

const userStore = useUserStore()
const mobileMenuOpen = ref(false)

const currentYear = computed(() => new Date().getFullYear())

const logout = () => {
  mobileMenuOpen.value = false
  userStore.logout()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
