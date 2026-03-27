# 京东云服务器部署脚本
# 服务器信息
$serverIP = "111.228.4.197"
$serverUser = "root"
$serverPassword = "Happy10.10"

# 应用配置
$appName = "EZ9命理殿堂"
$backendPort = 3000
$frontendPort = 3001
$domain = "111.228.4.197"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  京东云服务器部署脚本" -ForegroundColor Cyan
Write-Host "  应用：$appName" -ForegroundColor Cyan
Write-Host "  服务器：$serverIP" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 1. 创建临时目录用于存放部署包
$tempDir = "C:\temp_deploy_$([guid]::NewGuid().ToString('N'))"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
Set-Location $tempDir

# 2. 克隆最新的代码
Write-Host "[1/6] 正在克隆最新代码..." -ForegroundColor Yellow
git clone https://github.com/zhxf1209-coder/EZ9.git . 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "错误：代码克隆失败" -ForegroundColor Red
    exit 1
}

# 3. 打包代码
Write-Host "[2/6] 正在打包代码..." -ForegroundColor Yellow
$backendZip = "backend.zip"
$frontendZip = "frontend.zip"

# 创建后端压缩包
Compress-Archive -Path "backend/*" -DestinationPath $backendZip -Force

# 创建前端压缩包
Compress-Archive -Path "frontend/*" -DestinationPath $frontendZip -Force

# 4. 连接到服务器并部署
Write-Host "[3/6] 正在连接服务器..." -ForegroundColor Yellow

# 创建远程目录
$sshCmd = @"
mkdir -p /opt/EZ9/backend /opt/EZ9/frontend
"@

# 使用SSH执行命令（需要安装SSH模块）
try {
    # Windows SSH
    $null = ssh-keygen -R $serverIP 2>&1 | Out-Null
    echo $serverPassword | ssh -o StrictHostKeyChecking=no ${serverUser}@${serverIP} "mkdir -p /opt/EZ9/backend /opt/EZ9/frontend && mkdir -p /root/.ssh && chmod 700 /root/.ssh"
    
    # 复制后端文件
    Write-Host "[4/6] 正在部署后端..." -ForegroundColor Yellow
    scp $backendZip ${serverUser}@${serverIP}:/tmp/backend.zip
    ssh ${serverUser}@${serverIP} "cd /opt/EZ9/backend && unzip -o /tmp/backend.zip -d . && rm -f /tmp/backend.zip && npm install && pm2 stop 'ez9-backend' 2>/dev/null; pm2 start dist/index.js --name 'ez9-backend' && pm2 save"
    
    # 复制前端文件
    Write-Host "[5/6] 正在部署前端..." -ForegroundColor Yellow
    scp $frontendZip ${serverUser}@${serverIP}:/tmp/frontend.zip
    ssh ${serverUser}@${serverIP} "cd /opt/EZ9/frontend && unzip -o /tmp/frontend.zip -d . && rm -f /tmp/frontend.zip && npm install && npm run build"
    
    # 配置Nginx
    Write-Host "[6/6] 正在配置Nginx..." -ForegroundColor Yellow
    $nginxConfig = @"
server {
    listen ${frontendPort};
    server_name _;
    
    location / {
        root /opt/EZ9/frontend/dist;
        try_files `$uri `$uri/ /index.html;
        index index.html;
    }
    
    location /api {
        proxy_pass http://localhost:${backendPort};
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_cache_bypass `$http_upgrade;
    }
}
"@
    
    # 写入Nginx配置
    ssh ${serverUser}@${serverIP} @"
echo '$nginxConfig' > /etc/nginx/sites-available/EZ9
ln -sf /etc/nginx/sites-available/EZ9 /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx
"@
    
    # 配置防火墙
    ssh ${serverUser}@${serverIP} "ufw allow ${frontendPort}/tcp && ufw allow ${backendPort}/tcp"
    
    Write-Host ""
    Write-Host "======================================" -ForegroundColor Green
    Write-Host "  部署成功！" -ForegroundColor Green
    Write-Host "======================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "应用访问地址：" -ForegroundColor Cyan
    Write-Host "  前端：http://${domain}:${frontendPort}" -ForegroundColor White
    Write-Host "  后端API：http://${domain}:${backendPort}" -ForegroundColor White
    Write-Host ""
    Write-Host "PM2进程管理：" -ForegroundColor Cyan
    ssh ${serverUser}@${serverIP} "pm2 list"
    Write-Host ""
    
} catch {
    Write-Host "错误：部署失败 - $_" -ForegroundColor Red
    exit 1
}

# 清理临时文件
Set-Location ..
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "部署完成！" -ForegroundColor Green
