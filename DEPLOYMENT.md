# 部署与运维文档

## 1. 部署环境要求

### 1.1 硬件要求
- **CPU**: 2核+
- **内存**: 4GB+
- **磁盘**: 20GB+ 可用空间

### 1.2 软件要求
- **操作系统**: Linux (推荐 CentOS 7+, Ubuntu 18.04+)
- **Java**: OpenJDK 17 / Oracle JDK 17
- **Docker**: 最新稳定版
- **Docker Compose**: 最新稳定版
- **数据库**: MySQL 8.0 (可通过Docker部署)

## 2. 部署流程

### 2.1 打包应用
在项目根目录执行以下命令，将应用打包成可执行的JAR文件：
```bash
# 清理并打包
mvn clean package -DskipTests

# 打包成功后，JAR文件会生成在 target/ 目录下
# 文件名通常为：graduation_field_work_code_maven-1.1.0.jar
ls -l target/*.jar
```

### 2.2 上传文件到服务器
使用`scp`或其他文件传输工具，将以下文件上传到服务器指定目录（例如 `/app/internship`）：
- `target/graduation_field_work_code_maven-1.1.0.jar`
- `docker-compose.yml` (用于部署MySQL)
- `config/application-prod.properties` (生产环境配置文件)

```bash
# 示例：创建部署目录
ssh user@your_server "mkdir -p /app/internship/config"

# 上传JAR包
scp target/graduation_field_work_code_maven-1.1.0.jar user@your_server:/app/internship/app.jar

# 上传Docker Compose文件
scp docker-compose.yml user@your_server:/app/internship/docker-compose.yml

# 上传生产配置文件
scp src/main/resources/application.properties user@your_server:/app/internship/config/application-prod.properties
```
*注意：为了方便管理，建议将`graduation_field_work_code_maven-1.1.0.jar`重命名为`app.jar`。*

### 2.3 部署数据库
在服务器上，使用Docker Compose启动MySQL数据库：
```bash
# 进入部署目录
cd /app/internship

# 以后台模式启动MySQL服务
docker-compose up -d
```
*如果服务器上已有数据库，可以跳过此步骤，并修改配置文件指向现有数据库。*

### 2.4 配置文件管理
为不同环境（开发、测试、生产）创建不同的配置文件。

**生产环境配置文件 `application-prod.properties` 示例：**
```properties
# Server Port
server.port=8080

# Production Database Configuration
spring.datasource.url=jdbc:mysql://mysql-internship:3306/internship_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=123456 # 强烈建议使用更复杂的密码，并通过环境变量注入
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=validate # 生产环境建议使用 validate 或 none
spring.jpa.show-sql=false

# Logging Configuration
logging.level.root=INFO
logging.level.com.internship=INFO
logging.file.name=/app/internship/logs/field-work-system.log
```
*安全提示：生产环境的敏感信息（如数据库密码）不应硬编码在配置文件中。推荐使用环境变量或配置中心管理。*

## 3. 启动与管理应用

### 3.1 直接启动 (用于测试)
```bash
# 进入应用目录
cd /app/internship

# 启动应用并指定生产环境配置
java -jar app.jar --spring.config.location=classpath:/,config/application-prod.properties
```

### 3.2 使用Systemd进行服务管理 (推荐)
创建Systemd服务文件 `/etc/systemd/system/internship.service`：
```ini
[Unit]
Description=Internship Project Service
After=network.target docker.service
Requires=docker.service

[Service]
User=your_user # 推荐使用非root用户
Group=your_group
ExecStart=/usr/bin/java -jar /app/internship/app.jar --spring.config.location=classpath:/,config/application-prod.properties
SuccessExitStatus=143
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**管理服务命令：**
```bash
# 重新加载Systemd配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start internship

# 查看服务状态
sudo systemctl status internship

# 设置开机自启
sudo systemctl enable internship

# 停止服务
sudo systemctl stop internship

# 重启服务
sudo systemctl restart internship
```

## 4. 运维与监控

### 4.1 日志管理
- 应用日志位于 `/app/internship/logs/field-work-system.log` (或配置文件中指定的路径)。
- 使用 `tail` 命令实时查看日志：
  ```bash
  tail -f /app/internship/logs/field-work-system.log
  ```
- 推荐使用ELK (Elasticsearch, Logstash, Kibana) 或 Loki 等日志聚合工具进行集中管理和分析。

### 4.2 健康检查
如果项目中集成了Spring Boot Actuator，可以通过以下端点进行健康检查：
```bash
# 基础健康检查
curl http://localhost:8080/actuator/health

# 获取应用信息
curl http://localhost:8080/actuator/info
```
*需要在 `application.properties` 中暴露端点: `management.endpoints.web.exposure.include=health,info`*

### 4.3 数据库备份与恢复
#### 手动备份
```bash
# 备份internship_db数据库到backup.sql文件
docker exec mysql-internship mysqldump -u root -p123456 internship_db > backup.sql
```

#### 手动恢复
```bash
# 从backup.sql文件恢复数据库
cat backup.sql | docker exec -i mysql-internship mysql -u root -p123456 internship_db
```
*建议设置定时任务（如Cron Job）定期执行数据库备份。*

### 4.4 应用更新流程
1. **打包新版本**：`mvn clean package -DskipTests`
2. **停止旧服务**：`sudo systemctl stop internship`
3. **备份旧JAR包**：`mv /app/internship/app.jar /app/internship/app.jar.bak`
4. **上传新JAR包**：`scp new-app.jar user@your_server:/app/internship/app.jar`
5. **启动新服务**：`sudo systemctl start internship`
6. **验证服务**：`sudo systemctl status internship` 和 `curl http://localhost:8080/actuator/health`

## 5. Nginx反向代理 (可选)
为了使用域名访问、实现负载均衡和HTTPS，可以配置Nginx作为反向代理。

**Nginx配置示例 (`/etc/nginx/conf.d/internship.conf`)：**
```nginx
server {
    listen 80;
    server_name your_domain.com; # 你的域名

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**管理Nginx：**
```bash
# 测试配置是否正确
sudo nginx -t

# 重载配置
sudo nginx -s reload
``` 