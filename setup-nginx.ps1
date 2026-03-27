# PowerShell 自动化部署脚本

$pass = "Happy10.10"
$host = "111.228.4.197"
$user = "root"

# Nginx 配置文件内容
$nginxConfig = @"
server {
    listen 80;
    server_name 111.228.4.197;
    
    root /var/www/bazi-fortune/frontend/dist;
    index index.html;
    
    location / {
        try_files `$uri `$uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host `$host;
        proxy_cache_bypass `$http_upgrade;
    }
}
"@

# 创建临时文件
$tempFile = "$env:TEMP\bazi-fortune.conf"
$nginxConfig | Out-File -FilePath $tempFile -Encoding UTF8

# 使用 SCP 上传文件
Write-Host "上传配置文件到服务器..."
$scpCmd = "echo $pass | scp -o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no $tempFile ${user}@${host}:/tmp/"

# 尝试使用不同的方法
try {
    # 方法1: 使用 PowerShell 的 Start-Process（需要手动交互）
    # 不推荐
    
    # 方法2: 使用 plink (PuTTY)
    if (Get-Command plink -ErrorAction SilentlyContinue) {
        Write-Host "使用 plink..."
        echo $pass | plink -ssh ${user}@${host} "mv /tmp/bazi-fortune.conf /etc/nginx/sites-available/ && ln -sf /etc/nginx/sites-available/bazi-fortune.conf /etc/nginx/sites-enabled/ && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl restart nginx"
    }
    # 方法3: 手动提示用户复制命令
    else {
        Write-Host "`n========================================="
        Write-Host "请在服务器终端手动执行以下命令："
        Write-Host "=========================================`n"
        
        $commands = @(
            "mv /tmp/bazi-fortune.conf /etc/nginx/sites-available/",
            "ln -sf /etc/nginx/sites-available/bazi-fortune.conf /etc/nginx/sites-enabled/",
            "rm -f /etc/nginx/sites-enabled/default",
            "nginx -t",
            "systemctl restart nginx"
        )
        
        $commands | ForEach-Object { Write-Host $PSItem }
        
        Write-Host "`n配置文件已准备好: $tempFile"
        Write-Host "`n你可以使用以下命令复制到服务器："
        Write-Host "echo $pass | scp $tempFile ${user}@${host}:/tmp/`n"
    }
}
catch {
    Write-Host "发生错误: $_"
}

# 清理
Remove-Item $tempFile -ErrorAction SilentlyContinue
