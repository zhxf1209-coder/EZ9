# AI易经八字测算系统

基于Vue 3 + Express的前后端分离八字命理测算系统。

## 功能特性

- 八字命理测算（人生运势K线展示）
- 今日运势分析
- 年度运势分析
- 事件测算（性格、婚姻合婚、财运、化解）
- 用户系统（登录注册、历史记录）
- 支持豆包、MiniMax等国内AI API

## 技术栈

**前端**: Vue 3 + TypeScript + Vite + TailwindCSS + ECharts + Pinia

**后端**: Node.js + Express + TypeScript + SQLite + JWT + lunar-javascript

## 快速开始

### 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd backend
npm install
```

### 启动开发服务器

```bash
# 后端 (端口3001)
cd backend
npm run dev

# 前端 (端口3000)
cd frontend
npm run dev
```

### 使用说明

1. 访问 http://localhost:3000
2. 注册账号并登录
3. 进入「设置」页面配置AI API密钥（豆包或MiniMax）
4. 开始使用各项测算功能

## 项目结构

```
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── components/  # 通用组件
│   │   ├── views/       # 页面
│   │   ├── stores/      # Pinia状态
│   │   ├── api/         # API服务
│   │   └── styles/      # 样式
│   └── ...
│
├── backend/           # 后端项目
│   ├── src/
│   │   ├── routes/      # API路由
│   │   ├── services/    # 业务服务
│   │   ├── models/      # 数据模型
│   │   ├── middleware/  # 中间件
│   │   └── prompts/     # AI提示词
│   └── ...
```
