<template>
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-8">
      <h2 class="chinese-title text-3xl md:text-4xl mb-3">命理档案·历史记录</h2>
      <p class="text-china-brown/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
        回溯命理历程，珍藏每一次解读。完整保存历史测算记录，方便随时查阅回顾命理轨迹。
      </p>
    </div>

    <div v-if="loading" class="text-center text-china-brown py-8">命理档案加载中...</div>
    
    <div v-else>
      <div class="flex justify-center space-x-4 mb-6">
        <button 
          @click="activeTab = 'bazi'"
          class="px-6 py-2 rounded-lg font-medium transition-all"
          :class="activeTab === 'bazi' 
            ? 'bg-china-red text-white shadow-lg' 
            : 'bg-white text-china-brown hover:bg-red-50'"
        >
          📊 八字分析 ({{ stats.baziCount }})
        </button>
        <button 
          @click="activeTab = 'marriage'"
          class="px-6 py-2 rounded-lg font-medium transition-all"
          :class="activeTab === 'marriage' 
            ? 'bg-china-red text-white shadow-lg' 
            : 'bg-white text-china-brown hover:bg-red-50'"
        >
          💕 良缘匹配 ({{ stats.marriageCount }})
        </button>
      </div>

      <div v-if="!records.length" class="text-center text-china-brown py-8">
        暂无{{ activeTab === 'bazi' ? '八字分析' : '良缘匹配' }}记录
      </div>
      
      <div v-else class="space-y-4">
        <div v-for="record in records" :key="record.id" class="chinese-card p-4 md:p-5">
          <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-semibold text-china-red text-base md:text-lg">
                  {{ typeLabels[record.type] || record.type }}
                </span>
                <span v-if="record.type === 'marriage'" class="text-xs px-2 py-0.5 bg-pink-100 text-pink-600 rounded">
                  良缘匹配
                </span>
              </div>
              
              <div class="text-sm text-china-brown">
                <span class="inline-block mr-4 mb-1">
                  <span class="text-china-brown/70">出生日期：</span>{{ record.birth_date || '未记录' }}
                </span>
                <span class="inline-block mb-1">
                  <span class="text-china-brown/70">出生时辰：</span>{{ record.birth_time || '未记录' }}
                </span>
              </div>
              
              <div v-if="record.type === 'marriage' && record.partner_birth_date" class="text-sm text-china-brown mt-1">
                <span class="inline-block mr-4">
                  <span class="text-china-brown/70">配偶日期：</span>{{ record.partner_birth_date }}
                </span>
                <span class="inline-block">
                  <span class="text-china-brown/70">配偶时辰：</span>{{ record.partner_birth_time }}
                </span>
              </div>
              
              <div v-if="getBaziData(record)" class="mt-2 flex flex-wrap gap-2">
                <span v-for="(pillar, index) in getBaziData(record)" :key="index" 
                      class="inline-block px-2 py-0.5 bg-red-50 text-china-red text-xs rounded">
                  {{ pillar }}
                </span>
              </div>
              
              <div class="text-xs text-gray-500 mt-2">{{ formatDate(record.created_at) }}</div>
            </div>
            
            <div class="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
              <button @click="viewDetail(record)" class="text-china-red hover:underline text-sm px-3 py-1">查看详情</button>
              <button @click="deleteRecord(record.id)" class="text-red-500 hover:underline text-sm px-3 py-1">删除</button>
            </div>
          </div>
        </div>

        <div v-if="pagination.totalPages > 1" class="flex justify-center items-center space-x-2 mt-6">
          <button 
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page <= 1"
            class="px-3 py-1 rounded border text-sm"
            :class="pagination.page <= 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-china-brown hover:bg-red-50'"
          >
            上一页
          </button>
          
          <span class="px-3 py-1 text-sm text-china-brown">
            第 {{ pagination.page }} / {{ pagination.totalPages }} 页
          </span>
          
          <button 
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page >= pagination.totalPages"
            class="px-3 py-1 rounded border text-sm"
            :class="pagination.page >= pagination.totalPages 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-china-brown hover:bg-red-50'"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

const router = useRouter()

const typeLabels: Record<string, string> = {
  full: '八字命理',
  daily: '今日运势',
  yearly: '年度运势',
  personality: '性格分析',
  marriage: '良缘匹配',
  wealth: '财运分析',
  remedy: '化解建议'
}

const records = ref<any[]>([])
const loading = ref(true)
const activeTab = ref('bazi')
const stats = reactive({
  baziCount: 0,
  marriageCount: 0
})

const pagination = reactive({
  page: 1,
  pageSize: 15,
  total: 0,
  totalPages: 0
})

const loadStats = async () => {
  try {
    const [baziRes, marriageRes] = await Promise.all([
      api.get('/history?type=bazi&pageSize=1'),
      api.get('/history?type=marriage&pageSize=1')
    ])
    stats.baziCount = baziRes.data.pagination?.total || 0
    stats.marriageCount = marriageRes.data.pagination?.total || 0
  } catch (e) {
    console.error(e)
  }
}

const loadRecords = async () => {
  loading.value = true
  try {
    const res = await api.get(`/history?type=${activeTab.value}&page=${pagination.page}&pageSize=${pagination.pageSize}`)
    records.value = res.data.records
    if (res.data.pagination) {
      pagination.page = res.data.pagination.page
      pagination.pageSize = res.data.pagination.pageSize
      pagination.total = res.data.pagination.total
      pagination.totalPages = res.data.pagination.totalPages
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(activeTab, () => {
  pagination.page = 1
  loadRecords()
})

const changePage = (page: number) => {
  pagination.page = page
  loadRecords()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const viewDetail = (record: any) => {
  const historyData = {
    recordId: record.id,
    type: record.type,
    birthDate: record.birth_date,
    birthTime: record.birth_time,
    gender: record.gender,
    baziData: record.bazi_data,
    aiResult: record.ai_result
  }
  
  if (record.type === 'full') {
    localStorage.setItem('historyReport', JSON.stringify(historyData))
    router.push('/bazi-report')
  } else if (record.type === 'marriage') {
    try {
      const aiResult = typeof record.ai_result === 'string' 
        ? JSON.parse(record.ai_result) 
        : record.ai_result
      
      if (aiResult && aiResult.marriageResult) {
        localStorage.setItem('marriageReport', JSON.stringify(aiResult))
        router.push('/marriage-report')
      } else {
        alert('该历史记录数据不完整，请重新测算')
      }
    } catch (e) {
      console.error('解析历史记录失败:', e)
      alert('解析历史记录失败，请重新测算')
    }
  } else {
    localStorage.setItem('historyReport', JSON.stringify(historyData))
    
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
    await loadStats()
  } catch (e) {
    alert('删除失败')
  }
}

const formatDate = (date: string) => new Date(date).toLocaleString('zh-CN')

const getBaziData = (record: any) => {
  try {
    if (record.bazi_data) {
      const baziData = typeof record.bazi_data === 'string'
        ? JSON.parse(record.bazi_data)
        : record.bazi_data
      if (baziData && baziData.fourPillars) {
        const { year, month, day, hour } = baziData.fourPillars
        return [`年柱 ${year}`, `月柱 ${month}`, `日柱 ${day}`, `时柱 ${hour}`]
      }
      if (baziData && (baziData.year || baziData.month || baziData.day || baziData.hour)) {
        return [
          `年柱 ${baziData.year || baziData.yearGan || ''}${baziData.yearZhi || ''}`,
          `月柱 ${baziData.month || baziData.monthGan || ''}${baziData.monthZhi || ''}`,
          `日柱 ${baziData.day || baziData.dayGan || ''}${baziData.dayZhi || ''}`,
          `时柱 ${baziData.hour || baziData.hourGan || ''}${baziData.hourZhi || ''}`
        ]
      }
    }
    
    if (record.ai_result) {
      const aiResult = typeof record.ai_result === 'string' 
        ? JSON.parse(record.ai_result) 
        : record.ai_result
      
      if (aiResult.bazi && aiResult.bazi.fourPillars) {
        const { year, month, day, hour } = aiResult.bazi.fourPillars
        return [`年柱 ${year}`, `月柱 ${month}`, `日柱 ${day}`, `时柱 ${hour}`]
      }
      
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

onMounted(() => {
  loadStats()
  loadRecords()
})
</script>
