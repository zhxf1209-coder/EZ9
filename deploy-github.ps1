# ====================
# GitHub 推送脚本 (Windows PowerShell)
# 使用方法：右键点击此文件 → "使用 PowerShell 运行"
# ====================

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  命理殿堂 - GitHub 推送脚本" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# ====================
# 配置区域
# ====================
$REPO_NAME = "bazi-fortune"  # 修改为你的仓库名
$GITHUB_USERNAME = "你的GitHub用户名"  # 修改为你的 GitHub 用户名

# ====================
# 颜色定义
# ====================
$SUCCESS = "Green"
$ERROR = "Red"
$WARNING = "Yellow"
$INFO = "Cyan"

# ====================
# 函数：检查命令是否存在
# ====================
function Test-Command {
    param($command)
    $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
}

# ====================
# 步骤 1: 检查 Git
# ====================
Write-Host "[1/7] 检查 Git 安装..." -NoNewline
if (Test-Command "git") {
    $gitVersion = git --version
    Write-Host " ✓ 已安装 ($gitVersion)" -ForegroundColor $SUCCESS
} else {
    Write-Host " ✗ 未安装" -ForegroundColor $ERROR
    Write-Host "   请先安装 Git: https://git-scm.com/download/win" -ForegroundColor $WARNING
    Read-Host "按 Enter 键退出"
    exit 1
}

# ====================
# 步骤 2: 检查 GitHub CLI
# ====================
Write-Host "[2/7] 检查 GitHub CLI..." -NoNewline
if (Test-Command "gh") {
    Write-Host " ✓ 已安装" -ForegroundColor $SUCCESS
    $loggedIn = gh auth status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "      已登录 GitHub" -ForegroundColor $SUCCESS
    } else {
        Write-Host "      正在尝试登录..." -ForegroundColor $WARNING
        gh auth login
    }
} else {
    Write-Host " ✗ 未安装 (将使用 HTTPS 方式)" -ForegroundColor $WARNING
    Write-Host "   提示: 安装 gh CLI 可以获得更好的体验" -ForegroundColor $INFO
    Write-Host "   安装地址: https://cli.github.com" -ForegroundColor $INFO
}

# ====================
# 步骤 3: 初始化 Git 仓库
# ====================
Write-Host "[3/7] 初始化 Git 仓库..." -NoNewline
if (Test-Command "git") {
    if (Test-Path ".git") {
        Write-Host " ✓ 仓库已存在" -ForegroundColor $SUCCESS
    } else {
        git init
        git branch -M main
        Write-Host " ✓ 仓库已初始化" -ForegroundColor $SUCCESS
    }
}

# ====================
# 步骤 4: 添加文件
# ====================
Write-Host "[4/7] 添加文件到暂存区..." -NoNewline
git add .
Write-Host " ✓ 文件已添加" -ForegroundColor $SUCCESS

# ====================
# 步骤 5: 提交
# ====================
Write-Host "[5/7] 提交代码..." -NoNewline
$commitMessage = "feat: 命理殿堂 - 易经八字命理智能分析系统`n`n- 东方美学风格 UI 设计`n- 响应式布局支持`n- 八字命理分析功能`n- 良缘匹配功能`n- 历史记录管理`n- 现代化组件设计"
git commit -m $commitMessage
Write-Host " ✓ 代码已提交" -ForegroundColor $SUCCESS

# ====================
# 步骤 6: 推送到 GitHub
# ====================
Write-Host "[6/7] 推送到 GitHub..." -NoNewline

$remoteUrl = "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# 检查是否有远程仓库
$hasRemote = git remote -v | Select-String "origin"
if ($hasRemote) {
    Write-Host " (远程仓库已存在)" -ForegroundColor $INFO
} else {
    git remote add origin $remoteUrl
    Write-Host " (已添加远程仓库)" -ForegroundColor $INFO
}

# 推送
try {
    git push -u origin main --force
    Write-Host " ✓ 推送成功！" -ForegroundColor $SUCCESS
    
    Write-Host ""
    Write-Host "======================================" -ForegroundColor $SUCCESS
    Write-Host "  🎉 推送完成！" -ForegroundColor $SUCCESS
    Write-Host "======================================" -ForegroundColor $SUCCESS
    Write-Host ""
    Write-Host "仓库地址: https://github.com/$GITHUB_USERNAME/$REPO_NAME" -ForegroundColor $INFO
    Write-Host ""
    Write-Host "下一步操作:" -ForegroundColor $WARNING
    Write-Host "1. 访问上面的仓库地址" -ForegroundColor $INFO
    Write-Host "2. 在 Vercel 中导入此仓库" -ForegroundColor $INFO
    Write-Host "3. 设置环境变量 VITE_API_URL" -ForegroundColor $INFO
    Write-Host "4. 等待自动部署完成" -ForegroundColor $INFO
    Write-Host ""
    
} catch {
    Write-Host " ✗ 推送失败" -ForegroundColor $ERROR
    Write-Host "   错误: $_" -ForegroundColor $ERROR
    Write-Host ""
    Write-Host "可能的原因:" -ForegroundColor $WARNING
    Write-Host "1. 仓库不存在 (请先在 GitHub 创建仓库)" -ForegroundColor $INFO
    Write-Host "2. 没有推送权限 (请检查 GitHub 授权)" -ForegroundColor $INFO
    Write-Host "3. 用户名或仓库名错误" -ForegroundColor $INFO
    Write-Host ""
    Write-Host "请修改脚本中的以下配置:" -ForegroundColor $WARNING
    Write-Host "  - `$GITHUB_USERNAME = `"你的GitHub用户名`"" -ForegroundColor $INFO
    Write-Host "  - `$REPO_NAME = `"仓库名`"" -ForegroundColor $INFO
}

# ====================
# 步骤 7: 完成
# ====================
Write-Host "[7/7] 完成" -NoNewline
Write-Host " ✓" -ForegroundColor $SUCCESS

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  脚本执行完毕" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# 保持窗口开启（如果双击运行）
if ($Host.Name -eq "ConsoleHost") {
    Write-Host ""
    Read-Host "按 Enter 键退出"
}
