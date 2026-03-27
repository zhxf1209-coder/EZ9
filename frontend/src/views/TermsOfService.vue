<template>
  <div class="max-w-4xl mx-auto p-6 md:p-8">
    <div class="chinese-card p-6 md:p-8">
      <h1 class="chinese-title text-2xl md:text-3xl text-center mb-6">服务条款与免责声明</h1>
      
      <div class="prose prose-china max-w-none text-china-brown/80">
        
        <div class="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <h2 class="text-lg font-bold text-china-brown mb-2">⚠️ 重要提示</h2>
          <p class="text-sm">
            本服务仅供<b>娱乐与文化研究</b>使用，所有分析内容仅供消遣，<b>请勿迷信</b>。
            命理分析基于传统命理学理论，不代表任何科学依据，不应被视为人生决策的依据。
          </p>
        </div>

        <h2 class="text-xl font-bold text-china-brown mt-6 mb-3">一、服务说明</h2>
        <div class="space-y-2 text-sm">
          <p>1.1 「{{ appName }}」（以下简称"本服务"）是一款基于中华传统命理学理论开发的娱乐分析工具。</p>
          <p>1.2 本服务通过人工智能技术，对用户输入的信息进行分析，并结合传统命理学理论给出参考性建议。</p>
          <p>1.3 本服务旨在弘扬中华传统文化，为用户提供文化娱乐体验。</p>
        </div>

        <h2 class="text-xl font-bold text-china-brown mt-6 mb-3">二、免责声明</h2>
        <div class="space-y-2 text-sm">
          <p class="font-semibold text-china-red">2.1 娱乐性质声明</p>
          <p>本服务所有功能及内容均仅供<b>娱乐消遣</b>和<b>传统文化研究</b>使用，不构成任何形式的投资、医疗、法律或其他专业建议。</p>
          
          <p class="font-semibold text-china-red">2.2 准确性声明</p>
          <p>命理学分析基于传统理论，其准确性和可靠性<b>未经科学验证</b>。本服务不对分析结果的准确性作出任何保证，用户应理性看待分析结果。</p>
          
          <p class="font-semibold text-china-red">2.3 决策声明</p>
          <p>用户不应将本服务的分析结果作为重要人生决策的依据，包括但不限于：</p>
          <ul class="list-disc list-inside ml-4 space-y-1">
            <li>婚姻及恋爱决策</li>
            <li>职业及投资决策</li>
            <li>健康医疗决策</li>
            <li>法律诉讼决策</li>
          </ul>
          <p>如有上述需求，请咨询相关领域的专业人士。</p>
          
          <p class="font-semibold text-china-red">2.4 命运观念</p>
          <p>本服务不宣扬迷信思想。用户应树立<b>科学的世界观</b>，认识到人生道路由个人努力决定，命运掌握在自己手中。</p>
        </div>

        <h2 class="text-xl font-bold text-china-brown mt-6 mb-3">三、用户义务</h2>
        <div class="space-y-2 text-sm">
          <p>3.1 用户应年满18周岁，或在监护人同意下使用本服务。</p>
          <p>3.2 用户需对账户安全负责，因账户被盗用导致的任何问题由用户承担责任。</p>
          <p>3.3 用户不得利用本服务从事任何违法活动。</p>
          <p>3.4 用户不得将本服务用于商业盈利目的。</p>
        </div>

        <h2 class="text-xl font-bold text-china-brown mt-6 mb-3">四、知识产权</h2>
        <div class="space-y-2 text-sm">
          <p>4.1 本服务的所有内容、设计、代码等知识产权归本服务运营方所有。</p>
          <p>4.2 用户在使用本服务时产生的分析结果，仅限个人非商业用途使用。</p>
        </div>

        <h2 class="text-xl font-bold text-china-brown mt-6 mb-3">五、隐私保护</h2>
        <div class="space-y-2 text-sm">
          <p>5.1 本服务尊重并保护用户隐私。</p>
          <p>5.2 用户注册信息及分析数据仅用于提供服务，不会用于商业用途。</p>
          <p>5.3 除法律法规要求外，未经用户同意，本服务不会向第三方透露用户个人信息。</p>
        </div>

        <h2 class="text-xl font-bold text-china-brown mt-6 mb-3">六、服务变更</h2>
        <div class="space-y-2 text-sm">
          <p>6.1 本服务保留随时修改或中断服务的权利，恕不另行通知。</p>
          <p>6.2 因服务变更导致的任何损失，本服务不承担责任。</p>
        </div>

        <h2 class="text-xl font-bold text-china-brown mt-6 mb-3">七、争议解决</h2>
        <div class="space-y-2 text-sm">
          <p>7.1 本服务条款的解释权归运营方所有。</p>
          <p>7.2 如因使用本服务产生争议，双方应友好协商解决。</p>
          <p>7.3 本服务条款受中华人民共和国法律管辖。</p>
        </div>

        <div class="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
          <p class="text-center">最后更新日期：2026年3月26日</p>
          <p class="text-center mt-2">
            <router-link to="/" class="text-china-red hover:underline">返回首页</router-link>
            <span class="mx-2">|</span>
            <router-link to="/privacy" class="text-china-red hover:underline">隐私政策</router-link>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const appName = computed(() => import.meta.env.VITE_APP_TITLE || '易经命理智能分析系统')
</script>

<style scoped>
.prose {
  line-height: 1.8;
}
.prose h2 {
  border-bottom: 2px solid #d4a574;
  padding-bottom: 0.5rem;
}
.prose p {
  text-indent: 2em;
}
</style>
