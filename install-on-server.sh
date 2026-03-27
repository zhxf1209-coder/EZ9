#!/bin/bash
# EZ9 京东云一键部署脚本
# 在服务器上以root用户运行

set -e

echo "=========================================="
echo "  EZ9 命理殿堂 - 一键部署脚本"
echo "=========================================="
echo ""

# 配置变量
APP_NAME="EZ9"
BACKEND_DIR="/opt/EZ9/backend"
FRONTEND_DIR="/opt/EZ9/frontend"
BACKEND_PORT=3000
FRONTEND_PORT=3001
SERVER_IP="111.228.4.197"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then 
    log_error "请使用root用户运行此脚本"
    echo "运行命令: sudo ./install-on-server.sh"
    exit 1
fi

# 1. 更新系统
log_info "更新系统..."
apt-get update && apt-get upgrade -y
log_success "系统更新完成"

# 2. 安装必要软件
log_info "安装必要软件..."
apt-get install -y curl wget git nginx ufw
log_success "基础软件安装完成"

# 3. 安装Node.js
log_info "安装Node.js 18.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
log_success "Node.js安装完成 (v${NODE_VERSION#v}, npm ${NPM_VERSION})"

# 4. 安装PM2
log_info "安装PM2进程管理器..."
npm install -g pm2
pm2 install pm2-logrotate
log_success "PM2安装完成"

# 5. 创建应用目录
log_info "创建应用目录..."
mkdir -p $BACKEND_DIR
mkdir -p $FRONTEND_DIR
mkdir -p /backup
log_success "目录创建完成"

# 6. 部署后端
log_info "部署后端服务..."

cd $BACKEND_DIR

# 克隆代码（如果目录为空）
if [ ! -f "package.json" ]; then
    log_info "克隆后端代码..."
    git clone https://github.com/zhxf1209-coder/EZ9.git temp
    cp -r temp/backend/* .
    rm -rf temp
fi

# 安装依赖
log_info "安装后端依赖..."
npm install

# 创建生产环境配置
log_info "创建后端配置..."
cat > .env.production << 'ENDFILE'
NODE_ENV=production
PORT=3000
JWT_SECRET=EZ9_Production_Secret_Key_2024
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Happy10.10
DB_NAME=EZ9
ENDFILE

# 复制环境配置
cp .env.production .env

# 编译TypeScript
log_info "编译TypeScript..."
npm run build

# 停止旧进程（如果存在）
pm2 stop 'ez9-backend' 2>/dev/null || true

# 启动PM2
log_info "启动后端服务..."
pm2 start dist/index.js --name 'ez9-backend'
pm2 save
pm2 startup

log_success "后端部署完成"

# 7. 部署前端
log_info "部署前端服务..."

cd $FRONTEND_DIR

# 克隆代码（如果目录为空）
if [ ! -f "package.json" ]; then
    log_info "克隆前端代码..."
    git clone https://github.com/zhxf1209-coder/EZ9.git temp
    cp -r temp/frontend/* .
    rm -rf temp
fi

# 安装依赖
log_info "安装前端依赖..."
npm install

# 打包
log_info "打包前端..."
npm run build

log_success "前端部署完成"

# 8. 配置Nginx
log_info "配置Nginx..."

cat > /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen $FRONTEND_PORT;
    server_name _;
    
    root $FRONTEND_DIR/dist;
    index index.html;
    
    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://127.0.0.1:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 启用配置
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/

# 测试并重启Nginx
nginx -t
systemctl restart nginx

log_success "Nginx配置完成"

# 9. 配置防火墙
log_info "配置防火墙..."
ufw --force enable
ufw allow $FRONTEND_PORT/tcp comment "EZ9 Frontend"
ufw allow $BACKEND_PORT/tcp comment "EZ9 Backend"
ufw allow 22/tcp comment "SSH"
ufw reload

log_success "防火墙配置完成"

# 10. 创建更新脚本
log_info "创建更新脚本..."

cat > /opt/EZ9/update.sh << 'UPDATESCRIPT'
#!/bin/bash
echo "更新EZ9..."
cd /opt/EZ9/backend && git pull && npm install && npm run build && pm2 restart 'ez9-backend'
cd /opt/EZ9/frontend && git pull && npm install && npm run build && systemctl restart nginx
echo "更新完成！"
UPDATESCRIPT

chmod +x /opt/EZ9/update.sh

# 11. 创建备份脚本
cat > /opt/EZ9/backup.sh << 'BACKUPSCRIPT'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
echo "备份EZ9到 /backup/EZ9_\$DATE.tar.gz..."
tar -czf /backup/EZ9_\$DATE.tar.gz /opt/EZ9
echo "备份完成！"
BACKUPSCRIPT

chmod +x /opt/EZ9/backup.sh

# 12. 验证部署
log_info "验证部署..."

echo ""
echo "=========================================="
echo "  部署验证"
echo "=========================================="
echo ""

# 检查PM2
echo -n "PM2进程状态: "
if pm2 list | grep -q "ez9-backend"; then
    echo -e "${GREEN}运行中${NC}"
else
    echo -e "${RED}未运行${NC}"
fi

# 检查端口
echo -n "后端端口($BACKEND_PORT): "
if netstat -tlnp 2>/dev/null | grep -q ":$BACKEND_PORT "; then
    echo -e "${GREEN}监听中${NC}"
else
    echo -e "${RED}未监听${NC}"
fi

echo -n "前端端口($FRONTEND_PORT): "
if netstat -tlnp 2>/dev/null | grep -q ":$FRONTEND_PORT "; then
    echo -e "${GREEN}监听中${NC}"
else
    echo -e "${RED}未监听${NC}"
fi

# 检查Nginx
echo -n "Nginx状态: "
if systemctl is-active nginx | grep -q "active"; then
    echo -e "${GREEN}运行中${NC}"
else
    echo -e "${RED}未运行${NC}"
fi

# 测试API
echo -n "API健康检查: "
if curl -s http://localhost:$BACKEND_PORT/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}正常${NC}"
else
    echo -e "${YELLOW}未响应${NC}"
fi

# 测试前端
echo -n "前端访问: "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$FRONTEND_PORT)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}正常 (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}HTTP $HTTP_CODE${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}  部署完成！${NC}"
echo "=========================================="
echo ""
echo "访问地址："
echo -e "  前端: ${BLUE}http://$SERVER_IP:$FRONTEND_PORT${NC}"
echo -e "  后端: ${BLUE}http://$SERVER_IP:$BACKEND_PORT${NC}"
echo ""
echo "管理命令："
echo "  更新代码: /opt/EZ9/update.sh"
echo "  备份数据: /opt/EZ9/backup.sh"
echo "  查看日志: pm2 logs ez9-backend"
echo "  重启服务: pm2 restart ez9-backend && systemctl restart nginx"
echo ""
echo "常用端口："
echo "  前端: $FRONTEND_PORT"
echo "  后端API: $BACKEND_PORT"
echo "  SSH: 22"
echo ""
echo "防火墙状态："
ufw status numbered
echo ""
echo "=========================================="
echo -e "${GREEN}感谢使用EZ9命理殿堂！${NC}"
echo "=========================================="
