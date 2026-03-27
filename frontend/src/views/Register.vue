<template>
  <div class="max-w-md mx-auto">
    <div class="chinese-card p-8">
      <h2 class="chinese-title text-2xl mb-6 text-center">注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-china-brown mb-2">用户名</label>
          <input v-model="form.username" type="text" required class="w-full px-4 py-3 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red" placeholder="请输入用户名" />
        </div>
        <div class="mb-4">
          <label class="block text-china-brown mb-2">密码</label>
          <input v-model="form.password" type="password" required class="w-full px-4 py-3 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red" placeholder="请输入密码" />
        </div>
        <div class="mb-6">
          <label class="block text-china-brown mb-2">确认密码</label>
          <input v-model="form.confirmPassword" type="password" required class="w-full px-4 py-3 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red" placeholder="请再次输入密码" />
        </div>
        <button type="submit" :disabled="loading" class="w-full chinese-btn">
          {{ loading ? '注册中...' : '注册' }}
        </button>
        <p v-if="error" class="mt-4 text-red-600 text-center">{{ error }}</p>
        <p v-if="success" class="mt-4 text-green-600 text-center">{{ success }}</p>
      </form>
      <p class="mt-6 text-center text-china-brown">
        已有账号？<router-link to="/login" class="text-china-red hover:underline">立即登录</router-link>
      </p>

      <div class="mt-6 text-xs text-gray-500 text-center">
        点击注册即表示您已阅读并同意
        <router-link to="/terms" class="text-china-red hover:underline">《服务条款》</router-link>
        和
        <router-link to="/privacy" class="text-china-red hover:underline">《隐私政策》</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({ username: '', password: '', confirmPassword: '' })
const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    error.value = '两次密码输入不一致'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await userStore.register(form.username, form.password)
    success.value = '注册成功，即将跳转登录页...'
    setTimeout(() => router.push('/login'), 1500)
  } catch (e: any) {
    error.value = e.response?.data?.error || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>
