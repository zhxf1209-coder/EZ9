<template>
  <div class="profile-selector">
    <div v-if="!form.birthDate" class="mb-6">
      <h3 class="text-lg md:text-xl font-semibold text-china-brown mb-4">
        <span v-if="title">{{ title }}</span>
        <span v-else>选择已有档案</span>
      </h3>
      <p v-if="subtitle" class="text-sm text-china-brown/70 mb-4">{{ subtitle }}</p>
      <div v-if="!profiles || profiles.length === 0" class="text-center py-6 text-gray-500">
        <p class="mb-4">暂无命主档案</p>
        <router-link to="/profile-edit" class="text-china-red hover:underline">
          创建第一个命主档案
        </router-link>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
        <div
          v-for="profile in profiles"
          :key="profile.id"
          @click="selectProfile(profile)"
          class="p-3 md:p-4 border rounded-lg cursor-pointer hover:bg-red-50 hover:border-china-red transition"
          :class="selectedProfileId === profile.id ? 'border-china-red bg-red-50' : 'border-gray-200'"
        >
          <div class="font-bold text-china-brown text-base md:text-lg">{{ profile.name }}</div>
          <div class="text-sm text-gray-500 mt-1">
            {{ profile.gender === 'male' ? '乾造' : '坤造' }} |
            {{ profile.birth_date }}
          </div>
          <div class="text-xs text-gray-400 mt-1">{{ profile.birth_time }}</div>
        </div>
      </div>
      <button
        v-if="showManualButton"
        @click="useManual = true"
        class="w-full mt-4 px-4 py-2 md:py-3 border border-dashed border-china-gold rounded-lg text-china-brown hover:bg-gray-50 text-base"
      >
        手动输入命主信息
      </button>
    </div>

    <div v-else class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="text-china-brown text-center sm:text-left">
        已选择命主：<span class="font-bold text-lg">{{ selectedProfileName }}</span>
      </div>
      <button
        v-if="showClearButton"
        @click="clearSelection"
        class="text-sm text-china-red hover:underline px-3 py-1"
      >
        重新选择档案
      </button>
    </div>

    <div v-if="useManual || form.birthDate" class="manual-form">
      <slot name="manual-form" :form="form" :selectLocation="selectLocation" :showLocationPicker="setShowLocationPicker" :searchQuery="searchQuery" :filteredCities="filteredCities">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div>
            <label class="block text-china-brown mb-2 font-medium">
              姓名 <span class="text-china-red">*</span>
            </label>
            <input
              type="text"
              v-model="form.name"
              placeholder="请输入命主姓名"
              class="w-full px-4 py-2 md:py-3 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red text-base"
              required
            />
          </div>

          <div>
            <label class="block text-china-brown mb-2 font-medium">
              性别 <span class="text-china-red">*</span>
            </label>
            <div class="flex flex-wrap gap-2">
              <label class="flex-1 flex items-center justify-center cursor-pointer px-4 py-2 md:py-3 border rounded-lg min-w-[80px]"
                     :class="form.gender === 'male' ? 'border-china-red bg-red-50' : 'border-gray-300'">
                <input type="radio" v-model="form.gender" value="male" class="mr-2 accent-china-red" />
                <span>乾造</span>
              </label>
              <label class="flex-1 flex items-center justify-center cursor-pointer px-4 py-2 md:py-3 border rounded-lg min-w-[80px]"
                     :class="form.gender === 'female' ? 'border-china-red bg-red-50' : 'border-gray-300'">
                <input type="radio" v-model="form.gender" value="female" class="mr-2 accent-china-red" />
                <span>坤造</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-china-brown mb-2 font-medium">
              出生日期 <span class="text-china-red">*</span>
            </label>
            <input
              type="date"
              v-model="form.birthDate"
              class="w-full px-4 py-2 md:py-3 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red text-base"
              required
            />
          </div>

          <div>
            <label class="block text-china-brown mb-2 font-medium">
              出生时辰 <span class="text-china-red">*</span>
            </label>
            <select
              v-model="form.birthTime"
              class="w-full px-4 py-2 md:py-3 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red text-base"
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

          <div class="sm:col-span-2">
            <label class="block text-china-brown mb-2 font-medium">
              出生地点 <span class="text-china-red">*</span>
            </label>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div class="flex-1 px-4 py-2 md:py-3 border border-china-gold rounded-lg bg-gray-50 text-base">
                {{ form.location?.name || '未选择' }}
              </div>
              <button
                @click="showLocationPicker = true"
                class="px-4 py-2 md:py-3 border border-china-gold rounded-lg text-china-red hover:bg-red-50 text-base"
              >
                选择地点
              </button>
            </div>
          </div>
        </div>
      </slot>
    </div>

    <div v-if="showLocationPicker" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-bold text-china-brown mb-4">选择出生地点</h3>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索城市..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-china-red"
        />
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <div
            v-for="city in filteredCities"
            :key="city.name"
            @click="selectLocation(city)"
            class="p-3 border rounded-lg cursor-pointer hover:bg-red-50 hover:border-china-red transition"
            :class="form.location?.name === city.name ? 'border-china-red bg-red-50' : 'border-gray-200'"
          >
            <div class="font-medium">{{ city.name }}</div>
          </div>
        </div>
        <button
          @click="showLocationPicker = false"
          class="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/api'
import { timeToShichen } from '@/utils/shichen'

interface Profile {
  id: number
  name: string
  gender: string
  birth_date: string
  birth_time: string
  location?: string
}

interface FormData {
  name: string
  gender: string
  birthDate: string
  birthTime: string
  location: {
    name: string
    lat: number
    lng: number
  }
}

interface Props {
  title?: string
  subtitle?: string
  showManualButton?: boolean
  showClearButton?: boolean
  autoLoad?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  showManualButton: true,
  showClearButton: true,
  autoLoad: true
})

const emit = defineEmits<{
  (e: 'profile-selected', profile: Profile): void
  (e: 'form-changed', form: FormData): void
}>()

const profiles = ref<Profile[]>([])
const selectedProfileId = ref<number | null>(null)
const selectedProfileName = ref('')
const useManual = ref(false)

const form = ref<FormData>({
  name: '',
  gender: 'male',
  birthDate: '',
  birthTime: '子时 (23:00-00:59)',
  location: { name: '', lat: 0, lng: 0 }
})

const showLocationPicker = ref(false)
const setShowLocationPicker = (value: boolean) => {
  showLocationPicker.value = value
}
const searchQuery = ref('')

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
  if (!searchQuery.value) return cities
  return cities.filter(c => c.name.includes(searchQuery.value))
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

const selectLocation = (city: typeof cities[0]) => {
  form.value.location = { ...city }
  showLocationPicker.value = false
  emit('form-changed', form.value)
}

const selectProfile = (profile: Profile) => {
  selectedProfileId.value = profile.id
  selectedProfileName.value = profile.name
  form.value.name = profile.name
  form.value.gender = profile.gender
  form.value.birthDate = profile.birth_date
  
  const shichen = timeToShichen(profile.birth_time)
  form.value.birthTime = shichen.value
  
  try {
    form.value.location = JSON.parse(profile.location || '{}')
  } catch {
    form.value.location = { name: '', lat: 0, lng: 0 }
  }
  
  emit('profile-selected', profile)
  emit('form-changed', form.value)
}

const clearSelection = () => {
  selectedProfileId.value = null
  selectedProfileName.value = ''
  form.value.name = ''
  form.value.gender = 'male'
  form.value.birthDate = ''
  form.value.birthTime = '子时 (23:00-00:59)'
  form.value.location = { name: '', lat: 0, lng: 0 }
  useManual.value = false
  emit('form-changed', form.value)
}

watch(form, (newForm) => {
  emit('form-changed', newForm)
}, { deep: true })

defineExpose({
  form,
  selectedProfileId,
  selectedProfileName,
  clearSelection
})

onMounted(() => {
  if (props.autoLoad) {
    loadProfiles()
  }
})
</script>

<style scoped>
.profile-selector {
  width: 100%;
}

.manual-form {
  margin-top: 1rem;
}
</style>
