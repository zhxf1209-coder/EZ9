import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 180000
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token && token.length < 2000) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    if (err.response?.status === 431) {
      console.warn('Storage error detected, clearing and retrying...')

      const originalRequest = err.config

      localStorage.removeItem('token')
      localStorage.removeItem('user')

      if (!originalRequest._retry) {
        originalRequest._retry = true
        originalRequest.headers.Authorization = undefined

        try {
          const response = await api(originalRequest)
          return response
        } catch {
          window.location.href = '/login'
          return Promise.reject(err)
        }
      }
    }

    return Promise.reject(err)
  }
)

export default api
