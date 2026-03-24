# GitHub 推送与 Vercel 部署指南

## 🚀 快速开始

### 方式一：使用脚本推送（推荐）

#### Windows 用户

1. **修改脚本配置**
   打开 `deploy-github.ps1`，修改第 14-15 行：
   ```powershell
   $REPO_NAME = "你的仓库名"           # 例如：bazi-fortune
   $GITHUB_USERNAME = "你的GitHub用户名"  # 例如：zhangsan
   ```

2. **在 GitHub 创建仓库**
   - 访问 https://github.com/new
   - 仓库名：`bazi-fortune`（或你修改的名字）
   - 选择 **Private**（私有）或 **Public**（公开）
   - **不要**勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

3. **运行脚本**
   - 右键点击 `deploy-github.ps1`
   - 选择 "使用 PowerShell 运行"
   - 按照提示完成推送

#### Mac / Linux / Git Bash 用户

1. **修改脚本配置**
   打开 `deploy-github.sh`，修改第 11-12 行：
   ```bash
   REPO_NAME="你的仓库名"           # 例如：bazi-fortune
   GITHUB_USERNAME="你的GitHub用户名"  # 例如：zhangsan
   ```

2. **在 GitHub 创建仓库**
   同上

3. **运行脚本**
   ```bash
   bash deploy-github.sh
   ```

---

### 方式二：手动命令推送

```bash
# 1. 进入项目目录
cd e:\AI\EZ1

# 2. 初始化仓库（如果还没有）
git init
git branch -M main

# 3. 添加所有文件
git add .

# 4. 提交
git commit -m "feat: 命理殿堂初始版本"

# 5. 添加远程仓库（修改为你的用户名和仓库名）
git remote add origin https://github.com/你的用户名/仓库名.git

# 6. 推送
git push -u origin main --force
```

---

## 📦 在 Vercel 部署前端

### 步骤 1: Vercel 导入

1. 访问 https://vercel.com/new
2. 选择 **"Import Git Repository"**
3. 选择你的 GitHub 仓库
4. 如果看到兼容性警告，点击 **"Continue to Dashboard"**

### 步骤 2: 配置项目

- **Framework Preset**: 选择 `Vite`（如果自动识别失败）
- **Root Directory**: `./` （保持默认）
- **Build Command**: `npm run build`（已自动配置）
- **Output Directory**: `dist`（已自动配置）

### 步骤 3: 设置环境变量

点击 **"Environment Variables"**，添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_API_URL` | `你的后端API地址` | 后端服务地址 |
| `VITE_APP_TITLE` | `命理殿堂` | 应用标题 |

⚠️ **重要**: 
- `VITE_API_URL` 可以先填一个占位符，如 `https://api.example.com`
- 部署完成后需要配置真实的后端地址

### 步骤 4: 部署

点击 **"Deploy"**，等待构建完成（通常 1-3 分钟）。

---

## 🌐 在 Railway 部署后端

### 步骤 1: 创建 Railway 项目

1. 访问 https://railway.app
2. 点击 **"New Project"**
3. 选择 **"Deploy from GitHub repo"**
4. 连接你的 GitHub 账号
5. 选择 `backend` 目录（或整个仓库）

### 步骤 2: 配置环境变量

在 Railway 项目设置中，添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `PORT` | `3001` | 端口号 |
| `JWT_SECRET` | `至少32位的随机字符串` | JWT 密钥 |
| `MINIMAX_API_KEY` | `你的MiniMax API密钥` | AI服务密钥 |
| `ALLOWED_ORIGINS` | `你的Vercel域名` | 例如：`https://bazi-fortune.vercel.app` |
| `NODE_ENV` | `production` | 生产环境 |

### 步骤 3: 获取后端 URL

部署完成后，Railway 会给你一个 URL，类似：
```
https://bazi-fortune.up.railway.app
```

### 步骤 4: 更新前端环境变量

1. 回到 Vercel 项目设置
2. 修改 `VITE_API_URL` 为 Railway 给的 URL
3. 点击 **"Redeploy"** 重新部署

---

## ✅ 验证部署

### 检查前端

访问你的 Vercel URL（如 `https://bazi-fortune.vercel.app`）：

- [ ] 页面是否正常加载
- [ ] 东方美学 Logo 是否显示
- [ ] 移动端布局是否正常
- [ ] 功能卡片是否显示

### 检查后端 API

访问后端健康检查（如 `https://xxx.railway.app/api/test`）：

- [ ] 是否返回成功响应
- [ ] 是否有 CORS 错误

### 检查登录功能

- [ ] 注册新账号
- [ ] 登录账号
- [ ] 创建档案
- [ ] 八字分析

---

## 🐛 常见问题

### Q1: Git 推送失败

**错误**: `remote: Repository not found`

**解决**:
1. 确认仓库已在 GitHub 创建
2. 检查脚本中的用户名和仓库名是否正确
3. 确认 GitHub 账号有访问该仓库的权限

### Q2: Vercel 构建失败

**解决**:
1. 检查环境变量是否正确设置
2. 查看构建日志定位问题
3. 确保 `package.json` 中的 `build` 脚本正确

### Q3: 登录功能不工作

**解决**:
1. 打开浏览器开发者工具（F12）
2. 查看 Console 和 Network 标签
3. 如果有 CORS 错误，在 Railway 后端添加 `ALLOWED_ORIGINS`
4. 确保 `VITE_API_URL` 指向正确的后端地址

### Q4: 页面空白

**解决**:
1. 检查浏览器控制台是否有错误
2. 确认所有资源加载成功
3. 尝试硬刷新（Ctrl+Shift+R）

---

## 🔧 自动化部署（可选）

### GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 获取 Vercel Secrets

1. 在 Vercel Dashboard 获取 `VERCEL_TOKEN`
2. 在项目设置获取 `VERCEL_ORG_ID` 和 `VERCEL_PROJECT_ID`
3. 在 GitHub 仓库 Settings → Secrets 添加这些值

---

## 📞 获取帮助

- **Vercel 文档**: https://vercel.com/docs
- **Railway 文档**: https://docs.railway.app
- **GitHub 文档**: https://docs.github.com
- **Vue 文档**: https://vuejs.org

---

**祝部署顺利！🎉**
