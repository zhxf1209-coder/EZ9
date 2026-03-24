<template>
  <div class="max-w-lg mx-auto p-4">
    <h2 class="chinese-title text-2xl mb-6 text-center">
      {{ isEdit ? '编辑档案' : '新建档案' }}
    </h2>

    <div class="chinese-card p-6">
      <div class="mb-5">
        <label class="block text-china-brown mb-2">
          <span class="text-china-red">*</span> 档案名称
        </label>
        <input
          type="text"
          v-model="form.name"
          placeholder="本人"
          class="w-full px-4 py-3 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red bg-white"
        />
      </div>

      <div class="mb-5">
        <label class="block text-china-brown mb-2">
          <span class="text-china-red">*</span> 性别
        </label>
        <div class="flex space-x-6">
          <label class="flex items-center cursor-pointer px-4 py-2 border rounded-lg"
                 :class="form.gender === 'male' ? 'border-china-red bg-red-50' : 'border-gray-300'">
            <input type="radio" v-model="form.gender" value="male" class="mr-2 accent-china-red" />
            <span>男</span>
          </label>
          <label class="flex items-center cursor-pointer px-4 py-2 border rounded-lg"
                 :class="form.gender === 'female' ? 'border-china-red bg-red-50' : 'border-gray-300'">
            <input type="radio" v-model="form.gender" value="female" class="mr-2 accent-china-red" />
            <span>女</span>
          </label>
        </div>
      </div>

      <div class="mb-5">
        <label class="block text-china-brown mb-2">
          <span class="text-china-red">*</span> 出生日期
        </label>
        <input
          type="date"
          v-model="form.birthDate"
          class="w-full px-4 py-3 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red bg-white"
        />
      </div>

      <div class="mb-5">
        <label class="block text-china-brown mb-2">
          <span class="text-china-red">*</span> 出生时间
        </label>
        <input
          type="time"
          v-model="form.birthTime"
          class="w-full px-4 py-3 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red bg-white"
        />
      </div>

      <div class="mb-6">
        <label class="block text-china-brown mb-2">
          <span class="text-china-red">*</span> 出生地点
        </label>
        <div class="flex items-center space-x-2">
          <div class="flex-1 px-4 py-3 border border-china-gold rounded-lg bg-gray-50">
            <div v-if="form.location.name" class="text-china-brown">
              {{ form.location.name }}
              <div class="text-xs text-gray-500 mt-1">
                经纬度: {{ form.location.lat?.toFixed(4) }}, {{ form.location.lng?.toFixed(4) }}
              </div>
            </div>
            <div v-else class="text-gray-400">请选择出生地点</div>
          </div>
          <button
            @click="showLocationPicker = true"
            class="px-4 py-3 border border-china-gold rounded-lg text-china-red hover:bg-red-50 transition"
          >
            修改
          </button>
        </div>
      </div>

      <div class="flex space-x-4">
        <button @click="cancel" class="flex-1 px-6 py-3 border border-china-gold rounded-lg text-china-brown hover:bg-gray-100 transition">
          取消
        </button>
        <button @click="save" :disabled="saving" class="flex-1 chinese-btn">
          {{ saving ? '保存中...' : '保存' }}
        </button>
      </div>
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
            :class="form.location.name === city.name ? 'border-china-red bg-red-50' : 'border-gray-200'"
          >
            <div class="font-medium">{{ city.name }}</div>
            <div class="text-xs text-gray-500">{{ city.lat.toFixed(4) }}, {{ city.lng.toFixed(4) }}</div>
          </div>
        </div>
        <button
          @click="showLocationPicker = false"
          class="w-full mt-4 px-4 py-2 bg-china-red text-white rounded-lg"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api'

const router = useRouter()
const route = useRoute()

const form = reactive({
  name: '本人',
  gender: 'male',
  birthDate: '',
  birthTime: '12:00',
  location: {
    name: '',
    lat: 0,
    lng: 0
  }
})

const showLocationPicker = ref(false)
const searchQuery = ref('')
const saving = ref(false)
const isEdit = ref(false)
const profileId = ref<number | null>(null)

const cities = [
  { name: '中国 北京市', lat: 39.9042, lng: 116.4074 },
  { name: '中国 上海市', lat: 31.2304, lng: 121.4737 },
  { name: '中国 广东省 广州市', lat: 23.1291, lng: 113.2644 },
  { name: '中国 广东省 深圳市', lat: 22.5431, lng: 114.0579 },
  { name: '中国 福建省 福州市', lat: 26.0745, lng: 119.2965 },
  { name: '中国 福建省 厦门市', lat: 24.4798, lng: 118.0894 },
  { name: '中国 浙江省 杭州市', lat: 30.2741, lng: 120.1551 },
  { name: '中国 江苏省 南京市', lat: 32.0603, lng: 118.7969 },
  { name: '中国 江苏省 苏州市', lat: 31.2990, lng: 120.5853 },
  { name: '中国 四川省 成都市', lat: 30.5728, lng: 104.0668 },
  { name: '中国 重庆市', lat: 29.4316, lng: 106.9123 },
  { name: '中国 湖北省 武汉市', lat: 30.5928, lng: 114.3055 },
  { name: '中国 陕西省 西安市', lat: 34.3416, lng: 108.9398 },
  { name: '中国 天津市', lat: 39.3434, lng: 117.3616 },
  { name: '中国 湖南省 长沙市', lat: 28.2282, lng: 112.9388 },
  { name: '中国 辽宁省 沈阳市', lat: 41.8057, lng: 123.4315 },
  { name: '中国 山东省 济南市', lat: 36.6512, lng: 117.1201 },
  { name: '中国 山东省 青岛市', lat: 36.0671, lng: 120.3826 },
  { name: '中国 河南省 郑州市', lat: 34.7466, lng: 113.6254 },
  { name: '中国 吉林省 长春市', lat: 43.8171, lng: 125.3235 },
  { name: '中国 黑龙江省 哈尔滨市', lat: 45.8038, lng: 126.5350 },
  { name: '中国 安徽省 合肥市', lat: 31.8206, lng: 117.2272 },
  { name: '中国 江西省 南昌市', lat: 28.6820, lng: 115.8579 },
  { name: '中国 云南省 昆明市', lat: 24.8801, lng: 102.8329 },
  { name: '中国 贵州省 贵阳市', lat: 26.6470, lng: 106.6302 },
  { name: '中国 甘肃省 兰州市', lat: 36.0611, lng: 103.8343 },
  { name: '中国 海南省 海口市', lat: 20.0440, lng: 110.1999 },
  { name: '中国 内蒙古 呼和浩特市', lat: 40.8424, lng: 111.7490 },
  { name: '中国 广西 南宁市', lat: 22.8170, lng: 108.3665 },
  { name: '中国 新疆 乌鲁木齐市', lat: 43.8256, lng: 87.6168 },
  { name: '中国 西藏 拉萨市', lat: 29.6500, lng: 91.1000 },
  { name: '中国 宁夏 银川市', lat: 38.4872, lng: 106.2309 },
  { name: '中国 青海省 西宁市', lat: 36.6171, lng: 101.7782 },
  { name: '中国 香港特别行政区', lat: 22.3193, lng: 114.1694 },
  { name: '中国 澳门特别行政区', lat: 22.1987, lng: 113.5439 },
  { name: '中国 台湾省 台北市', lat: 25.0330, lng: 121.5654 }
]

const filteredCities = computed(() => {
  if (!searchQuery.value) return cities
  return cities.filter(c => c.name.includes(searchQuery.value))
})

const selectLocation = (city: typeof cities[0]) => {
  form.location = { ...city }
}

const loadProfile = async (id: number) => {
  try {
    const res = await api.get(`/profiles/${id}`)
    const profile = res.data
    form.name = profile.name
    form.gender = profile.gender
    form.birthDate = profile.birth_date
    form.birthTime = profile.birth_time
    try {
      form.location = JSON.parse(profile.location || '{}')
    } catch {
      form.location = { name: '', lat: 0, lng: 0 }
    }
  } catch (e) {
    alert('加载档案失败')
    router.push('/profiles')
  }
}

onMounted(() => {
  if (route.query.id) {
    isEdit.value = true
    profileId.value = Number(route.query.id)
    loadProfile(profileId.value!)
  }
})

const save = async () => {
  if (!form.name || !form.name.trim()) return alert('请输入档案名称')
  if (!form.birthDate) return alert('请选择出生日期')
  if (!form.birthTime) return alert('请选择出生时间')
  if (!form.location.name) return alert('请选择出生地点')

  saving.value = true
  try {
    const data = {
      name: form.name.trim(),
      gender: form.gender,
      birth_date: form.birthDate,
      birth_time: form.birthTime,
      location: form.location
    }

    if (isEdit.value && profileId.value) {
      await api.put(`/profiles/${profileId.value}`, data)
    } else {
      await api.post('/profiles', data)
    }

    const currentProfile = {
      ...data,
      birthDate: data.birth_date,
      birthTime: data.birth_time,
      id: profileId.value || Date.now()
    }
    localStorage.setItem('currentProfile', JSON.stringify(currentProfile))

    router.push('/profiles')
  } catch (e: any) {
    console.error('保存档案失败:', e)
    alert(e.response?.data?.error || '保存失败，请重试')
  } finally {
    saving.value = false
  }
}

const cancel = () => {
  router.back()
}
</script>
