<template>
  <div v-if="!isClosed" class="contact-float">
    <transition name="popup">
      <div v-if="isOpen" class="float-popup">
        <div class="popup-header">
          <h3>{{ contactConfig.contact_title || '添加专家咨询更多内容' }}</h3>
          <button class="close-btn" @click="closePopup">×</button>
        </div>
        <div class="popup-content">
          <p v-if="contactConfig.contact_text" class="contact-text">
            {{ contactConfig.contact_text }}
          </p>
          <div v-if="contactConfig.wechat_qrcode" class="qrcode-container">
            <img :src="contactConfig.wechat_qrcode" alt="微信二维码" class="qrcode" />
          </div>
          <p v-else class="no-qrcode">暂未配置联系方式</p>
        </div>
      </div>
    </transition>

    <div class="float-button" :class="{ 'is-open': isOpen }" @click="togglePopup">
      <transition name="icon-switch" mode="out-in">
        <span v-if="isOpen" key="close" class="float-icon">×</span>
        <span v-else key="chat" class="float-icon">💬</span>
      </transition>
      <span class="float-text hidden sm:inline">{{ isOpen ? '关闭' : '咨询' }}</span>
    </div>
  </div>

  <div v-else class="contact-float">
    <button class="reopen-btn" @click="reopenFloat">
      <span class="reopen-icon">💬</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

const isOpen = ref(false)
const isClosed = ref(false)
const contactConfig = ref({
  contact_title: '',
  contact_text: '',
  wechat_qrcode: ''
})

const togglePopup = () => {
  isOpen.value = !isOpen.value
}

const closePopup = () => {
  isOpen.value = false
}

const closeFloat = () => {
  isClosed.value = true
  localStorage.setItem('contactFloatClosed', 'true')
}

const reopenFloat = () => {
  isClosed.value = false
  localStorage.removeItem('contactFloatClosed')
  isOpen.value = true
}

const loadContactConfig = async () => {
  const savedClosed = localStorage.getItem('contactFloatClosed')
  if (savedClosed === 'true') {
    isClosed.value = true
  }

  try {
    const response = await api.get('/admin/config')
    contactConfig.value = response.data
  } catch (err) {
    console.error('Failed to load contact config:', err)
  }
}

onMounted(() => {
  loadContactConfig()
})
</script>

<style scoped>
.contact-float {
  position: fixed;
  bottom: 20px;
  right: 4px;
  z-index: 1000;
}

@media (min-width: 640px) {
  .contact-float {
    right: 24px;
  }
}

.float-button {
  width: 48px;
  height: 48px;
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
  gap: 2px;
}

@media (min-width: 640px) {
  .float-button {
    width: 60px;
    height: 60px;
  }
}

.float-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(201, 48, 44, 0.5);
}

.float-button.is-open {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
}

.float-icon {
  font-size: 20px;
  line-height: 1;
}

@media (min-width: 640px) {
  .float-icon {
    font-size: 24px;
  }
}

.float-text {
  font-size: 8px;
  margin-top: 1px;
}

@media (min-width: 640px) {
  .float-text {
    font-size: 10px;
  }
}

.float-popup {
  position: absolute;
  bottom: 56px;
  right: 0;
  width: calc(100vw - 32px);
  max-width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

@media (min-width: 640px) {
  .float-popup {
    bottom: 70px;
  }
}

.popup-header {
  background: linear-gradient(135deg, #d4a574, #c9302c);
  color: white;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (min-width: 640px) {
  .popup-header {
    padding: 12px 16px;
  }
}

.popup-header h3 {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
}

@media (min-width: 640px) {
  .popup-header h3 {
    font-size: 14px;
  }
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 18px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

@media (min-width: 640px) {
  .close-btn {
    font-size: 20px;
    width: 24px;
    height: 24px;
  }
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.popup-content {
  padding: 12px 16px;
}

@media (min-width: 640px) {
  .popup-content {
    padding: 16px;
  }
}

.contact-text {
  font-size: 12px;
  color: #4b5563;
  margin-bottom: 12px;
  text-align: center;
  line-height: 1.6;
}

@media (min-width: 640px) {
  .contact-text {
    font-size: 13px;
    margin-bottom: 16px;
  }
}

.qrcode-container {
  display: flex;
  justify-content: center;
}

.qrcode {
  width: 160px;
  height: 160px;
  border-radius: 8px;
}

@media (min-width: 640px) {
  .qrcode {
    width: 180px;
    height: 180px;
  }
}

.no-qrcode {
  text-align: center;
  color: #9ca3af;
  font-size: 12px;
  padding-top: 16px;
}

@media (min-width: 640px) {
  .no-qrcode {
    font-size: 13px;
    padding-top: 20px;
  }
}

.reopen-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4a574, #c9302c);
  box-shadow: 0 4px 12px rgba(201, 48, 44, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  animation: bounce 2s infinite;
}

@media (min-width: 640px) {
  .reopen-btn {
    width: 60px;
    height: 60px;
  }
}

.reopen-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(201, 48, 44, 0.5);
  animation: none;
}

.reopen-icon {
  font-size: 20px;
}

@media (min-width: 640px) {
  .reopen-icon {
    font-size: 24px;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
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

.icon-switch-enter-active,
.icon-switch-leave-active {
  transition: all 0.2s ease;
}

.icon-switch-enter-from,
.icon-switch-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
