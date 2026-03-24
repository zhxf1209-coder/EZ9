<template>
  <div class="max-w-5xl mx-auto px-4">
    <!-- 页面标题区域 -->
    <div class="text-center mb-8">
      <h2 class="chinese-title text-3xl md:text-4xl mb-3">命主档案·个人信息</h2>
      <p class="text-china-brown/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
        记录命主信息，珍藏命理档案。统一管理命主信息，方便快速调用进行各类命理测算。
      </p>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
      <h2 class="chinese-title text-2xl text-center sm:text-left w-full sm:w-auto">命主列表</h2>
      <button @click="router.push('/profile-edit')" class="chinese-btn w-full sm:w-auto">
        + 新建命主档案
      </button>
    </div>

    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500">命主信息加载中...</p>
    </div>

    <div v-else-if="profiles.length === 0" class="text-center py-10 chinese-card">
      <p class="text-gray-500 mb-4">暂无命主档案</p>
      <button @click="router.push('/profile-edit')" class="chinese-btn">
        创建第一个命主档案
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div
        v-for="profile in profiles"
        :key="profile.id"
        class="chinese-card p-5 md:p-6 cursor-pointer hover:shadow-lg transition-shadow"
        @click="selectProfile(profile)"
      >
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
          <div class="text-center sm:text-left">
            <h3 class="text-xl md:text-2xl font-bold text-china-brown">{{ profile.name }}</h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ profile.gender === 'male' ? '乾造' : '坤造' }}
            </p>
          </div>
          <div class="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 justify-center sm:justify-start">
            <button
              @click.stop="editProfile(profile)"
              class="text-blue-500 hover:text-blue-700 text-sm px-3 py-1"
            >
              编辑
            </button>
            <button
              @click.stop="deleteProfile(profile.id)"
              class="text-red-500 hover:text-red-700 text-sm px-3 py-1"
            >
              删除
            </button>
          </div>
        </div>
        <div class="text-sm text-china-brown space-y-2">
          <p class="flex flex-col sm:flex-row sm:items-center">
            <span class="text-china-brown/70 sm:w-24">出生日期：</span>
            <span class="font-medium">{{ profile.birth_date }}</span>
          </p>
          <p class="flex flex-col sm:flex-row sm:items-center">
            <span class="text-china-brown/70 sm:w-24">出生时辰：</span>
            <span class="font-medium">{{ profile.birth_time }}</span>
          </p>
          <p v-if="profile.location_name" class="flex flex-col sm:flex-row sm:items-center">
            <span class="text-china-brown/70 sm:w-24">出生地点：</span>
            <span class="font-medium">{{ profile.location_name }}</span>
          </p>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-200">
          <button
            @click.stop="generateReport(profile)"
            class="w-full px-4 py-2 md:py-3 bg-china-red text-white rounded-lg hover:bg-red-700 transition text-base font-medium"
          >
            生成命理报告
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

const router = useRouter()
const profiles = ref<any[]>([])
const loading = ref(false)

onMounted(() => {
  loadProfiles()
})

const loadProfiles = async () => {
  loading.value = true
  try {
    const res = await api.get('/profiles')
    profiles.value = res.data.map((p: any) => {
      try {
        const location = JSON.parse(p.location || '{}')
        return { ...p, location_name: location.name }
      } catch {
        return { ...p, location_name: '' }
      }
    })
  } catch (e) {
    console.error('加载档案失败:', e)
  } finally {
    loading.value = false
  }
}

const selectProfile = (profile: any) => {
  localStorage.setItem('currentProfile', JSON.stringify({
    id: profile.id,
    name: profile.name,
    gender: profile.gender,
    birthDate: profile.birth_date,
    birthTime: profile.birth_time,
    location: JSON.parse(profile.location || '{}')
  }))
  router.push('/bazi-report')
}

const editProfile = (profile: any) => {
  router.push({
    path: '/profile-edit',
    query: { id: profile.id }
  })
}

const deleteProfile = async (id: number) => {
  if (!confirm('确定要删除这个档案吗？')) return
  try {
    await api.delete(`/profiles/${id}`)
    await loadProfiles()
  } catch (e) {
    alert('删除失败')
  }
}

const generateReport = (profile: any) => {
  selectProfile(profile)
}
</script>
