<template>
  <div class="max-w-5xl mx-auto">
    <!-- 页面标题区域 -->
    <div class="text-center mb-8">
      <h2 class="chinese-title text-3xl md:text-4xl mb-3">命理档案·历史记录</h2>
      <p class="text-china-brown/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
        回溯命理历程，珍藏每一次解读。完整保存历史测算记录，方便随时查阅回顾命理轨迹。
      </p>
    </div>

    <div v-if="loading" class="text-center text-china-brown py-8">命理档案加载中...</div>
    <div v-else-if="!records.length" class="text-center text-china-brown py-8">暂无命理档案记录</div>
    <div v-else class="space-y-4">
      <div v-for="record in records" :key="record.id" class="chinese-card p-4 md:p-6">
        <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div class="flex-1">
            <div class="font-semibold text-china-red text-lg">{{ typeLabels[record.type] || record.type }}</div>
            <div class="text-sm text-china-brown mt-2">
              <span class="inline-block mr-4 mb-1">
                <span class="text-china-brown/70">出生日期：</span>{{ record.birth_date || '未记录' }}
              </span>
              <span class="inline-block mb-1">
                <span class="text-china-brown/70">出生时辰：</span>{{ record.birth_time || '未记录' }}
              </span>
            </div>
            <!-- 四柱信息 -->
            <div v-if="getBaziData(record)" class="mt-3 flex flex-wrap gap-2">
              <span v-for="(pillar, index) in getBaziData(record)" :key="index" 
                    class="inline-block px-3 py-1 bg-red-50 text-china-red text-sm rounded">
                {{ pillar }}
              </span>
            </div>
            <div class="text-xs text-gray-500 mt-3">{{ formatDate(record.created_at) }}</div>
          </div>
          <div class="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
            <button @click="viewDetail(record)" class="text-china-red hover:underline text-sm px-3 py-1">查看详情</button>
            <button @click="deleteRecord(record.id)" class="text-red-500 hover:underline text-sm px-3 py-1">删除</button>
          </div>
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

const typeLabels: Record<string, string> = {
  full: '八字命理',
  daily: '今日运势',
  yearly: '年度运势',
  personality: '性格分析',
  marriage: '婚姻合婚',
  wealth: '财运分析',
  remedy: '化解建议'
}

const records = ref<any[]>([])
const loading = ref(true)

const loadRecords = async () => {
  try {
    const res = await api.get('/history')
    records.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const viewDetail = (record: any) => {
  // 将历史记录数据保存到 localStorage
  const historyData = {
    recordId: record.id,
    type: record.type,
    birthDate: record.birth_date,
    birthTime: record.birth_time,
    gender: record.gender,
    baziData: record.bazi_data,
    aiResult: record.ai_result
  }
  
  // 根据类型跳转到对应的详情页面或显示详情
  if (record.type === 'full') {
    localStorage.setItem('historyReport', JSON.stringify(historyData))
    router.push('/bazi-report')
  } else if (record.type === 'marriage') {
    localStorage.setItem('historyReport', JSON.stringify({
      ...historyData,
      partnerBirthDate: record.partner_birth_date,
      partnerBirthTime: record.partner_birth_time,
      partnerGender: record.partner_gender
    }))
    router.push('/marriage-report')
  } else {
    // 对于 daily, yearly 等类型，显示详情内容
    localStorage.setItem('historyReport', JSON.stringify(historyData))
    
    // 根据类型显示内容
    let message = ''
    if (record.ai_result) {
      try {
        const result = typeof record.ai_result === 'string' 
          ? JSON.parse(record.ai_result) 
          : record.ai_result
        if (typeof result === 'string') {
          message = result
        } else if (result.content) {
          message = result.content
        } else {
          message = JSON.stringify(result, null, 2)
        }
      } catch {
        message = record.ai_result
      }
    }
    
    // 使用 prompt 来显示内容（因为内容可能很长）
    const typeName = typeLabels[record.type] || record.type
    if (confirm(`${typeName}详情：\n\n${message.substring(0, 500)}${message.length > 500 ? '...' : ''}\n\n点击"确定"查看完整内容`)) {
      alert(message)
    }
  }
}

const deleteRecord = async (id: number) => {
  if (!confirm('确定删除此记录？')) return
  try {
    await api.delete(`/history/${id}`)
    records.value = records.value.filter(r => r.id !== id)
  } catch (e) {
    alert('删除失败')
  }
}

const formatDate = (date: string) => new Date(date).toLocaleString('zh-CN')

const getBaziData = (record: any) => {
  try {
    // 优先从 bazi_data 获取四柱信息
    if (record.bazi_data) {
      const baziData = typeof record.bazi_data === 'string'
        ? JSON.parse(record.bazi_data)
        : record.bazi_data
      if (baziData && baziData.fourPillars) {
        const { year, month, day, hour } = baziData.fourPillars
        return [`年柱 ${year}`, `月柱 ${month}`, `日柱 ${day}`, `时柱 ${hour}`]
      }
      // 如果没有 fourPillars，但有其他四柱数据
      if (baziData && (baziData.year || baziData.month || baziData.day || baziData.hour)) {
        return [
          `年柱 ${baziData.year || baziData.yearGan || ''}${baziData.yearZhi || ''}`,
          `月柱 ${baziData.month || baziData.monthGan || ''}${baziData.monthZhi || ''}`,
          `日柱 ${baziData.day || baziData.dayGan || ''}${baziData.dayZhi || ''}`,
          `时柱 ${baziData.hour || baziData.hourGan || ''}${baziData.hourZhi || ''}`
        ]
      }
    }
    
    // 尝试从 ai_result 中获取四柱信息
    if (record.ai_result) {
      const aiResult = typeof record.ai_result === 'string' 
        ? JSON.parse(record.ai_result) 
        : record.ai_result
      
      // 检查 aiResult 中是否有 baziData
      if (aiResult.bazi && aiResult.bazi.fourPillars) {
        const { year, month, day, hour } = aiResult.bazi.fourPillars
        return [`年柱 ${year}`, `月柱 ${month}`, `日柱 ${day}`, `时柱 ${hour}`]
      }
      
      // 检查是否有 tianGan 和 diZhi
      if (aiResult.bazi && aiResult.bazi.tianGan && aiResult.bazi.diZhi) {
        const tg = aiResult.bazi.tianGan
        const dz = aiResult.bazi.diZhi
        return [
          `年柱 ${tg[0] || ''}${dz[0] || ''}`,
          `月柱 ${tg[1] || ''}${dz[1] || ''}`,
          `日柱 ${tg[2] || ''}${dz[2] || ''}`,
          `时柱 ${tg[3] || ''}${dz[3] || ''}`
        ]
      }
    }
  } catch (e) {
    console.error('解析四柱数据失败:', e)
  }
  return null
}

onMounted(loadRecords)
</script>
