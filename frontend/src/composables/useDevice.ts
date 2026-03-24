import { ref, computed, onMounted, onUnmounted } from 'vue'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'
export type DisplayMode = 'mobile' | 'desktop'

const currentDisplayMode = ref<DisplayMode>('desktop')
const isMobilePreview = ref(false)

export function useDevice() {
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const windowHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 768)
  const userAgent = ref(typeof navigator !== 'undefined' ? navigator.userAgent : '')

  const deviceType = computed<DeviceType>(() => {
    const width = windowWidth.value
    if (width < 640) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  })

  const isMobile = computed(() => deviceType.value === 'mobile')
  const isTablet = computed(() => deviceType.value === 'tablet')
  const isDesktop = computed(() => deviceType.value === 'desktop')

  const isTouchDevice = computed(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  })

  const displayMode = computed<DisplayMode>(() => {
    // If mobile preview mode is active, show mobile view
    if (isMobilePreview.value) return 'mobile'
    // Otherwise auto-detect based on window width
    return windowWidth.value < 1024 ? 'mobile' : 'desktop'
  })

  const breakpoint = computed(() => {
    const width = windowWidth.value
    if (width < 640) return 'sm'
    if (width < 768) return 'md'
    if (width < 1024) return 'lg'
    if (width < 1280) return 'xl'
    return '2xl'
  })

  const safeAreaInsets = computed(() => {
    if (typeof document === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 }
    
    const style = getComputedStyle(document.documentElement)
    return {
      top: parseInt(style.getPropertyValue('--sat') || '0'),
      right: parseInt(style.getPropertyValue('--sar') || '0'),
      bottom: parseInt(style.getPropertyValue('--sab') || '0'),
      left: parseInt(style.getPropertyValue('--sal') || '0')
    }
  })

  function updateWindowSize() {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
  }

  function setMobilePreview(enabled: boolean) {
    isMobilePreview.value = enabled
    localStorage.setItem('mobilePreview', enabled ? 'true' : 'false')
  }

  function toggleDisplayMode() {
    setMobilePreview(!isMobilePreview.value)
  }

  // Initialize from localStorage
  onMounted(() => {
    const saved = localStorage.getItem('mobilePreview')
    if (saved === 'true') {
      isMobilePreview.value = true
    }
    
    window.addEventListener('resize', updateWindowSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWindowSize)
  })

  return {
    windowWidth,
    windowHeight,
    userAgent,
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    displayMode,
    breakpoint,
    safeAreaInsets,
    isMobilePreview,
    setMobilePreview,
    toggleDisplayMode
  }
}
