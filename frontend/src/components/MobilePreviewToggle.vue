<template>
  <div class="mobile-preview-toggle" v-if="showToggle">
    <!-- 手机图标按钮 -->
    <button
      @click="toggleMobilePreview"
      class="fixed bottom-20 right-4 z-[9999] p-3 rounded-full shadow-lg transition-all duration-300"
      :class="isMobilePreview 
        ? 'bg-china-red text-white hover:bg-red-700' 
        : 'bg-white text-china-brown border-2 border-china-gold hover:bg-gray-50'"
      :title="isMobilePreview ? '切换到桌面模式' : '预览手机模式'"
    >
      <!-- 手机图标 -->
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    </button>

    <!-- 手机预览模态框 -->
    <Teleport to="body">
      <Transition name="fade">
        <div 
          v-if="showPreviewFrame" 
          class="fixed inset-0 bg-black/80 z-[9998] flex items-center justify-center p-4"
          @click="closePreview"
        >
          <!-- 手机框架 -->
          <div 
            class="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden transition-all duration-300"
            :class="previewSizeClass"
            @click.stop
          >
            <!-- 手机顶部 -->
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-gray-800 rounded-b-2xl z-10"></div>
            
            <!-- 手机屏幕 -->
            <div class="w-full h-full overflow-hidden bg-white">
              <iframe
                ref="previewIframe"
                :src="currentPath"
                class="w-full h-full border-none"
                :style="{ width: '100%', height: '100%' }"
              ></iframe>
            </div>
            
            <!-- 手机底部 -->
            <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-t-2xl z-10"></div>
            
            <!-- 关闭按钮 -->
            <button
              @click="closePreview"
              class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 text-gray-600 flex items-center justify-center shadow-md hover:bg-white transition z-20"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <!-- 尺寸切换 -->
            <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              <button
                v-for="size in previewSizes"
                :key="size.name"
                @click="setPreviewSize(size)"
                class="px-3 py-1 rounded-full text-xs font-medium transition"
                :class="currentPreviewSize.name === size.name 
                  ? 'bg-china-red text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'"
              >
                {{ size.name }}
              </button>
            </div>
          </div>
          
          <!-- 提示文字 -->
          <p class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 text-sm">
            点击背景关闭预览
          </p>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface PreviewSize {
  name: string
  width: string
  height: string
  maxWidth: string
  maxHeight: string
}

const route = useRoute()
const isMobilePreview = ref(false)
const showPreviewFrame = ref(false)
const previewIframe = ref<HTMLIFrameElement | null>(null)

const previewSizes: PreviewSize[] = [
  { name: 'iPhone SE', width: '375px', height: '667px', maxWidth: '375px', maxHeight: '667px' },
  { name: 'iPhone 14', width: '390px', height: '844px', maxWidth: '390px', maxHeight: '844px' },
  { name: 'iPhone 14 Pro Max', width: '430px', height: '932px', maxWidth: '430px', maxHeight: '932px' },
  { name: 'iPad', width: '768px', height: '1024px', maxWidth: '768px', maxHeight: '1024px' }
]

const currentPreviewSize = ref(previewSizes[1]) // Default to iPhone 14

const currentPath = computed(() => {
  // 构建当前路径，使用hash模式
  return `${window.location.origin}${window.location.pathname}#${route.fullPath}`
})

const previewSizeClass = computed(() => {
  const size = currentPreviewSize.value
  return [
    'transition-all duration-300',
    size.name === 'iPad' ? 'w-[768px] h-[1024px] max-w-[90vw] max-h-[90vh]' : 'w-[390px] h-[844px] max-w-[90vw] max-h-[90vh]'
  ]
})

const showToggle = computed(() => {
  // 在桌面模式下显示切换按钮
  return typeof window !== 'undefined' && window.innerWidth >= 1024
})

function toggleMobilePreview() {
  if (showPreviewFrame.value) {
    closePreview()
  } else {
    openPreview()
  }
}

function openPreview() {
  showPreviewFrame.value = true
  isMobilePreview.value = true
  document.body.style.overflow = 'hidden'
}

function closePreview() {
  showPreviewFrame.value = false
  isMobilePreview.value = false
  document.body.style.overflow = ''
}

function setPreviewSize(size: PreviewSize) {
  currentPreviewSize.value = size
}

// Watch route changes to update iframe
watch(() => route.fullPath, () => {
  if (showPreviewFrame.value && previewIframe.value) {
    previewIframe.value.src = currentPath.value
  }
})

onMounted(() => {
  // Check localStorage for saved preference
  const saved = localStorage.getItem('mobilePreview')
  if (saved === 'true') {
    isMobilePreview.value = true
  }
})
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

/* 手机框架样式 */
.mobile-preview-toggle :deep(.phone-frame) {
  border-radius: 3rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>
