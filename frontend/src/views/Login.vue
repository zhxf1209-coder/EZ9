<template>
  <div class="max-w-md mx-auto">
    <div class="chinese-card p-8">
      <h2 class="chinese-title text-2xl mb-6 text-center">登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-china-brown mb-2">用户名</label>
          <input v-model="form.username" type="text" required class="w-full px-4 py-3 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red" placeholder="请输入用户名" />
        </div>
        <div class="mb-6">
          <label class="block text-china-brown mb-2">密码</label>
          <input v-model="form.password" type="password" required class="w-full px-4 py-3 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red" placeholder="请输入密码" />
        </div>
        <button type="submit" :disabled="loading" class="w-full chinese-btn">
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <p v-if="error" class="mt-4 text-red-600 text-center">{{ error }}</p>
      </form>
      <p class="mt-6 text-center text-china-brown">
        还没有账号？<router-link to="/register" class="text-china-red hover:underline">立即注册</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({ username: '', password: '' })
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await userStore.login(form.username, form.password)
    router.push('/')
  } catch (e: any) {
    error.value = e.response?.data?.error || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>
