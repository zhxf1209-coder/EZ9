<template>
  <div class="max-w-5xl mx-auto">
    <!-- 页面标题区域 -->
    <div class="text-center mb-8">
      <h2 class="chinese-title text-3xl md:text-4xl mb-3">四季轮回·流年运势</h2>
      <p class="text-china-brown/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
        预知流年起伏，顺时而动。深入分析年度运势起伏，提前预知并做好准备，把握人生关键转折点，顺势而为。
      </p>
    </div>

    <div class="chinese-card p-6 md:p-8">
      <ProfileSelector
        ref="profileSelectorRef"
        title="命主信息"
        subtitle="请选择已有档案或手动输入新档案信息"
        @profile-selected="onProfileSelected"
        @form-changed="onFormChanged"
      >
        <template #manual-form="{ form: slotForm, selectLocation: slotSelectLocation }">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-china-brown mb-2">
                姓名 <span class="text-china-red">*</span>
              </label>
              <input
                type="text"
                v-model="slotForm.name"
                placeholder="请输入姓名"
                class="w-full px-4 py-2 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red"
                required
              />
            </div>

            <div>
              <label class="block text-china-brown mb-2">
                性别 <span class="text-china-red">*</span>
              </label>
              <div class="flex space-x-4">
                <label class="flex items-center cursor-pointer px-4 py-2 border rounded-lg"
                       :class="slotForm.gender === 'male' ? 'border-china-red bg-red-50' : 'border-gray-300'">
                  <input type="radio" v-model="slotForm.gender" value="male" class="mr-2 accent-china-red" />
                  <span>男</span>
                </label>
                <label class="flex items-center cursor-pointer px-4 py-2 border rounded-lg"
                       :class="slotForm.gender === 'female' ? 'border-china-red bg-red-50' : 'border-gray-300'">
                  <input type="radio" v-model="slotForm.gender" value="female" class="mr-2 accent-china-red" />
                  <span>女</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-china-brown mb-2">
                出生日期 <span class="text-china-red">*</span>
              </label>
              <input
                type="date"
                v-model="slotForm.birthDate"
                class="w-full px-4 py-2 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red"
                required
              />
            </div>

            <div>
              <label class="block text-china-brown mb-2">
                出生时辰 <span class="text-china-red">*</span>
              </label>
              <select
                v-model="slotForm.birthTime"
                class="w-full px-4 py-2 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red"
                required
              >
                <option value="子时 (23:00-00:59)">子时 (23:00-00:59)</option>
                <option value="丑时 (01:00-02:59)">丑时 (01:00-02:59)</option>
                <option value="寅时 (03:00-04:59)">寅时 (03:00-04:59)</option>
                <option value="卯时 (05:00-06:59)">卯时 (05:00-06:59)</option>
                <option value="辰时 (07:00-08:59)">辰时 (07:00-08:59)</option>
                <option value="巳时 (09:00-10:59)">巳时 (09:00-10:59)</option>
                <option value="午时 (11:00-12:59)">午时 (11:00-12:59)</option>
                <option value="未时 (13:00-14:59)">未时 (13:00-14:59)</option>
                <option value="申时 (15:00-16:59)">申时 (15:00-16:59)</option>
                <option value="酉时 (17:00-18:59)">酉时 (17:00-18:59)</option>
                <option value="戌时 (19:00-20:59)">戌时 (19:00-20:59)</option>
                <option value="亥时 (21:00-22:59)">亥时 (21:00-22:59)</option>
              </select>
            </div>

            <div>
              <label class="block text-china-brown mb-2">
                出生地点 <span class="text-china-red">*</span>
              </label>
              <div class="flex items-center space-x-2">
                <div class="flex-1 px-4 py-2 border border-china-gold rounded-lg bg-gray-50">
                  {{ slotForm.location?.name || '未选择' }}
                </div>
                <button
                  @click="slotSelectLocation"
                  class="px-4 py-2 border border-china-gold rounded-lg text-china-red hover:bg-red-50"
                >
                  选择
                </button>
              </div>
            </div>

            <div>
              <label class="block text-china-brown mb-2">
                分析年份 <span class="text-china-red">*</span>
              </label>
              <select v-model="targetYear" class="w-full px-4 py-2 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red">
                <option v-for="y in years" :key="y" :value="y">{{ y }}年</option>
              </select>
            </div>
          </div>
        </template>
      </ProfileSelector>

      <button @click="analyze" :disabled="!canAnalyze" class="w-full chinese-btn mt-6 text-lg py-3">
        {{ loading ? '流年推演中...' : '四季轮回·解读流年' }}
      </button>
    </div>

    <div v-if="result" class="mt-8 space-y-6">
      <KLineChart v-if="fortuneData.length" :data="fortuneData" />
      <div class="chinese-card p-6">
        <h3 class="chinese-title text-xl mb-4 text-center">{{ targetYear }}年运势解读</h3>
        <div class="prose prose-china max-w-none text-china-brown whitespace-pre-wrap">{{ result }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProfileSelector from '@/components/ProfileSelector.vue'
import KLineChart from '@/components/KLineChart.vue'
import api from '@/api'

const profileSelectorRef = ref<InstanceType<typeof ProfileSelector> | null>(null)
const currentYear = new Date().getFullYear()
const years = computed(() => Array.from({ length: 10 }, (_, i) => currentYear - 2 + i))
const targetYear = ref(currentYear)
const loading = ref(false)
const result = ref('')
const fortuneData = ref<any[]>([])

const form = computed(() => profileSelectorRef.value?.form || {
  name: '',
  gender: 'male',
  birthDate: '',
  birthTime: '子时 (23:00-00:59)',
  location: { name: '', lat: 0, lng: 0 }
})

const canAnalyze = computed(() => {
  const hasName = form.value.name && form.value.name.trim() !== ''
  const hasBirthDate = form.value.birthDate && form.value.birthDate.trim() !== ''
  const hasLocation = form.value.location?.name && form.value.location.name.trim() !== ''
  return hasName && hasBirthDate && hasLocation
})

const onProfileSelected = (profile: any) => {
  console.log('已选择档案:', profile.name)
}

const onFormChanged = (formData: any) => {
  console.log('表单数据更新:', formData)
}

const analyze = async () => {
  if (!canAnalyze.value) {
    alert('请填写完整的姓名、出生日期和出生地点')
    return
  }
  loading.value = true
  try {
    const currentForm = form.value
    const currentProfileId = profileSelectorRef.value?.selectedProfileId

    const requestData = {
      name: currentForm.name,
      gender: currentForm.gender,
      birthDate: currentForm.birthDate,
      birthTime: currentForm.birthTime,
      location: currentForm.location,
      profileId: currentProfileId
    }

    const fortuneRes = await api.post('/fortune/kline', { ...requestData, startYear: currentYear - 5, endYear: currentYear + 10 })
    fortuneData.value = fortuneRes.data.data

    const res = await api.post('/ai/interpret', { ...requestData, type: 'yearly', year: targetYear.value })
    result.value = res.data.content

    // 保存到历史记录
    try {
      await api.post('/history', {
        type: 'yearly',
        birthDate: currentForm.birthDate,
        birthTime: currentForm.birthTime,
        gender: currentForm.gender,
        baziData: fortuneRes.data.bazi || null,
        aiResult: res.data.content
      })
    } catch (historyErr) {
      console.warn('保存历史记录失败:', historyErr)
    }
  } catch (e: any) {
    alert(e.response?.data?.error || '测算失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const savedProfile = localStorage.getItem('currentProfile')
  if (savedProfile) {
    try {
      const profile = JSON.parse(savedProfile)
      console.log('恢复档案信息:', profile)
    } catch (e) {
      console.error('恢复档案信息失败:', e)
    }
  }
})
</script>
