# 部署与运维指南

## 1. 部署环境要求

### 硬件要求
- **CPU**: 2核+
- **内存**: 4GB+ 
- **磁盘**: 20GB+ 可用空间

### 软件要求
- **操作系统**: Linux (CentOS 7+, Ubuntu 18.04+)
- **Java**: OpenJDK 17 / Oracle JDK 17
- **Docker**: 最新稳定版
- **Docker Compose**: 最新稳定版

## 2. 部署流程

### 2.1 打包应用
```bash
# 清理并打包
mvn clean package -DskipTests

# 检查生成的JAR文件
ls -l target/*.jar
```

### 2.2 上传文件到服务器
将以下文件上传到服务器目录（如 `/app/internship`）：
- `target/graduation_field_work_code_maven-1.1.0.jar` → `app.jar`
- `docker-compose.yml`
- `config/application-prod.properties`

```bash
# 创建部署目录
ssh user@your_server "mkdir -p /app/internship/config"

# 上传JAR包
scp target/graduation_field_work_code_maven-1.1.0.jar user@your_server:/app/internship/app.jar

# 上传配置文件
scp docker-compose.yml user@your_server:/app/internship/
scp src/main/resources/application.properties user@your_server:/app/internship/config/application-prod.properties
```

### 2.3 部署数据库
```bash
# 进入部署目录
cd /app/internship

# 启动MySQL服务
docker-compose up -d
```

### 2.4 生产环境配置
创建 `application-prod.properties`：

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://mysql-internship:3306/internship_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD:123456}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Logging Configuration
logging.level.root=INFO
logging.level.com.internship=INFO
logging.file.name=/app/internship/logs/field-work-system.log
```

## 3. 启动与管理

### 3.1 直接启动 (测试用)
```bash
cd /app/internship
java -jar app.jar --spring.config.location=classpath:/,config/application-prod.properties
```

### 3.2 使用Systemd管理服务 (推荐)
创建服务文件 `/etc/systemd/system/internship.service`：

```ini
[Unit]
Description=Internship Project Service
After=network.target docker.service
Requires=docker.service

[Service]
User=your_user
Group=your_group
ExecStart=/usr/bin/java -jar /app/internship/app.jar --spring.config.location=classpath:/,config/application-prod.properties
SuccessExitStatus=143
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

#### 管理命令
```bash
# 重新加载配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start internship

# 查看状态
sudo systemctl status internship

# 设置开机自启
sudo systemctl enable internship

# 停止服务
sudo systemctl stop internship
```

## 4. 运维管理

### 4.1 日志管理
```bash
# 查看应用日志
tail -f /app/internship/logs/field-work-system.log

# 查看系统服务日志
journalctl -u internship -f
```

### 4.2 健康检查
```bash
# 检查应用状态
curl http://localhost:8080/actuator/health

# 检查API响应
curl http://localhost:8080/v3/api-docs
```

### 4.3 数据库备份
```bash
# 备份数据库
docker exec mysql-internship mysqldump -u root -p123456 internship_db > backup_$(date +%Y%m%d_%H%M%S).sql

# 恢复数据库
cat backup.sql | docker exec -i mysql-internship mysql -u root -p123456 internship_db
```

### 4.4 应用更新流程
```bash
# 1. 停止服务
sudo systemctl stop internship

# 2. 备份当前版本
mv /app/internship/app.jar /app/internship/app.jar.bak

# 3. 上传新版本
scp new-app.jar user@your_server:/app/internship/app.jar

# 4. 启动服务
sudo systemctl start internship

# 5. 验证服务
sudo systemctl status internship
curl http://localhost:8080/actuator/health
```

## 5. Nginx反向代理 (可选)

### 配置文件
创建 `/etc/nginx/conf.d/internship.conf`：

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 前端静态资源 (如果部署前端)
    location /static/ {
        root /app/internship/frontend/build;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 管理命令
```bash
# 测试配置
sudo nginx -t

# 重载配置
sudo nginx -s reload

# 启动/停止
sudo systemctl start nginx
sudo systemctl stop nginx
```

## 6. 前端部署 (可选)

### 6.1 构建前端
```bash
cd frontend
npm install
npm run build
```

### 6.2 部署到服务器
```bash
# 上传构建文件
scp -r frontend/build/* user@your_server:/app/internship/frontend/build/

# 或使用Nginx直接服务静态文件
```

### 6.3 Nginx配置前端
```nginx
server {
    listen 80;
    server_name your_domain.com;
    
    # 前端路由
    location / {
        root /app/internship/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # API代理
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 7. 监控与维护

### 7.1 监控脚本
创建 `monitor.sh`：

```bash
#!/bin/bash
# 应用监控脚本

APP_URL="http://localhost:8080"
LOG_FILE="/app/internship/logs/monitor.log"

# 检查应用状态
if curl -f -s $APP_URL/actuator/health > /dev/null; then
    echo "$(date): ✅ 应用正常运行" >> $LOG_FILE
else
    echo "$(date): ❌ 应用异常，尝试重启" >> $LOG_FILE
    sudo systemctl restart internship
fi

# 检查磁盘空间
DISK_USAGE=$(df /app | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "$(date): ⚠️ 磁盘使用率超过80%: ${DISK_USAGE}%" >> $LOG_FILE
fi
```

### 7.2 定时任务
```bash
# 添加到crontab
crontab -e

# 每5分钟检查应用状态
*/5 * * * * /app/internship/monitor.sh

# 每日备份数据库
0 2 * * * /app/internship/backup.sh
```

## 8. 故障排除

### 8.1 常见问题
```bash
# 应用无法启动
journalctl -u internship -n 50

# 端口被占用
lsof -i :8080
kill -9 $(lsof -t -i:8080)

# 数据库连接失败
docker logs mysql-internship
docker restart mysql-internship

# 内存不足
free -h
# 考虑增加JVM内存限制: -Xmx2g -Xms1g
```

### 8.2 性能优化
```properties
# JVM优化参数 (在systemd service文件中)
ExecStart=/usr/bin/java -Xmx2g -Xms1g -XX:+UseG1GC -jar /app/internship/app.jar

# 数据库连接池优化
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
```

## 9. 安全建议

1. **更改默认密码**: 生产环境必须更改所有默认密码
2. **防火墙配置**: 只开放必要端口 (80, 443, 22)
3. **SSL证书**: 配置HTTPS (Let's Encrypt免费证书)
4. **定期备份**: 建立自动备份策略
5. **监控告警**: 配置监控和告警机制

---

💡 **提示**: 生产环境部署建议使用容器编排工具 (如Docker Swarm或Kubernetes) 以获得更好的可靠性和可扩展性 