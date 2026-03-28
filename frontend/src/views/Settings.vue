<template>
  <div class="max-w-2xl mx-auto">
    <div v-if="!isLoggedIn" class="chinese-card p-8 text-center">
      <h2 class="chinese-title text-2xl mb-6">设置</h2>
      <p class="text-china-brown mb-4">请先登录后再访问设置页面</p>
      <router-link to="/login" class="chinese-btn inline-block">
        去登录
      </router-link>
    </div>

    <div v-else class="chinese-card p-8">
      <h2 class="chinese-title text-2xl mb-6 text-center">设置</h2>

      <div class="mb-6">
        <h3 class="text-lg font-semibold text-china-brown mb-4">AI服务配置</h3>

        <div class="mb-4">
          <label class="block text-china-brown mb-2">AI服务提供商</label>
          <select
            v-model="form.aiProvider"
            class="w-full px-4 py-3 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red"
          >
            <option value="doubao">豆包 (字节跳动)</option>
            <option value="minimax">MiniMax</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-china-brown mb-2">模型名称</label>
          <input
            v-model="form.modelName"
            type="text"
            class="w-full px-4 py-3 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red"
            :placeholder="modelPlaceholder"
          />
          <p class="text-xs text-gray-500 mt-1">
            例如：豆包使用 doubao-seed-2-0-lite-260215，MiniMax使用 MiniMax-M2.7
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-china-brown mb-2">API Key</label>
          <div class="relative">
            <input
              v-model="form.apiKey"
              :type="showApiKey ? 'text' : 'password'"
              class="w-full px-4 py-3 pr-12 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red"
              placeholder="请输入API Key"
            />
            <button
              type="button"
              @click="showApiKey = !showApiKey"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {{ showApiKey ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>

        <div class="mb-4">
          <button
            @click="testApi"
            :disabled="testing || !form.apiKey"
            class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {{ testing ? '测试中...' : '测试API连接' }}
          </button>
          <p v-if="testResult" class="mt-2 text-sm" :class="testSuccess ? 'text-green-600' : 'text-red-600'">
            {{ testResult }}
          </p>
        </div>

        <div class="bg-china-cream p-4 rounded-lg text-sm text-china-brown">
          <p class="font-semibold mb-2">获取API Key：</p>
          <ul class="list-disc list-inside space-y-1">
            <li>豆包：访问 <a href="https://console.volcengine.com/ark" target="_blank" class="text-china-red hover:underline">火山引擎控制台</a></li>
            <li>MiniMax：访问 <a href="https://api.minimax.chat" target="_blank" class="text-china-red hover:underline">MiniMax开放平台</a></li>
          </ul>
        </div>
      </div>

      <button
        @click="saveSettings"
        :disabled="saving || !testPassed"
        class="w-full chinese-btn"
      >
        {{ saving ? '保存中...' : (testPassed ? '保存设置' : '请先测试API连接') }}
      </button>
      <p v-if="message" class="mt-4 text-center" :class="messageType === 'success' ? 'text-green-600' : 'text-red-600'">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api'

const userStore = useUserStore()

const form = reactive({ aiProvider: 'doubao', apiKey: '', modelName: '' })
const saving = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const testing = ref(false)
const testResult = ref('')
const testSuccess = ref(false)
const showApiKey = ref(false)
const testPassed = ref(false)

const isLoggedIn = computed(() => userStore.isLoggedIn)

const modelPlaceholder = computed(() => {
  if (form.aiProvider === 'doubao') {
    return '例如：doubao-seed-2-0-lite-260215'
  } else {
    return '例如：MiniMax-M2.7'
  }
})

onMounted(async () => {
  if (!userStore.isLoggedIn) return
  
  try {
    await userStore.loadSettings()
    form.aiProvider = userStore.settings.aiProvider || 'doubao'
    form.apiKey = userStore.settings.apiKey || ''
    form.modelName = (userStore.settings as any).modelName || ''
    if (form.apiKey) {
      testPassed.value = true
    }
  } catch (e) {
    console.error('加载设置失败:', e)
  }
})

const testApi = async () => {
  testing.value = true
  testResult.value = ''
  testSuccess.value = false

  try {
    const res = await api.post('/test', {
      aiProvider: form.aiProvider,
      apiKey: form.apiKey,
      modelName: form.modelName
    })
    testResult.value = res.data.message
    testSuccess.value = res.data.success
    testPassed.value = res.data.success
  } catch (e: any) {
    testResult.value = e.response?.data?.error || 'API连接失败'
    testSuccess.value = false
    testPassed.value = false
  } finally {
    testing.value = false
  }
}

const saveSettings = async () => {
  saving.value = true
  message.value = ''
  try {
    await userStore.saveSettings({
      aiProvider: form.aiProvider,
      apiKey: form.apiKey,
      modelName: form.modelName
    })
    message.value = '设置已保存'
    messageType.value = 'success'
  } catch (e: any) {
    message.value = e.response?.data?.error || '保存失败'
    messageType.value = 'error'
  } finally {
    saving.value = false
  }
}
</script>
