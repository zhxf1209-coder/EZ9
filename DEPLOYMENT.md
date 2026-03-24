# 部署指南 - Vercel 前端 + Railway 后端

本文档详细说明如何将"易经八字命理智能分析系统"部署到生产环境。

## 🏗️ 架构概览

```
┌─────────────────────────────────────────────────────────┐
│                    用户浏览器                             │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 Vercel (Frontend)                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │    Vue.js 3 + Vite + Tailwind CSS + TypeScript   │   │
│  │              静态网站 + API 代理                    │   │
│  └─────────────────────────────────────────────────┘   │
│                    localhost:3000                        │
└────────────────────────┬────────────────────────────────┘
                         │ /api/* 代理请求
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Railway (Backend)                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │    Express.js + TypeScript + SQLite              │   │
│  │    AI 服务集成 + JWT 认证                        │   │
│  └─────────────────────────────────────────────────┘   │
│                    localhost:3001                        │
└─────────────────────────────────────────────────────────┘
```

## 📦 部署清单

### 1. 前端部署 (Vercel)

#### 前置要求
- Node.js 18+
- Vercel CLI (`npm i -g vercel`)
- Vercel 账号

#### 部署步骤

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖
npm install

# 3. 本地测试
npm run dev

# 4. 构建生产版本
npm run build

# 5. 部署到 Vercel
npm run deploy:vercel
```

#### Vercel 环境变量配置

在 Vercel Dashboard 中设置以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_API_URL` | `https://your-backend-api.railway.app` | 后端 API 地址 |
| `VITE_APP_TITLE` | `命理殿堂` | 应用标题 |

#### 自定义域名配置

1. 在 Vercel Dashboard → Settings → Domains 添加自定义域名
2. 配置 DNS 记录
3. 等待 SSL 证书自动生成

---

### 2. 后端部署 (Railway)

Railway 是部署 Node.js 后端服务的理想选择，提供免费额度。

#### 前置要求
- Railway 账号 (railway.app)
- GitHub 账号

#### 部署步骤

**方式一： Railway CLI 部署**

```bash
# 1. 安装 Railway CLI
npm install -g @railway/cli

# 2. 登录
railway login

# 3. 进入后端目录
cd backend

# 4. 初始化项目
railway init

# 5. 部署
railway up
```

**方式二： GitHub 集成部署**

1. 将项目推送到 GitHub
2. 在 Railway Dashboard 创建新项目
3. 连接 GitHub 仓库
4. 选择 `backend` 目录作为根目录
5. 部署

#### Railway 环境变量配置

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `PORT` | `3001` | 端口号 |
| `JWT_SECRET` | `your-super-secret-key-min-32-chars` | JWT 密钥 |
| `MINIMAX_API_KEY` | `your-minimax-api-key` | MiniMax AI API 密钥 |
| `NODE_ENV` | `production` | 生产环境 |

#### Railway 付费计划说明

- **免费额度**: 500小时/月, $5 额度
- **付费计划**: $5/月 无限小时, 自定义域名, SSH 访问

---

## 🔧 替代部署方案

### 后端替代平台

| 平台 | 免费额度 | 特点 |
|------|---------|------|
| **Railway** ⭐ | 500小时/月 | 最简单, 支持 SQLite |
| **Render** | 750小时/月 | 需要自备数据库 |
| **Heroku** | 550小时/月 | 老牌平台, 免费版有休眠 |
| **Fly.io** | 3个共享 CPU, 160GB 流量 | 性能好 |

### 前端替代平台

| 平台 | 免费额度 | 特点 |
|------|---------|------|
| **Vercel** ⭐ | 100GB 带宽 | 最适合 Next.js/Vue |
| **Netlify** | 100GB 带宽 | 静态网站强大 |
| **Cloudflare Pages | 无限 | CDN 全球加速 |

---

## 🌐 自定义域名 + HTTPS

### Vercel 域名配置

1. **添加域名**
   ```
   Vercel Dashboard → Settings → Domains
   添加: bazi.example.com
   ```

2. **DNS 配置**
   ```
   类型: CNAME
   名称: bazi
   目标: cname.vercel-dns.com
   ```

3. **等待验证** (通常 5-10 分钟)

### Railway 域名配置

1. **设置域名**
   ```
   Railway Dashboard → 项目 → Settings → Networking
   点击 "Generate Domain" 或添加自定义域名
   ```

2. **配置 SSL** (自动)

---

## 🔒 安全配置

### 1. CORS 配置 (后端)

在 `backend/src/index.ts` 中配置生产环境 CORS：

```typescript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'https://bazi.example.com'],
  credentials: true
}))
```

### 2. 环境变量安全

```bash
# 绝对不要提交以下文件到 GitHub
backend/.env
frontend/.env.local
backend/.env.production
```

已配置 `.gitignore` 排除敏感文件。

### 3. JWT 密钥要求

```bash
# JWT 密钥至少 32 字符
# 推荐使用随机字符串
openssl rand -base64 32
```

---

## 📊 监控与日志

### Vercel Analytics

在 Vercel Dashboard 启用 Analytics 功能：
- 访问量统计
- 性能监控
- Core Web Vitals

### Railway 日志

```bash
# 实时查看日志
railway logs -f

# 查看特定部署
railway logs --deployment <id>
```

### 错误追踪

推荐集成：
- **Sentry** - 前端错误监控
- **LogRocket** - 用户会话回放

---

## 🚀 性能优化

### 1. Vercel Edge Network

Vercel 自动使用全球 Edge Network，选择最近的服务器响应用户。

### 2. 前端优化

```javascript
// vite.config.ts 中已配置
rollupOptions: {
  output: {
    manualChunks: {
      'vue-vendor': ['vue', 'vue-router', 'pinia'],
      'chart': ['echarts']
    }
  }
}
```

### 3. 后端性能

- Railway 自动扩展
- SQLite 适合中小型应用
- 考虑 PostgreSQL 升级为付费版

---

## 🔄 持续部署 (CI/CD)

### GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railwayapp/railway-action@v1
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
          args: up
        working-directory: ./backend
```

### Vercel GitHub 集成

1. 在 Vercel Dashboard 连接 GitHub 仓库
2. 设置生产分支 (main)
3. 自动部署已配置

---

## 🐛 常见问题

### Q1: API 请求失败 CORS 错误

**原因**: 后端 CORS 配置未包含前端域名

**解决**: 在 `backend/src/index.ts` 添加前端域名到 CORS 白名单

---

### Q2: Railway 部署后数据库丢失

**原因**: Railway 免费版容器可能重启

**解决**: 
1. 使用 Railway 的持久化存储 (付费功能)
2. 或升级到付费计划
3. 考虑迁移到 Supabase PostgreSQL

---

### Q3: Vercel 构建失败

**解决**:
```bash
# 清理构建缓存
rm -rf frontend/dist
rm -rf frontend/node_modules
npm install
npm run build
```

---

### Q4: 环境变量不生效

**原因**: Vercel 环境变量需要 Redeploy

**解决**: 
1. 修改环境变量后
2. 点击 "Redeploy" 按钮

---

## 📞 获取帮助

- **Vercel 文档**: https://vercel.com/docs
- **Railway 文档**: https://docs.railway.app
- **Vue 文档**: https://vuejs.org
- **Express 文档**: https://expressjs.com

---

## ✅ 部署检查清单

- [ ] Vercel 账号创建并登录
- [ ] Railway 账号创建并登录
- [ ] 前端代码推送到 GitHub
- [ ] 后端代码推送到 GitHub
- [ ] 前端部署成功
- [ ] 后端部署成功
- [ ] API URL 配置到 Vercel 环境变量
- [ ] CORS 配置正确
- [ ] 登录/注册功能测试
- [ ] 八字分析功能测试
- [ ] 良缘匹配功能测试
- [ ] SSL 证书自动生成
- [ ] 移动端响应式测试

---

**祝部署顺利！🎉**
