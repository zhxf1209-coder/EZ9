<template>
  <div class="max-w-4xl mx-auto p-6 md:p-8">
    <div class="chinese-card p-6 md:p-8">
      <h1 class="chinese-title text-2xl md:text-3xl text-center mb-6">隐私政策</h1>
      
      <div class="prose prose-china max-w-none text-china-brown/80">
        
        <div class="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
          <h2 class="text-lg font-bold text-china-brown mb-2">🔒 隐私保护承诺</h2>
          <p class="text-sm">
            我们高度重视您的个人隐私保护，承诺仅将您的信息用于改善服务质量，不进行任何商业出售或滥用。
          </p>
        </div>

        <h2 class="text-xl font-bold text-china-brown mt-6 mb-3">一、信息收集</h2>
        <div class="space-y-2 text-sm">
          <p>1.1 我们收集的信息仅包括：</p>
          <ul class="list-disc list-inside ml-4 space-y-1">
            <li>用户注册信息（用户名、密码加密存储）</li>
            <li>命主档案信息（姓名、出生日期、出生时辰、出生地点）</li>
            <li>使用记录（分析历史）</li>
          </ul>
          <p>1.2 我们<b>不收集</b>与命理分析无关的个人敏感信息。</p>
        </div>

        <h2 class="text-xl font-bold text-china-brown mt-6 mb-3">二、信息使用</h2>
        <div class="space-y-2 text-sm">
          <p>2.1 您的信息仅用于：</p>
          <ul class="list-disc list-inside ml-4 space-y-1">
            <li>提供个性化命理分析服务</li>
            <li>保存您的分析记录</li>
            <li>改善服务质量</li>
          </ul>
        </div>

        <h2 class="text-xl font-bold text-china-brown mt-6 mb-3">三、信息共享</h2>
        <div class="space-y-2 text-sm">
          <p>3.1 我们<b>不会</b>向任何第三方出售、交换或泄露您的个人信息。</p>
          <p>3.2 除以下情况外，我们不会共享您的信息：</p>
          <ul class="list-disc list-inside ml-4 space-y-1">
            <li>法律法规要求</li>
            <li>保护本服务合法权益</li>
            <li>紧急情况保护用户安全</li>
          </ul>
        </div>

        <h2 class="text-xl font-bold text-china-brown mt-6 mb-3">四、信息安全</h2>
        <div class="space-y-2 text-sm">
          <p>4.1 我们采用加密技术保护用户数据安全。</p>
          <p>4.2 用户密码使用不可逆加密算法存储。</p>
          <p>4.3 我们定期审查数据安全措施。</p>
        </div>

        <h2 class="text-xl font-bold text-china-brown mt-6 mb-3">五、用户权利</h2>
        <div class="space-y-2 text-sm">
          <p>5.1 您有权查看您的个人数据。</p>
          <p>5.2 您有权删除您的账户和个人数据。</p>
          <p>5.3 您有权联系我们就隐私问题提出疑问。</p>
        </div>

        <h2 class="text-xl font-bold text-china-brown mt-6 mb-3">六、Cookie 使用</h2>
        <div class="space-y-2 text-sm">
          <p>6.1 本服务使用 Cookie 维持用户登录状态。</p>
          <p>6.2 Cookie 仅用于服务功能，不用于跟踪用户行为。</p>
        </div>

        <h2 class="text-xl font-bold text-china-brown mt-6 mb-3">七、联系我们</h2>
        <div class="space-y-2 text-sm">
          <p>如您对本隐私政策有任何疑问，请通过以下方式联系我们。</p>
        </div>

        <div class="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
          <p class="text-center">最后更新日期：2026年3月26日</p>
          <p class="text-center mt-2">
            <router-link to="/" class="text-china-red hover:underline">返回首页</router-link>
            <span class="mx-2">|</span>
            <router-link to="/terms" class="text-china-red hover:underline">服务条款</router-link>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
