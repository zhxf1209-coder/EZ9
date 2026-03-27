<template>
  <div class="contact-float" v-if="showFloat">
    <div
      class="float-button"
      @click="togglePopup"
      :class="{ 'is-open': isOpen }"
    >
      <span class="float-icon">💬</span>
      <span class="float-text">咨询</span>
    </div>

    <transition name="popup">
      <div v-if="isOpen" class="float-popup">
        <div class="popup-header">
          <h3>{{ contactConfig.contact_title || '扫码添加微信客服' }}</h3>
          <button @click="togglePopup" class="close-btn">×</button>
        </div>
        <div class="popup-content">
          <p v-if="contactConfig.contact_text" class="contact-text">
            {{ contactConfig.contact_text }}
          </p>
          <div v-if="contactConfig.wechat_qrcode" class="qrcode-container">
            <img :src="contactConfig.wechat_qrcode" alt="微信二维码" class="qrcode" />
          </div>
          <p v-else class="no-qrcode">暂未配置微信二维码</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

const isOpen = ref(false)
const showFloat = ref(false)
const contactConfig = ref({
  contact_title: '',
  contact_text: '',
  wechat_qrcode: ''
})

const togglePopup = () => {
  isOpen.value = !isOpen.value
}

const loadContactConfig = async () => {
  try {
    const response = await api.get('/api/admin/config')
    contactConfig.value = response.data
    showFloat.value = true
  } catch (err) {
    console.error('Failed to load contact config:', err)
    showFloat.value = false
  }
}

onMounted(() => {
  loadContactConfig()
})
</script>

<style scoped>
.contact-float {
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 1000;
}

.float-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4a574, #c9302c);
  box-shadow: 0 4px 12px rgba(201, 48, 44, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.float-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(201, 48, 44, 0.5);
}

.float-button.is-open {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
}

.float-icon {
  font-size: 24px;
  line-height: 1;
}

.float-text {
  font-size: 10px;
  margin-top: 2px;
}

.float-popup {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.popup-header {
  background: linear-gradient(135deg, #d4a574, #c9302c);
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-header h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 20px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.popup-content {
  padding: 16px;
}

.contact-text {
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 16px;
  text-align: center;
  line-height: 1.6;
}

.qrcode-container {
  display: flex;
  justify-content: center;
}

.qrcode {
  width: 200px;
  height: 200px;
  border-radius: 8px;
}

.no-qrcode {
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
  padding: 20px 0;
}

.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>
