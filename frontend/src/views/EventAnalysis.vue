<template>
  <div class="max-w-5xl mx-auto">
    <!-- 页面标题区域 -->
    <div class="text-center mb-8">
      <h2 class="chinese-title text-3xl md:text-4xl mb-3">良缘天定·合婚详批</h2>
      <p class="text-china-brown/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
        探寻姻缘契合，共筑良缘。综合双方八字分析婚姻契合度，从性格、五行、缘分等多维度为您解读良缘匹配程度。
      </p>
    </div>

    <div v-if="showInputForm" class="chinese-card p-6 md:p-8 mb-6">
      <ProfileSelector
        ref="profileSelectorRef"
        title="命主信息"
        subtitle="请选择已有档案或手动输入命主信息"
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

            <div class="col-span-2">
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
          </div>
        </template>
      </ProfileSelector>
    </div>

    <div v-if="showInputForm" class="chinese-card p-6 md:p-8 mb-6">
      <h3 class="text-lg font-semibold text-china-brown mb-4">良缘匹配·配偶信息</h3>
      
      <div v-if="!partnerForm.birthDate" class="mb-6">
        <h4 class="text-md font-medium text-china-brown mb-3">选择已有档案作为配偶</h4>
        <div v-if="!profiles || profiles.length === 0" class="text-center py-4 text-gray-500">
          暂无档案可选择
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
          <div
            v-for="profile in filteredPartnerProfiles"
            :key="profile.id"
            @click="selectPartnerProfile(profile)"
            class="p-3 border rounded-lg cursor-pointer hover:bg-red-50 hover:border-china-red transition"
            :class="selectedPartnerProfileId === profile.id ? 'border-china-red bg-red-50' : 'border-gray-200'"
          >
            <div class="font-bold text-china-brown">{{ profile.name }}</div>
            <div class="text-sm text-gray-500">
              {{ profile.gender === 'male' ? '男' : '女' }} |
              {{ profile.birth_date }} {{ profile.birth_time }}
            </div>
          </div>
        </div>
        <button
          @click="usePartnerManual = true"
          class="w-full mt-4 px-4 py-2 border border-dashed border-china-gold rounded-lg text-china-brown hover:bg-gray-50"
        >
          手动输入配偶信息
        </button>
      </div>

      <div v-else class="mb-4 flex items-center justify-between">
        <div class="text-china-brown">
          已选择配偶：<span class="font-bold">{{ selectedPartnerName }}</span>
        </div>
        <button
          v-if="showPartnerClearButton"
          @click="clearPartnerSelection"
          class="text-sm text-china-red hover:underline"
        >
          重新选择
        </button>
      </div>

      <div v-if="usePartnerManual || partnerForm.birthDate" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-china-brown mb-2">
            姓名 <span class="text-china-red">*</span>
          </label>
          <input
            type="text"
            v-model="partnerForm.name"
            placeholder="请输入姓名"
            class="w-full px-4 py-2 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red"
            required
          />
        </div>

        <div>
          <label class="block text-china-brown mb-2">性别</label>
          <div class="flex space-x-4">
            <label class="flex items-center cursor-pointer px-4 py-2 border rounded-lg"
                   :class="partnerForm.gender === 'male' ? 'border-china-red bg-red-50' : 'border-gray-300'">
              <input type="radio" v-model="partnerForm.gender" value="male" class="mr-2 accent-china-red" />
              <span>男</span>
            </label>
            <label class="flex items-center cursor-pointer px-4 py-2 border rounded-lg"
                   :class="partnerForm.gender === 'female' ? 'border-china-red bg-red-50' : 'border-gray-300'">
              <input type="radio" v-model="partnerForm.gender" value="female" class="mr-2 accent-china-red" />
              <span>女</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-china-brown mb-2">出生日期</label>
          <input
            type="date"
            v-model="partnerForm.birthDate"
            class="w-full px-4 py-2 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red"
          />
        </div>

        <div>
          <label class="block text-china-brown mb-2">出生时辰</label>
          <select
            v-model="partnerForm.birthTime"
            class="w-full px-4 py-2 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red"
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
              {{ partnerForm.location?.name || '未选择' }}
            </div>
            <button
              @click="partnerShowLocationPicker = true"
              class="px-4 py-2 border border-china-gold rounded-lg text-china-red hover:bg-red-50"
            >
              选择
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 等待界面 -->
    <MarriageWaiting v-if="loading" ref="waitingRef" />

    <div v-if="showInputForm" class="mt-6 text-center">
      <button @click="analyze" :disabled="!canAnalyze" class="chinese-btn px-12 text-lg py-3">
        良缘天定·开始合婚
      </button>
    </div>

    <!-- 婚姻合婚结果 -->
    <div v-if="result && !loading" class="mt-8">
      <MarriageReport
        :marriage-data="marriageResult"
        :bazi1-data="resultData?.bazi"
        :bazi2-data="resultData?.partnerBazi"
        :name1="resultData?.name"
        :name2="resultData?.partnerName"
        @view-details="goToReportPage"
      />
    </div>

    <!-- 配偶位置选择弹窗 -->
    <div v-if="partnerShowLocationPicker" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-bold text-china-brown mb-4">选择出生地点</h3>
        <input
          type="text"
          v-model="partnerSearchQuery"
          placeholder="搜索城市..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-china-red"
        />
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <div
            v-for="city in filteredCities"
            :key="city.name"
            @click="selectPartnerLocation(city)"
            class="p-3 border rounded-lg cursor-pointer hover:bg-red-50 hover:border-china-red transition"
            :class="partnerForm.location?.name === city.name ? 'border-china-red bg-red-50' : 'border-gray-200'"
          >
            <div class="font-medium">{{ city.name }}</div>
          </div>
        </div>
        <button
          @click="partnerShowLocationPicker = false"
          class="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProfileSelector from '@/components/ProfileSelector.vue'
import MarriageReport from '@/components/MarriageReport.vue'
import MarriageWaiting from '@/components/MarriageWaiting.vue'
import api from '@/api'
import { timeToShichen } from '@/utils/shichen'

const router = useRouter()
const profileSelectorRef = ref<InstanceType<typeof ProfileSelector> | null>(null)
const waitingRef = ref<InstanceType<typeof MarriageWaiting> | null>(null)

const profiles = ref<any[]>([])
const selectedPartnerProfileId = ref<number | null>(null)
const selectedPartnerName = ref('')
const usePartnerManual = ref(false)
const showPartnerClearButton = ref(true)

const form = computed(() => profileSelectorRef.value?.form || {
  name: '',
  gender: 'male',
  birthDate: '',
  birthTime: '子时 (23:00-00:59)',
  location: { name: '', lat: 0, lng: 0 }
})

const partnerForm = ref({
  name: '',
  gender: 'female',
  birthDate: '',
  birthTime: '子时 (23:00-00:59)',
  location: { name: '', lat: 0, lng: 0 }
})

const partnerShowLocationPicker = ref(false)
const partnerSearchQuery = ref('')

const loading = ref(false)
const showInputForm = ref(true)
const result = ref('')
const marriageResult = ref<any>(null)
const resultData = ref<any>(null)

const filteredPartnerProfiles = computed(() => {
  const mainProfileId = profileSelectorRef.value?.selectedProfileId
  return profiles.value.filter(p => p.id !== mainProfileId)
})

const canAnalyze = computed(() => {
  const hasName = form.value.name && form.value.name.trim() !== ''
  const hasBirthDate = form.value.birthDate && form.value.birthDate.trim() !== ''
  const hasLocation = form.value.location?.name && form.value.location.name.trim() !== ''
  const hasPartnerName = partnerForm.value.name && partnerForm.value.name.trim() !== ''
  const hasPartner = !!partnerForm.value.birthDate
  const hasPartnerLocation = partnerForm.value.location?.name && partnerForm.value.location.name.trim() !== ''
  return hasName && hasBirthDate && hasLocation && hasPartnerName && hasPartner && hasPartnerLocation
})

const cities = [
  { name: '北京市', lat: 39.9042, lng: 116.4074 },
  { name: '上海市', lat: 31.2304, lng: 121.4737 },
  { name: '广州市', lat: 23.1291, lng: 113.2644 },
  { name: '深圳市', lat: 22.5431, lng: 114.0579 },
  { name: '杭州市', lat: 30.2741, lng: 120.1551 },
  { name: '南京市', lat: 32.0603, lng: 118.7969 },
  { name: '成都市', lat: 30.5728, lng: 104.0668 },
  { name: '重庆市', lat: 29.4316, lng: 106.9123 },
  { name: '武汉市', lat: 30.5928, lng: 114.3055 },
  { name: '西安市', lat: 34.3416, lng: 108.9398 },
  { name: '天津市', lat: 39.3434, lng: 117.3616 },
  { name: '苏州市', lat: 31.2989, lng: 120.5853 },
  { name: '长沙市', lat: 28.2282, lng: 112.9388 },
  { name: '郑州市', lat: 34.7466, lng: 113.6253 },
  { name: '沈阳市', lat: 41.8057, lng: 123.4328 },
  { name: '青岛市', lat: 36.0671, lng: 120.3826 },
  { name: '济南市', lat: 36.6512, lng: 117.1205 },
  { name: '大连市', lat: 38.9140, lng: 121.6147 },
  { name: '厦门市', lat: 24.4798, lng: 118.0894 },
  { name: '哈尔滨市', lat: 45.8038, lng: 126.5340 },
  { name: '长春市', lat: 43.8171, lng: 125.3235 },
  { name: '福州市', lat: 26.0745, lng: 119.2965 },
  { name: '南宁市', lat: 22.8170, lng: 108.3665 },
  { name: '昆明市', lat: 25.0406, lng: 102.7129 },
  { name: '兰州市', lat: 36.0611, lng: 103.8343 },
  { name: '乌鲁木齐市', lat: 43.8256, lng: 87.6168 },
  { name: '呼和浩特市', lat: 40.8414, lng: 111.7519 },
  { name: '石家庄市', lat: 38.0428, lng: 114.5149 },
  { name: '太原市', lat: 37.8706, lng: 112.5489 },
  { name: '合肥市', lat: 31.8206, lng: 117.2272 },
  { name: '南昌市', lat: 28.6829, lng: 115.8579 },
  { name: '贵阳市', lat: 26.6470, lng: 106.6302 },
  { name: '海口市', lat: 20.0444, lng: 110.1999 },
  { name: '拉萨市', lat: 29.6500, lng: 91.1000 },
  { name: '银川市', lat: 38.4680, lng: 106.2731 },
  { name: '西宁市', lat: 36.6171, lng: 101.7782 },
  { name: '东莞市', lat: 23.0489, lng: 113.7447 },
  { name: '佛山市', lat: 23.0218, lng: 113.1219 },
  { name: '宁波市', lat: 29.8683, lng: 121.5440 },
  { name: '无锡市', lat: 31.4912, lng: 120.3119 },
  { name: '温州市', lat: 28.0006, lng: 120.6994 },
  { name: '珠海市', lat: 22.2710, lng: 113.5767 },
  { name: '中山市', lat: 22.5176, lng: 113.3926 },
  { name: '惠州市', lat: 23.1115, lng: 114.4158 },
  { name: '保定市', lat: 38.8738, lng: 115.4647 },
  { name: '唐山市', lat: 39.6243, lng: 118.1944 },
  { name: '嘉兴市', lat: 30.7522, lng: 120.7551 },
  { name: '金华市', lat: 29.0789, lng: 119.6478 },
  { name: '台州市', lat: 28.6563, lng: 121.4209 }
]

const filteredCities = computed(() => {
  if (!partnerSearchQuery.value) return cities
  return cities.filter(c => c.name.includes(partnerSearchQuery.value))
})

const loadProfiles = async () => {
  try {
    const res = await api.get('/profiles')
    profiles.value = res.data || []
  } catch (e) {
    console.error('加载档案失败:', e)
    profiles.value = []
  }
}

const selectPartnerProfile = (profile: any) => {
  selectedPartnerProfileId.value = profile.id
  selectedPartnerName.value = profile.name
  partnerForm.value.name = profile.name
  partnerForm.value.gender = profile.gender
  partnerForm.value.birthDate = profile.birth_date
  
  const shichen = timeToShichen(profile.birth_time)
  partnerForm.value.birthTime = shichen.value
  
  try {
    partnerForm.value.location = JSON.parse(profile.location || '{}')
  } catch {
    partnerForm.value.location = { name: '', lat: 0, lng: 0 }
  }
}

const clearPartnerSelection = () => {
  selectedPartnerProfileId.value = null
  selectedPartnerName.value = ''
  partnerForm.value.name = ''
  partnerForm.value.birthDate = ''
  partnerForm.value.birthTime = '子时 (23:00-00:59)'
  partnerForm.value.location = { name: '', lat: 0, lng: 0 }
  usePartnerManual.value = false
}

const selectPartnerLocation = (city: any) => {
  partnerForm.value.location = { ...city }
  partnerShowLocationPicker.value = false
}

const goToReportPage = () => {
  const reportData = {
    marriageResult: marriageResult.value,
    bazi1: resultData.value?.bazi,
    bazi2: resultData.value?.partnerBazi,
    name1: resultData.value?.name,
    name2: resultData.value?.partnerName
  }
  localStorage.setItem('marriageReport', JSON.stringify(reportData))
  router.push('/marriage-report')
}

const onProfileSelected = (profile: any) => {
  console.log('已选择命主档案:', profile.name)
}

const onFormChanged = (formData: any) => {
  console.log('命主表单数据更新:', formData)
}

const analyze = async () => {
  if (!canAnalyze.value) {
    return alert('请填写完整的命主和配偶信息')
  }

  showInputForm.value = false
  loading.value = true
  
  setTimeout(() => {
    if (waitingRef.value) {
      waitingRef.value.analysisSteps[0].status = 'completed'
      waitingRef.value.analysisSteps[1].status = 'active'
    }
  }, 2000)
  
  setTimeout(() => {
    if (waitingRef.value) {
      waitingRef.value.analysisSteps[1].status = 'completed'
      waitingRef.value.analysisSteps[2].status = 'active'
    }
  }, 4000)
  
  setTimeout(() => {
    if (waitingRef.value) {
      waitingRef.value.analysisSteps[2].status = 'completed'
      waitingRef.value.analysisSteps[3].status = 'active'
    }
  }, 6000)
  
  setTimeout(() => {
    if (waitingRef.value) {
      waitingRef.value.analysisSteps[3].status = 'completed'
      waitingRef.value.analysisSteps[4].status = 'active'
    }
  }, 8000)
  
  setTimeout(() => {
    if (waitingRef.value) {
      waitingRef.value.analysisSteps[4].status = 'completed'
      waitingRef.value.analysisSteps[5].status = 'active'
    }
  }, 10000)
  
  try {
    const currentForm = form.value
    const currentProfileId = profileSelectorRef.value?.selectedProfileId

    const payload = {
      name: currentForm.name,
      gender: currentForm.gender,
      birthDate: currentForm.birthDate,
      birthTime: currentForm.birthTime,
      location: currentForm.location,
      profileId: currentProfileId,
      type: 'marriage',
      partnerBirthDate: partnerForm.value.birthDate,
      partnerBirthTime: partnerForm.value.birthTime,
      partnerGender: partnerForm.value.gender,
      partnerProfileId: selectedPartnerProfileId.value,
      partnerName: partnerForm.value.name
    }

    const res = await api.post('/ai/interpret', payload)
    resultData.value = res.data
    
    marriageResult.value = res.data.content
    result.value = 'ok'
    
    // 保存到历史记录
    try {
      await api.post('/history', {
        type: 'marriage',
        birthDate: currentForm.birthDate,
        birthTime: currentForm.birthTime,
        gender: currentForm.gender,
        partnerBirthDate: partnerForm.value.birthDate,
        partnerBirthTime: partnerForm.value.birthTime,
        partnerGender: partnerForm.value.gender,
        baziData: res.data.bazi || null,
        aiResult: res.data.content
      })
    } catch (historyErr) {
      console.warn('保存历史记录失败:', historyErr)
    }
    
    setTimeout(() => {
      if (waitingRef.value) {
        waitingRef.value.analysisSteps[5].status = 'completed'
        waitingRef.value.completeProgress()
      }
    }, 1000)
  } catch (e: any) {
    if (waitingRef.value) {
      waitingRef.value.resetProgress()
    }
    alert(e.response?.data?.error || '测算失败')
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 1500)
  }
}

onMounted(() => {
  loadProfiles()
  
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
