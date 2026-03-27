<template>
  <div class="min-h-screen bg-gradient-to-b from-amber-50 to-white">
    <div class="max-w-6xl mx-auto px-4 py-8">
      
      <div v-if="!isLoggedIn" class="max-w-md mx-auto mt-20">
        <div class="chinese-card p-8">
          <h1 class="chinese-title text-2xl text-center mb-6">管理员登录</h1>
          
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-china-brown mb-1">用户名</label>
              <input
                v-model="loginForm.username"
                type="text"
                required
                class="w-full px-4 py-2 border border-china-gold/30 rounded-lg focus:ring-2 focus:ring-china-gold focus:border-transparent"
                placeholder="请输入用户名"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-china-brown mb-1">密码</label>
              <input
                v-model="loginForm.password"
                type="password"
                required
                class="w-full px-4 py-2 border border-china-gold/30 rounded-lg focus:ring-2 focus:ring-china-gold focus:border-transparent"
                placeholder="请输入密码"
              />
            </div>
            
            <button
              type="submit"
              :disabled="loading"
              class="w-full chinese-btn py-3 disabled:opacity-50"
            >
              {{ loading ? '登录中...' : '登录' }}
            </button>
            
            <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
          </form>
        </div>
      </div>

      <div v-else>
        <div class="flex items-center justify-between mb-8">
          <h1 class="chinese-title text-2xl">管理后台</h1>
          <button @click="handleLogout" class="text-sm text-gray-500 hover:text-red-500">
            退出登录
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="chinese-card p-6 text-center">
            <div class="text-4xl font-bold text-china-red">{{ stats.users }}</div>
            <div class="text-sm text-gray-500 mt-2">注册用户</div>
          </div>
          <div class="chinese-card p-6 text-center">
            <div class="text-4xl font-bold text-china-red">{{ stats.histories }}</div>
            <div class="text-sm text-gray-500 mt-2">分析记录</div>
          </div>
          <div class="chinese-card p-6 text-center">
            <div class="text-4xl font-bold text-china-red">{{ stats.profiles }}</div>
            <div class="text-sm text-gray-500 mt-2">命主档案</div>
          </div>
        </div>

        <div class="chinese-card p-6">
          <h2 class="text-xl font-bold text-china-brown mb-6">网站配置</h2>
          
          <form @submit.prevent="saveConfig" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-china-brown mb-1">联系标题</label>
              <input
                v-model="config.contact_title"
                type="text"
                class="w-full px-4 py-2 border border-china-gold/30 rounded-lg focus:ring-2 focus:ring-china-gold focus:border-transparent"
                placeholder="例如：扫码添加微信客服"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-china-brown mb-1">联系文字</label>
              <textarea
                v-model="config.contact_text"
                rows="3"
                class="w-full px-4 py-2 border border-china-gold/30 rounded-lg focus:ring-2 focus:ring-china-gold focus:border-transparent"
                placeholder="例如：有任何问题欢迎添加微信咨询"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-china-brown mb-1">微信二维码图片（Base64）</label>
              <textarea
                v-model="config.wechat_qrcode"
                rows="4"
                class="w-full px-4 py-2 border border-china-gold/30 rounded-lg focus:ring-2 focus:ring-china-gold focus:border-transparent font-mono text-xs"
                placeholder="粘贴微信二维码的 Base64 图片数据"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">请上传微信二维码图片并转换为 Base64 格式后粘贴到此处</p>
              
              <div v-if="config.wechat_qrcode" class="mt-4">
                <p class="text-sm text-gray-500 mb-2">预览：</p>
                <img 
                  :src="config.wechat_qrcode" 
                  alt="微信二维码预览" 
                  class="max-w-xs border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div class="flex items-center gap-4">
              <button
                type="submit"
                :disabled="saving"
                class="chinese-btn px-6 py-2 disabled:opacity-50"
              >
                {{ saving ? '保存中...' : '保存配置' }}
              </button>
              <span v-if="saveSuccess" class="text-green-500 text-sm">保存成功！</span>
            </div>
          </form>
        </div>

        <div class="chinese-card p-6 mt-6">
          <h2 class="text-xl font-bold text-china-brown mb-4">配置说明</h2>
          <div class="text-sm text-gray-600 space-y-2">
            <p>• <strong>联系标题：</strong>悬浮球点击后弹窗的标题</p>
            <p>• <strong>联系文字：</strong>悬浮球弹窗中显示的说明文字</p>
            <p>• <strong>微信二维码：</strong>上传您的微信二维码图片，转换为 Base64 格式后粘贴</p>
            <p class="text-amber-600">提示：修改配置后，悬浮球将实时更新显示</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

const isLoggedIn = ref(false)
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const saveSuccess = ref(false)

const loginForm = ref({
  username: '',
  password: ''
})

const stats = ref({
  users: 0,
  histories: 0,
  profiles: 0
})

const config = ref({
  contact_title: '',
  contact_text: '',
  wechat_qrcode: ''
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await api.post('/api/admin/login', loginForm.value)
    localStorage.setItem('admin_token', response.data.token)
    isLoggedIn.value = true
    loadData()
  } catch (err: any) {
    error.value = err.response?.data?.error || '登录失败'
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('admin_token')
  isLoggedIn.value = false
  loginForm.value = { username: '', password: '' }
}

const loadData = async () => {
  try {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    
    const [statsRes, configRes] = await Promise.all([
      api.get('/api/admin/stats'),
      api.get('/api/admin/config')
    ])
    
    stats.value = statsRes.data
    config.value = configRes.data
  } catch (err) {
    console.error('Failed to load data:', err)
  }
}

const saveConfig = async () => {
  saving.value = true
  saveSuccess.value = false
  
  try {
    await api.post('/api/admin/config', config.value)
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to save config:', err)
    alert('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    isLoggedIn.value = true
    loadData()
  }
})
</script>
