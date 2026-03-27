#!/usr/bin/env bash
# 自动部署脚本

PASS="Happy10.10"
HOST="111.228.4.197"
USER="root"

# 创建 Nginx 配置文件
cat > /tmp/bazi-fortune.conf << 'CONF'
server {
    listen 80;
    server_name 111.228.4.197;
    
    root /var/www/bazi-fortune/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
CONF

# 使用 sshpass 或 expect 自动输入密码
if command -v sshpass >/dev/null 2>&1; then
    sshpass -p "$PASS" scp /tmp/bazi-fortune.conf $USER@$HOST:/tmp/
    sshpass -p "$PASS" ssh $USER@$HOST "mv /tmp/bazi-fortune.conf /etc/nginx/sites-available/ && ln -sf /etc/nginx/sites-available/bazi-fortune.conf /etc/nginx/sites-enabled/ && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl restart nginx"
elif command -v expect >/dev/null 2>&1; then
    expect <<EOF
set password "$PASS"
spawn scp /tmp/bazi-fortune.conf $USER@$HOST:/tmp/
expect "password:"
send "\$password\r"
expect eof
spawn ssh $USER@$HOST "mv /tmp/bazi-fortune.conf /etc/nginx/sites-available/ && ln -sf /etc/nginx/sites-available/bazi-fortune.conf /etc/nginx/sites-enabled/ && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl restart nginx"
expect "password:"
send "\$password\r"
expect eof
EOF
else
    echo "Please install sshpass or expect"
    exit 1
fi
