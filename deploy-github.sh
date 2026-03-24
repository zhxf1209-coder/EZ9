#!/bin/bash

# ====================
# GitHub 推送脚本 (Bash / Mac / Linux / Git Bash)
# 使用方法：bash deploy-github.sh
# ====================

# ====================
# 配置区域
# ====================
REPO_NAME="bazi-fortune"  # 修改为你的仓库名
GITHUB_USERNAME="你的GitHub用户名"  # 修改为你的 GitHub 用户名

# ====================
# 颜色定义
# ====================
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ====================
# 步骤 1: 检查 Git
# ====================
echo -e "${CYAN}[1/7] 检查 Git 安装...${NC}"
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓${NC} 已安装 ($GIT_VERSION)"
else
    echo -e "${RED}✗${NC} 未安装"
    echo -e "${YELLOW}  请先安装 Git: https://git-scm.com${NC}"
    exit 1
fi

# ====================
# 步骤 2: 检查 GitHub CLI
# ====================
echo -e "${CYAN}[2/7] 检查 GitHub CLI...${NC}"
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✓${NC} 已安装"
    if gh auth status &> /dev/null; then
        echo -e "${GREEN}      已登录 GitHub${NC}"
    else
        echo -e "${YELLOW}      正在尝试登录...${NC}"
        gh auth login
    fi
else
    echo -e "${YELLOW}✗${NC} 未安装 (将使用 HTTPS 方式)"
    echo -e "${CYAN}   提示: 安装 gh CLI 可以获得更好的体验${NC}"
    echo -e "${CYAN}   安装地址: https://cli.github.com${NC}"
fi

# ====================
# 步骤 3: 初始化 Git 仓库
# ====================
echo -e "${CYAN}[3/7] 初始化 Git 仓库...${NC}"
if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} 仓库已存在"
else
    git init
    git branch -M main
    echo -e "${GREEN}✓${NC} 仓库已初始化"
fi

# ====================
# 步骤 4: 添加文件
# ====================
echo -e "${CYAN}[4/7] 添加文件到暂存区...${NC}"
git add .
echo -e "${GREEN}✓${NC} 文件已添加"

# ====================
# 步骤 5: 提交
# ====================
echo -e "${CYAN}[5/7] 提交代码...${NC}"
COMMIT_MESSAGE="feat: 命理殿堂 - 易经八字命理智能分析系统

- 东方美学风格 UI 设计
- 响应式布局支持
- 八字命理分析功能
- 良缘匹配功能
- 历史记录管理
- 现代化组件设计"

git commit -m "$COMMIT_MESSAGE"
echo -e "${GREEN}✓${NC} 代码已提交"

# ====================
# 步骤 6: 推送到 GitHub
# ====================
echo -e "${CYAN}[6/7] 推送到 GitHub...${NC}"

REMOTE_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# 检查是否有远程仓库
if git remote -v | grep -q "origin"; then
    echo -e "${CYAN}   (远程仓库已存在)${NC}"
else
    git remote add origin $REMOTE_URL
    echo -e "${CYAN}   (已添加远程仓库)${NC}"
fi

# 推送
echo -e "${CYAN}   正在推送...${NC}"
if git push -u origin main --force; then
    echo -e "${GREEN}"
    echo "======================================"
    echo "  🎉 推送完成！"
    echo "======================================"
    echo -e "${NC}"
    echo -e "${CYAN}仓库地址: https://github.com/$GITHUB_USERNAME/$REPO_NAME${NC}"
    echo ""
    echo -e "${YELLOW}下一步操作:${NC}"
    echo -e "${CYAN}1. 访问上面的仓库地址${NC}"
    echo -e "${CYAN}2. 在 Vercel 中导入此仓库${NC}"
    echo -e "${CYAN}3. 设置环境变量 VITE_API_URL${NC}"
    echo -e "${CYAN}4. 等待自动部署完成${NC}"
    echo ""
else
    echo -e "${RED}✗${NC} 推送失败"
    echo ""
    echo -e "${YELLOW}可能的原因:${NC}"
    echo -e "${CYAN}1. 仓库不存在 (请先在 GitHub 创建仓库)${NC}"
    echo -e "${CYAN}2. 没有推送权限 (请检查 GitHub 授权)${NC}"
    echo -e "${CYAN}3. 用户名或仓库名错误${NC}"
    echo ""
    echo -e "${YELLOW}请修改脚本中的以下配置:${NC}"
    echo -e "${CYAN}  - GITHUB_USERNAME=\"你的GitHub用户名\"${NC}"
    echo -e "${CYAN}  - REPO_NAME=\"仓库名\"${NC}"
    exit 1
fi

# ====================
# 步骤 7: 完成
# ====================
echo -e "${CYAN}[7/7] 完成${NC} ${GREEN}✓${NC}"

echo -e "${CYAN}"
echo "======================================"
echo "  脚本执行完毕"
echo "======================================"
echo -e "${NC}"
