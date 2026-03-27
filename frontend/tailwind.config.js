/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      // Mobile First - 移动端优先设计
      'xs': '320px',    // 小屏手机
      'sm': '640px',    // 大屏手机
      'md': '768px',    // 平板
      'lg': '1024px',   // 小屏笔记本
      'xl': '1280px',   // 标准笔记本
      '2xl': '1536px',  // 大屏显示器
    },
    extend: {
      colors: {
        // 中国风配色
        'china-white': '#FDF5E6',
        'china-red': '#C41E3A',
        'china-orange': '#E67E22',
        'china-gold': '#D4A84B',
        'china-brown': '#4A3728',
        'china-cream': '#F5E6D3',
        'china-light': '#FAF0E6'
      },
      fontFamily: {
        'chinese': ['"Noto Serif SC"', '"STSong"', 'serif']
      },
      backgroundImage: {
        'chinese-pattern': "url('/patterns/chinese-pattern.svg')"
      },
      boxShadow: {
        'chinese': '0 4px 20px rgba(196, 30, 58, 0.15)',
        'chinese-lg': '0 10px 40px rgba(196, 30, 58, 0.2)'
      },
      spacing: {
        // 移动端安全区域
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      borderRadius: {
        // 移动端圆角优化
        'mobile': '0.75rem'
      },
      animation: {
        // 移动端动画优化
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ]
}
