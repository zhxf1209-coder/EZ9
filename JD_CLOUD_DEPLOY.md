# 京东云服务器部署指南

## 服务器信息
- **IP地址**：111.228.4.197
- **用户名**：root
- **密码**：Happy10.10

## 部署步骤

### 方式1：使用自动化脚本
运行 PowerShell 脚本：
```powershell
.\jdcloud-deploy.ps1
```

### 方式2：手动部署（推荐新手）

#### 步骤1：连接到服务器
在本地PowerShell或终端执行：
```bash
ssh root@111.228.4.197
# 输入密码：Happy10.10
```

#### 步骤2：在服务器上安装必要软件
```bash
# 安装Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 安装PM2进程管理器
npm install -g pm2

# 安装Nginx
apt-get install -y nginx

# 安装Git
apt-get install -y git

# 验证安装
node -v
npm -v
pm2 -v
nginx -v
```

#### 步骤3：创建应用目录
```bash
mkdir -p /opt/EZ9/backend
mkdir -p /opt/EZ9/frontend
```

#### 步骤4：克隆代码
```bash
cd /opt/EZ9

# 克隆后端
git clone https://github.com/zhxf1209-coder/EZ9.git backend_temp
cp -r backend_temp/backend/* backend/
rm -rf backend_temp

# 克隆前端
git clone https://github.com/zhxf1209-coder/EZ9.git frontend_temp
cp -r frontend_temp/frontend/* frontend/
rm -rf frontend_temp
```

#### 步骤5：部署后端
```bash
cd /opt/EZ9/backend
npm install

# 创建生产环境配置
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3000
JWT_SECRET=your_secret_key_change_this
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=EZ9
EOF

# 编译TypeScript
npx tsc

# 启动PM2
pm2 stop 'ez9-backend' 2>/dev/null
pm2 start dist/index.js --name 'ez9-backend'
pm2 save
pm2 startup
```

#### 步骤6：部署前端
```bash
cd /opt/EZ9/frontend

# 安装依赖
npm install

# 修改API配置
# 编辑 src/api/index.ts，将 baseURL 改为：
# baseURL: 'http://111.228.4.197:3000/api'

# 编译打包
npm run build
```

#### 步骤7：配置Nginx
```bash
# 创建Nginx配置文件
cat > /etc/nginx/sites-available/EZ9 << 'EOF'
server {
    listen 3001;
    server_name _;
    
    root /opt/EZ9/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 禁用默认站点
rm -f /etc/nginx/sites-enabled/default

# 启用新站点
ln -sf /etc/nginx/sites-available/EZ9 /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重启Nginx
systemctl restart nginx
```

#### 步骤8：配置防火墙
```bash
# 开放端口
ufw allow 3001/tcp  # 前端
ufw allow 3000/tcp  # 后端API

# 如果使用80端口（可选）
ufw allow 80/tcp

# 查看防火墙状态
ufw status
```

#### 步骤9：配置HTTPS（可选，但推荐）
```bash
# 安装Certbot
apt-get install -y certbot python3-certbot-nginx

# 获取SSL证书
certbot --nginx -d yourdomain.com

# 自动续期
certbot renew --dry-run
```

#### 步骤10：验证部署
```bash
# 检查PM2进程
pm2 list
pm2 logs 'ez9-backend' --lines 50

# 检查Nginx状态
systemctl status nginx
nginx -t

# 测试API
curl http://localhost:3000/api/health

# 测试前端
curl http://localhost:3001
```

## 常用管理命令

### 后端管理
```bash
# 查看日志
pm2 logs 'ez9-backend'

# 重启服务
pm2 restart 'ez9-backend'

# 停止服务
pm2 stop 'ez9-backend'

# 监控资源
pm2 monit
```

### 前端/Nginx管理
```bash
# 重启Nginx
systemctl restart nginx

# 查看Nginx日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 重新加载配置
nginx -s reload
```

### 更新代码
```bash
# 进入目录
cd /opt/EZ9/backend
cd /opt/EZ9/frontend

# 拉取最新代码
git pull

# 重新部署
cd /opt/EZ9/backend && npm install && npm run build && pm2 restart 'ez9-backend'
cd /opt/EZ9/frontend && npm install && npm run build && systemctl restart nginx
```

## 访问地址

部署完成后，访问：
- **前端应用**：http://111.228.4.197:3001
- **API接口**：http://111.228.4.197:3000

## 故障排查

### 后端无法启动
```bash
# 检查端口占用
lsof -i :3000

# 检查日志
pm2 logs 'ez9-backend' --err

# 手动运行测试
node dist/index.js
```

### 前端无法访问
```bash
# 检查Nginx状态
systemctl status nginx

# 检查配置文件
nginx -t

# 检查端口监听
netstat -tlnp | grep 3001
```

### 数据库连接问题
```bash
# 检查MySQL
systemctl status mysql

# 测试连接
mysql -u root -p

# 查看数据库
SHOW DATABASES;
```

## 安全建议

1. **修改默认密码**：立即修改服务器root密码和数据库密码
2. **配置SSH密钥**：禁用密码登录，使用SSH密钥
3. **安装防火墙**：配置UFW只开放必要端口
4. **启用SSL**：为域名配置HTTPS证书
5. **定期更新**：保持系统和依赖包最新
6. **监控日志**：定期检查系统和应用日志

## 备份建议

```bash
# 备份数据库
mysqldump -u root -p EZ9 > /backup/EZ9_$(date +%Y%m%d).sql

# 备份应用代码
tar -czf /backup/EZ9_app_$(date +%Y%m%d).tar.gz /opt/EZ9

# 设置定时备份
crontab -e
# 添加：0 2 * * * /opt/scripts/backup.sh
```
