<template>
  <div class="chinese-card p-6">
    <h3 class="chinese-title text-xl mb-6 text-center">{{ title }}</h3>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-china-brown mb-2">出生日期</label>
        <input type="date" v-model="form.birthDate" class="w-full px-4 py-2 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red" />
      </div>
      <div>
        <label class="block text-china-brown mb-2">出生时辰</label>
        <select v-model="form.birthTime" class="w-full px-4 py-2 border border-china-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-china-red">
          <option value="00:00">子时 (23:00-01:00)</option>
          <option value="02:00">丑时 (01:00-03:00)</option>
          <option value="04:00">寅时 (03:00-05:00)</option>
          <option value="06:00">卯时 (05:00-07:00)</option>
          <option value="08:00">辰时 (07:00-09:00)</option>
          <option value="10:00">巳时 (09:00-11:00)</option>
          <option value="12:00">午时 (11:00-13:00)</option>
          <option value="14:00">未时 (13:00-15:00)</option>
          <option value="16:00">申时 (15:00-17:00)</option>
          <option value="18:00">酉时 (17:00-19:00)</option>
          <option value="20:00">戌时 (19:00-21:00)</option>
          <option value="22:00">亥时 (21:00-23:00)</option>
        </select>
      </div>
      <div class="col-span-2">
        <label class="block text-china-brown mb-2">性别</label>
        <div class="flex space-x-6">
          <label class="flex items-center cursor-pointer">
            <input type="radio" v-model="form.gender" value="male" class="mr-2 accent-china-red" />
            <span>男</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input type="radio" v-model="form.gender" value="female" class="mr-2 accent-china-red" />
            <span>女</span>
          </label>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{ title?: string; modelValue?: any }>()
const emit = defineEmits(['update:modelValue'])

const form = reactive({
  birthDate: props.modelValue?.birthDate || '',
  birthTime: props.modelValue?.birthTime || '12:00',
  gender: props.modelValue?.gender || 'male'
})

watch(form, (val) => {
  emit('update:modelValue', { ...val })
}, { deep: true })
</script>
