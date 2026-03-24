import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref<{ id: number; username: string } | null>(null)
  const settings = ref<{ aiProvider: string; apiKey: string; modelName?: string }>({ aiProvider: 'doubao', apiKey: '', modelName: '' })

  const isLoggedIn = computed(() => !!token.value)

  const login = async (username: string, password: string) => {
    const res = await api.post('/auth/login', { username, password })
    token.value = res.data.token
    user.value = res.data.user
    localStorage.setItem('token', res.data.token)
  }

  const register = async (username: string, password: string) => {
    await api.post('/auth/register', { username, password })
  }

  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }

  const loadSettings = async () => {
    if (!token.value) return
    const res = await api.get('/settings')
    settings.value = res.data
  }

  const saveSettings = async (newSettings: { aiProvider: string; apiKey: string; modelName?: string }) => {
    await api.put('/settings', newSettings)
    settings.value = newSettings
  }

  return { token, user, settings, isLoggedIn, login, register, logout, loadSettings, saveSettings }
})
