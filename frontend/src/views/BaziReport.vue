<template>
  <div class="min-h-screen bg-stone-50">
    <!-- 加载界面 -->
    <div v-if="loading" class="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <!-- 吉祥背景 -->
      <div class="absolute inset-0">
        <!-- 暖色调背景 -->
        <div class="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 opacity-60"></div>
        
        <!-- 装饰性云纹 -->
        <svg class="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="warmGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#d4af37"/>
              <stop offset="100%" stop-color="transparent"/>
            </radialGradient>
          </defs>
          <ellipse cx="400" cy="300" rx="250" ry="180" fill="url(#warmGlow)" opacity="0.4"/>
          <!-- 祥云装饰 -->
          <path d="M100 500 Q200 450 300 480 Q400 510 500 470" stroke="#d4af37" stroke-width="2" fill="none" opacity="0.3"/>
          <path d="M200 520 Q350 480 450 510 Q550 540 650 500" stroke="#d4af37" stroke-width="1.5" fill="none" opacity="0.2"/>
        </svg>
      </div>

      <!-- 中心八卦图 - 温暖色调 -->
      <div class="relative mb-12">
        <svg class="w-52 h-52 md:w-64 md:h-64" viewBox="0 0 200 200">
          <!-- 外圈 - 金色/铜色 -->
          <circle cx="100" cy="100" r="98" fill="none" stroke="#d4af37" stroke-width="2"/>
          <circle cx="100" cy="100" r="92" fill="none" stroke="#b8860b" stroke-width="1"/>
          
          <!-- 八卦符号 - 温暖红 -->
          <g fill="#C41E3A" font-family="'Noto Serif SC', serif" font-size="14" font-weight="bold">
            <text x="100" y="18" text-anchor="middle">乾</text>
            <text x="182" y="48" text-anchor="middle">兑</text>
            <text x="182" y="108" text-anchor="middle">离</text>
            <text x="182" y="168" text-anchor="middle">震</text>
            <text x="100" y="198" text-anchor="middle">巽</text>
            <text x="18" y="168" text-anchor="middle">坎</text>
            <text x="18" y="108" text-anchor="middle">艮</text>
            <text x="18" y="48" text-anchor="middle">坤</text>
          </g>

          <!-- 太极 - 传统配色 -->
          <circle cx="100" cy="100" r="55" fill="none" stroke="#C41E3A" stroke-width="2"/>
          <path d="M100 45 A55 55 0 0 1 100 155 A27.5 27.5 0 0 0 100 100 A27.5 27.5 0 0 1 100 45" fill="#C41E3A"/>
          <circle cx="100" cy="72" r="9" fill="#ffd700"/>
          <circle cx="100" cy="128" r="9" fill="#C41E3A"/>
        </svg>

        <!-- 旋转光环 - 温暖金色 -->
        <div class="absolute inset-0 animate-spin-slow">
          <svg class="w-full h-full" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#d4af37" stroke-width="1" stroke-dasharray="4 4"/>
          </svg>
        </div>
      </div>

      <!-- 标题区域 -->
      <div class="text-center mb-8 relative z-10">
        <h2 class="text-3xl md:text-4xl font-bold mb-3 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-china-red to-amber-600">
          命理推演中
        </h2>
        <p class="text-amber-700 text-base tracking-wide">福祸无门，惟人自召</p>
      </div>

      <!-- 进度条 - 温暖渐变 -->
      <div class="w-full max-w-sm mb-8 relative z-10">
        <div class="h-2 bg-amber-100 rounded-full overflow-hidden shadow-inner">
          <div
            :style="{ width: progress + '%' }"
            class="h-full bg-gradient-to-r from-china-red via-rose-500 to-amber-500 transition-all duration-1000 ease-out shadow-lg"
          ></div>
        </div>
        <div class="flex justify-between mt-4 text-sm text-amber-700 tracking-widest font-medium">
          <span class="flex items-center gap-1">
            <span class="w-2 h-2 bg-china-red rounded-full"></span>
            起始
          </span>
          <span class="text-xl font-bold text-china-red">{{ progress }}%</span>
          <span class="flex items-center gap-1">
            圆满
            <span class="w-2 h-2 bg-amber-500 rounded-full"></span>
          </span>
        </div>
      </div>

      <!-- 步骤列表 - 温暖配色 -->
      <div class="w-full max-w-sm space-y-3 relative z-10">
        <div
          v-for="(step, index) in analysisSteps"
          :key="index"
          class="flex items-center gap-3 p-3 rounded-lg transition-all duration-500"
          :class="{
            'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm': step.status === 'completed',
            'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 shadow-md animate-pulse': step.status === 'active',
            'bg-white/50 border border-stone-200': step.status === 'pending'
          }"
        >
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm"
            :class="{
              'bg-gradient-to-br from-green-500 to-emerald-600 text-white': step.status === 'completed',
              'bg-gradient-to-br from-china-red to-rose-600 text-white': step.status === 'active',
              'bg-stone-100 text-stone-400 border border-stone-300': step.status === 'pending'
            }"
          >
            <span v-if="step.status === 'completed'">✓</span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span
            class="text-sm tracking-wide transition-colors font-medium"
            :class="{
              'text-green-700': step.status === 'completed',
              'text-china-red': step.status === 'active',
              'text-stone-400': step.status === 'pending'
            }"
          >{{ step.text }}</span>
        </div>
      </div>

      <!-- 底部吉祥语 -->
      <div class="mt-8 text-center relative z-10">
        <p class="text-amber-600 text-sm tracking-wider italic">
          天道循环，吉人自有天相
        </p>
      </div>
    </div>

    <!-- 报告内容 -->
    <template v-else-if="report">
      <div class="max-w-5xl mx-auto px-4 py-8 pb-20">
        <!-- 标题区 -->
        <header class="text-center mb-12">
          <div class="inline-block relative">
            <h1 class="text-4xl md:text-5xl font-bold tracking-widest mb-2 text-transparent bg-clip-text bg-gradient-to-r from-china-red via-rose-600 to-amber-600">
              八字命理报告
            </h1>
            <div class="flex justify-center gap-8 mt-4 text-sm text-amber-700 tracking-wider">
              <span>年轮</span>
              <span>月华</span>
              <span>日主</span>
              <span>时序</span>
            </div>
          </div>
        </header>

        <!-- 四柱展示 -->
        <section class="mb-12">
          <div class="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-lg p-6 md:p-8 border-2 border-amber-200 relative overflow-hidden shadow-md">
            <!-- 动态背景纹理 - 温暖金色 -->
            <div class="absolute inset-0 opacity-10">
              <svg class="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d4af37" stroke-width="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)"/>
              </svg>
            </div>

            <!-- 角落装饰 - 传统纹样 - 温暖金色 -->
            <div class="absolute top-2 left-2 w-12 h-12 border-l-2 border-t-2 border-amber-400"></div>
            <div class="absolute top-2 right-2 w-12 h-12 border-r-2 border-t-2 border-amber-400"></div>
            <div class="absolute bottom-2 left-2 w-12 h-12 border-l-2 border-b-2 border-amber-400"></div>
            <div class="absolute bottom-2 right-2 w-12 h-12 border-r-2 border-b-2 border-amber-400"></div>

            <div class="relative z-10">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div
                  v-for="(pillar, key) in fourPillars"
                  :key="key"
                  class="text-center group"
                >
                  <div class="relative">
                    <!-- 外层装饰框 - 温暖渐变 -->
                    <div class="absolute -inset-1 bg-gradient-to-br from-amber-200 to-rose-200 rounded-xl opacity-60 blur-sm group-hover:opacity-80 transition-opacity"></div>
                    
                    <!-- 主卡片 - 温暖配色 -->
                    <div class="relative bg-gradient-to-b from-white to-amber-50 rounded-xl p-4 md:p-6 border-2 border-amber-200 shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:border-rose-300">
                      <!-- 顶部装饰线 -->
                      <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60"></div>
                      
                      <!-- 四柱值 - 渐变色 -->
                      <div class="text-3xl md:text-4xl font-bold mb-2 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-china-red to-amber-600">
                        {{ pillar.value }}
                      </div>
                      
                      <!-- 天干 -->
                      <div class="text-xs text-amber-600 tracking-wider font-medium">{{ pillar.ganZhi }}</div>
                      
                      <!-- 底部装饰 -->
                      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-50"></div>
                    </div>

                    <!-- 标签 - 温暖配色 -->
                    <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-50 to-rose-50 px-3 py-1 rounded-full border border-amber-300 shadow-sm">
                      <span class="text-xs text-amber-700 font-medium tracking-wider">{{ pillar.label }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 日主信息 - 温暖配色 -->
              <div class="mt-12 text-center">
                <div class="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-xl border-2 border-amber-200 shadow-md hover:shadow-lg transition-shadow">
                  <span class="text-amber-700 font-medium">日主</span>
                  <span class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-china-red to-amber-600 tracking-wide">{{ report?.bazi?.dayMaster || '' }}</span>
                  <span class="text-amber-300 text-2xl">|</span>
                  <span class="text-2xl font-bold" :style="{ color: getWuxingColor(report?.bazi?.dayMasterWuxing || '') }">
                    {{ report?.bazi?.dayMasterWuxing || '' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 五行分布 -->
        <section class="mb-12">
          <h3 class="text-2xl font-bold text-center mb-8 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-china-red to-amber-600">
            五行气数
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- 环形图 -->
            <div class="bg-stone-50 rounded-lg p-6 border border-stone-200">
              <h4 class="text-lg font-medium text-stone-700 mb-6 text-center">五行分布</h4>
              <div class="flex justify-center mb-6">
                <div class="relative">
                  <svg class="w-40 h-40 md:w-48 md:h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="80" stroke="#e5e5e5" stroke-width="16" fill="none"/>
                    <circle
                      v-for="(item, index) in wuxingData"
                      :key="key"
                      cx="96"
                      cy="96"
                      r="80"
                      :stroke="item.color"
                      stroke-width="16"
                      fill="none"
                      :stroke-dasharray="`${item.percentage * 5.02} 502`"
                      :stroke-dashoffset="-getOffset(index)"
                      class="transition-all duration-1000"
                    />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-3xl font-bold text-stone-800">八</div>
                      <div class="text-xs text-stone-500">字</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 图例 -->
              <div class="grid grid-cols-5 gap-2">
                <div v-for="item in wuxingData" :key="key" class="text-center">
                  <div class="w-3 h-3 rounded-full mx-auto mb-1" :style="{ backgroundColor: item.color }"></div>
                  <div class="text-xs text-stone-600">{{ item.label }}</div>
                  <div class="text-xs text-stone-400">{{ item.count }}</div>
                </div>
              </div>
            </div>

            <!-- 条形图 -->
            <div class="bg-stone-50 rounded-lg p-6 border border-stone-200">
              <h4 class="text-lg font-medium text-stone-700 mb-6 text-center">气数强弱</h4>
              <div class="space-y-4">
                <div v-for="item in wuxingData" :key="key" class="flex items-center gap-3 group">
                  <div class="w-8 text-center">
                    <span 
                      class="text-2xl font-bold transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-1 inline-block"
                      :style="{ color: item.color, textShadow: `0 2px 8px ${item.color}40` }"
                    >
                      {{ item.label }}
                    </span>
                  </div>
                  <div class="flex-1 h-6 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      :style="{ width: item.percentage + '%', backgroundColor: item.color }"
                      class="h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2 shadow-md"
                    >
                      <span v-if="item.percentage > 10" class="text-xs text-white font-medium">{{ item.count }}</span>
                    </div>
                  </div>
                  <div class="w-10 text-right text-sm text-stone-600 font-medium">{{ item.percentage }}%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 命理总评 -->
        <section class="mb-12">
          <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 md:p-8 border-2 border-amber-200 relative shadow-md">
            <div class="absolute -top-3 left-8 bg-gradient-to-r from-amber-50 to-orange-50 px-4">
              <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-china-red to-amber-600 tracking-wider">
                命理总评
              </h3>
            </div>
            
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-4">
              <div class="flex-1">
                <p class="text-stone-700 leading-relaxed text-base">{{ report.overallSummary }}</p>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-5xl font-bold bg-gradient-to-r from-china-red to-amber-600 bg-clip-text text-transparent">{{ report.overallScore }}</span>
                <span class="text-amber-600 text-2xl">/10</span>
              </div>
            </div>

            <!-- 评分条 -->
            <div class="mt-6">
              <div class="h-2 bg-amber-100 rounded-full overflow-hidden shadow-inner">
                <div
                  :style="{ width: report.overallScore * 10 + '%' }"
                  class="h-full bg-gradient-to-r from-china-red via-rose-500 to-amber-500 transition-all duration-1000 shadow-lg"
                ></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 人生运势曲线 -->
        <LifeFortuneCurve
          v-if="fortuneData.length"
          :data="fortuneData"
          :events="fortuneEvents"
          :birth-year="birthYear"
          class="mb-12"
        />

        <!-- 八大分析模块 - 两列布局 -->
        <section class="mb-12">
          <h3 class="text-2xl font-bold text-center mb-8 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-china-red to-amber-600">
            命理八章
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="(module, key) in modules"
              :key="key"
              class="bg-stone-50 rounded-lg p-5 md:p-6 border border-stone-200 hover:border-stone-400 hover:shadow-lg transition-all duration-300 group"
            >
              <div class="flex gap-4 md:gap-5">
                <!-- 图标 -->
                <div class="flex-shrink-0">
                  <div class="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center border-2 border-stone-300 group-hover:border-stone-500 transition-colors shadow-sm" :class="getModuleBgClass(key)">
                    <span class="text-2xl md:text-3xl">{{ module.icon }}</span>
                  </div>
                </div>

                <!-- 内容 -->
                <div class="flex-1 min-w-0">
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <h4 class="text-base md:text-lg font-bold text-stone-800 tracking-wide">{{ module.title }}</h4>
                    <div class="flex items-center gap-2 flex-shrink-0">
                      <div class="w-20 md:w-24 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          :style="{ width: module.score * 10 + '%', backgroundColor: getScoreColor(module.score) }"
                          class="h-full rounded-full transition-all duration-1000"
                        ></div>
                      </div>
                      <span class="text-lg font-bold w-6 text-right" :style="{ color: getScoreColor(module.score) }">
                        {{ module.score }}
                      </span>
                      <span class="text-stone-400 text-xs">分</span>
                    </div>
                  </div>
                  <p class="text-stone-600 leading-relaxed text-sm md:text-base line-clamp-3">{{ module.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 评分说明 -->
        <section class="mb-12">
          <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border-2 border-amber-200">
            <h4 class="text-lg font-bold text-center mb-6 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-china-red to-amber-600">
              评分准则
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div class="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div class="text-2xl font-bold text-green-600">9-10</div>
                <div class="text-xs text-stone-600 mt-1">极佳</div>
              </div>
              <div class="text-center p-3 bg-lime-50 rounded-lg border border-lime-200">
                <div class="text-2xl font-bold text-lime-600">7-8</div>
                <div class="text-xs text-stone-600 mt-1">良好</div>
              </div>
              <div class="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div class="text-2xl font-bold text-yellow-600">5-6</div>
                <div class="text-xs text-stone-600 mt-1">中等</div>
              </div>
              <div class="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div class="text-2xl font-bold text-orange-600">3-4</div>
                <div class="text-xs text-stone-600 mt-1">较弱</div>
              </div>
              <div class="text-center p-3 bg-red-50 rounded-lg border border-red-200 col-span-2 md:col-span-1">
                <div class="text-2xl font-bold text-red-600">1-2</div>
                <div class="text-xs text-stone-600 mt-1">需注意</div>
              </div>
            </div>
            <p class="text-xs text-stone-400 mt-6 text-center leading-relaxed">
              本报告依据河洛理数、八字命理、渊海子平、三命通会等传统典籍，由AI智能分析生成，仅供参悟。
            </p>
          </div>
        </section>
      </div>
    </template>

    <!-- 无数据 -->
    <div v-else class="min-h-screen flex flex-col items-center justify-center p-6">
      <div class="text-center">
        <div class="w-24 h-24 mx-auto mb-6 border-2 border-stone-300 rounded-lg flex items-center justify-center">
          <span class="text-4xl text-stone-400">☷</span>
        </div>
        <h2 class="text-xl font-bold text-stone-700 mb-2">暂无命理记录</h2>
        <p class="text-stone-500 mb-6">命由天定，运由己造</p>
        <button @click="$router.push('/bazi')" class="px-8 py-3 bg-stone-800 text-stone-50 rounded-lg hover:bg-stone-700 transition-colors tracking-wide">
          开始测算
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'
import LifeFortuneCurve from '@/components/LifeFortuneCurve.vue'

const route = useRoute()
const loading = ref(false)
const report = ref<any>(null)
const profile = ref<any>(null)
const progress = ref(0)
const fortuneData = ref<any[]>([])
const fortuneEvents = ref<any[]>([])
const birthYear = ref<number>(0)
const analysisSteps = ref([
  { text: '解析四柱', status: 'pending' },
  { text: '分析五行', status: 'pending' },
  { text: '推算大运', status: 'pending' },
  { text: '解读十神', status: 'pending' },
  { text: '生成命书', status: 'pending' }
])

const wuxingData = computed(() => {
  if (!report.value?.wuxing) return []
  const wuxing = report.value.wuxing
  const total = wuxing.total || (wuxing.金 + wuxing.木 + wuxing.水 + wuxing.火 + wuxing.土) || 1
  return [
    { label: '金', count: wuxing.金 || 0, color: '#d4af37', percentage: Math.round(((wuxing.金 || 0) / total) * 100) },
    { label: '木', count: wuxing.木 || 0, color: '#228b22', percentage: Math.round(((wuxing.木 || 0) / total) * 100) },
    { label: '水', count: wuxing.水 || 0, color: '#4682b4', percentage: Math.round(((wuxing.水 || 0) / total) * 100) },
    { label: '火', count: wuxing.火 || 0, color: '#dc143c', percentage: Math.round(((wuxing.火 || 0) / total) * 100) },
    { label: '土', count: wuxing.土 || 0, color: '#8b4513', percentage: Math.round(((wuxing.土 || 0) / total) * 100) }
  ]
})

const fourPillars = computed(() => {
  const bazi = report.value?.bazi
  if (!bazi) return []
  
  const fp = bazi.fourPillars
  const tianGan = bazi.tianGan || []
  
  return [
    { label: '年柱', value: fp?.year || '', ganZhi: tianGan[0] || '' },
    { label: '月柱', value: fp?.month || '', ganZhi: tianGan[1] || '' },
    { label: '日柱', value: fp?.day || '', ganZhi: tianGan[2] || '' },
    { label: '时柱', value: fp?.hour || '', ganZhi: tianGan[3] || '' }
  ]
})

const modules = computed(() => {
  if (!report.value?.modules) return []
  return report.value.modules
})

const getOffset = (index: number) => {
  let offset = 0
  for (let i = 0; i < index; i++) {
    offset += wuxingData.value[i].percentage * 5.02
  }
  return offset
}

const getScoreColor = (score: number) => {
  if (score >= 9) return '#16a34a'
  if (score >= 7) return '#65a30d'
  if (score >= 5) return '#ca8a04'
  if (score >= 3) return '#ea580c'
  return '#dc2626'
}

const getWuxingColor = (wuxing: string) => {
  const colors: Record<string, string> = {
    '金': '#d4af37',
    '木': '#228b22',
    '水': '#4682b4',
    '火': '#dc143c',
    '土': '#8b4513'
  }
  return colors[wuxing] || '#4a4a4a'
}

const getModuleBgClass = (key: string) => {
  const bgClasses: Record<string, string> = {
    personality: 'bg-blue-50',
    career: 'bg-amber-50',
    marriage: 'bg-pink-50',
    wealth: 'bg-green-50',
    health: 'bg-red-50',
    guiren: 'bg-purple-50',
    yearly: 'bg-orange-50',
    attention: 'bg-stone-100'
  }
  return bgClasses[key] || 'bg-stone-100'
}

const updateProgress = (stepIndex: number, status: 'pending' | 'active' | 'completed') => {
  analysisSteps.value.forEach((step, index) => {
    if (index < stepIndex) {
      step.status = 'completed'
    } else if (index === stepIndex) {
      step.status = status
    } else {
      step.status = 'pending'
    }
  })
  progress.value = Math.min(100, (stepIndex + 1) * 20)
}

const simulateProgress = () => {
  let step = 0
  const interval = setInterval(() => {
    if (step < 5) {
      updateProgress(step, 'active')
      if (step > 0) {
        updateProgress(step - 1, 'completed')
      }
      step++
    } else {
      clearInterval(interval)
    }
  }, 2000)
  return interval
}

const generateReport = async () => {
  const historyDataStr = localStorage.getItem('historyReport')
  if (historyDataStr) {
    try {
      const historyData = JSON.parse(historyDataStr)
      
      profile.value = {
        name: '历史记录',
        gender: historyData.gender || 'male',
        birthDate: historyData.birthDate || '',
        birthTime: historyData.birthTime || '',
        location: {}
      }
      
      const birthDateStr = historyData.birthDate || ''
      birthYear.value = birthDateStr ? parseInt(birthDateStr.split('-')[0]) : 1990
      
      const aiResult = typeof historyData.aiResult === 'string' 
        ? JSON.parse(historyData.aiResult) 
        : historyData.aiResult
      
      report.value = {
        overallScore: aiResult?.overallScore || 7,
        overallSummary: aiResult?.overallSummary || '',
        wuxing: aiResult?.wuxing || { 金: 1, 木: 1, 水: 1, 火: 1, 土: 1, total: 5 },
        modules: aiResult?.modules || {},
        bazi: aiResult?.bazi || historyData.baziData || null
      }
      
      fortuneData.value = aiResult?.fortuneData || []
      fortuneEvents.value = aiResult?.fortuneEvents || []
      
      localStorage.removeItem('historyReport')
      
      loading.value = false
      return
    } catch (e) {
      console.error('解析历史记录失败:', e)
    }
  }
  
  const stored = localStorage.getItem('currentProfile')
  if (!stored) {
    loading.value = false
    return
  }

  profile.value = JSON.parse(stored)
  loading.value = true
  progress.value = 0

  const birthDateStr = profile.value.birthDate || ''
  birthYear.value = birthDateStr ? parseInt(birthDateStr.split('-')[0]) : 1990

  const progressInterval = simulateProgress()

  try {
    const [reportRes, fortuneRes] = await Promise.all([
      api.post('/bazi/report', {
        birthDate: profile.value.birthDate,
        birthTime: profile.value.birthTime,
        gender: profile.value.gender,
        location: profile.value.location
      }),
      api.post('/fortune/kline', {
        birthDate: profile.value.birthDate,
        birthTime: profile.value.birthTime,
        gender: profile.value.gender
      }).catch(err => {
        console.warn('获取运势曲线失败:', err)
        return { data: { data: [], events: [] } }
      })
    ])

    report.value = reportRes.data
    fortuneData.value = fortuneRes.data.data || []
    fortuneEvents.value = fortuneRes.data.events || []

    try {
      await api.post('/history', {
        type: 'full',
        birthDate: profile.value.birthDate || '',
        birthTime: profile.value.birthTime || '',
        gender: profile.value.gender || 'male',
        baziData: reportRes.data.bazi || null,
        aiResult: JSON.stringify({
          overallScore: reportRes.data.overallScore,
          overallSummary: reportRes.data.overallSummary,
          wuxing: reportRes.data.wuxing,
          modules: reportRes.data.modules,
          fortuneData: fortuneData.value,
          fortuneEvents: fortuneEvents.value,
          birthYear: birthYear.value,
          bazi: reportRes.data.bazi
        })
      })
    } catch (historyErr) {
      console.warn('保存历史记录失败:', historyErr)
    }

    analysisSteps.value.forEach(step => step.status = 'completed')
    progress.value = 100
  } catch (e: any) {
    console.error('生成报告失败:', e)
    const errorMessage = e.response?.data?.error || e.message || '生成报告失败，请重试'
    alert(errorMessage)
  } finally {
    clearInterval(progressInterval)
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
}

const loadFromHistory = async (historyId: string) => {
  loading.value = true
  try {
    const res = await api.get(`/history/${historyId}`)
    const record = res.data
    try {
      const savedData = JSON.parse(record.ai_result)
      report.value = savedData
      fortuneData.value = savedData.fortuneData || []
      fortuneEvents.value = savedData.fortuneEvents || []
      birthYear.value = savedData.birthYear || parseInt(record.birth_date?.split('-')[0] || '1990')
    } catch {
      report.value = null
      alert('该历史记录格式不支持完整展示，请重新测算')
    }
  } catch (e) {
    console.error('加载历史记录失败:', e)
    alert('加载历史记录失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const historyId = route.params.historyId as string
  if (historyId) {
    loadFromHistory(historyId)
  } else {
    generateReport()
  }
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-spin-slow {
  animation: spin-slow 30s linear infinite;
}
</style>
