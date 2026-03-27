<template>
  <div class="max-w-5xl mx-auto">
    <!-- 页面标题区域 -->
    <div class="text-center mb-8">
      <h2 class="chinese-title text-3xl md:text-4xl mb-3">命由天定·八字详批</h2>
      <p class="text-china-brown/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
        解析命局五行，洞悉人生轨迹。基于中华传统命理学，通过八字、六亲、十神、大运、流年等关键元素，全面解读您的人生运势走向。
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
        <template #manual-form="{ form: slotForm, selectLocation: slotSelectLocation, showLocationPicker: slotShowLocationPicker }">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

            <div class="col-span-2">
              <label class="block text-china-brown mb-2">
                出生地点 <span class="text-china-red">*</span>
              </label>
              <div class="flex items-center space-x-2">
                <div class="flex-1 px-4 py-2 border border-china-gold rounded-lg bg-gray-50">
                  {{ slotForm.location?.name || '未选择' }}
                </div>
                <button
                  @click="slotShowLocationPicker(true)"
                  class="px-4 py-2 border border-china-gold rounded-lg text-china-red hover:bg-red-50"
                >
                  选择
                </button>
              </div>
            </div>
          </div>
        </template>
      </ProfileSelector>

      <button
        @click="analyze"
        :disabled="!canAnalyze"
        class="w-full chinese-btn mt-6 text-lg py-3"
      >
        {{ loading ? '命理推演中...' : '命由天定·开始详批' }}
      </button>
    </div>

    <div v-if="result" class="mt-6 chinese-card p-6">
      <h3 class="text-xl font-bold text-china-brown mb-4 text-center">八字分析结果</h3>
      <div class="space-y-4">
        <div class="text-center mb-6">
          <div class="text-3xl font-bold chinese-title">
            {{ result.year }}年 {{ result.month }}月 {{ result.day }}日 {{ result.hour }}时
          </div>
        </div>

        <div class="grid grid-cols-4 gap-2 text-center">
          <div class="p-2 bg-red-50 rounded">
            <div class="text-xs text-gray-500">年柱</div>
            <div class="text-lg font-bold">{{ result.yearPillar }}</div>
          </div>
          <div class="p-2 bg-yellow-50 rounded">
            <div class="text-xs text-gray-500">月柱</div>
            <div class="text-lg font-bold">{{ result.monthPillar }}</div>
          </div>
          <div class="p-2 bg-green-50 rounded">
            <div class="text-xs text-gray-500">日柱</div>
            <div class="text-lg font-bold">{{ result.dayPillar }}</div>
          </div>
          <div class="p-2 bg-blue-50 rounded">
            <div class="text-xs text-gray-500">时柱</div>
            <div class="text-lg font-bold">{{ result.hourPillar }}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4">
          <div class="p-4 bg-china-cream rounded-lg">
            <div class="text-sm text-gray-500">五行得分</div>
            <div class="text-2xl font-bold text-china-brown">{{ result.wuxingScore || '木100 火100 土100 金100 水100' }}</div>
          </div>
          <div class="p-4 bg-china-cream rounded-lg">
            <div class="text-sm text-gray-500">喜用神</div>
            <div class="text-2xl font-bold text-china-red">{{ result.xiyongshen || '待分析' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProfileSelector from '@/components/ProfileSelector.vue'

const router = useRouter()
const profileSelectorRef = ref<InstanceType<typeof ProfileSelector> | null>(null)
const loading = ref(false)
const result = ref<any>(null)

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
    const currentProfileName = profileSelectorRef.value?.selectedProfileName || currentForm.name
    
    const currentProfileData = {
      id: currentProfileId,
      name: currentProfileName,
      gender: currentForm.gender,
      birthDate: currentForm.birthDate,
      birthTime: currentForm.birthTime,
      location: currentForm.location
    }
    
    localStorage.setItem('currentProfile', JSON.stringify(currentProfileData))
    
    if (currentProfileId) {
      localStorage.setItem('currentProfileId', String(currentProfileId))
    }
    
    router.push('/bazi-report')
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
