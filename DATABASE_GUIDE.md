# 数据库使用指南

## 概述

本指南将帮助你为终身学习学分银行平台积分管理系统创建和配置MySQL 8.0数据库。

## 文件说明

- `database_setup.sql` - 完整的数据库创建脚本
- `docker-compose.yml` - Docker Compose配置文件
- `start_database.sh` - **一键启动脚本 (推荐使用)**
- `DATABASE_GUIDE.md` - 本使用指南

## 数据库配置信息

- **数据库名称**: `internship_db`
- **用户名**: `internship_user`
- **密码**: `internship_pass`
- **Root密码**: `123456`
- **端口**: `3306`
- **字符集**: `utf8mb4`

## 方式一：使用一键启动脚本（强烈推荐）

这是最简单、最可靠的方式，它会自动处理所有步骤。

### 1. 启动MySQL容器
```bash
# 添加执行权限 (仅首次需要)
chmod +x start_database.sh

# 启动并初始化数据库
./start_database.sh
```
该脚本会完成以下工作：
- 检查Docker环境
- 停止旧容器（如果存在）
- 启动新容器
- 执行数据库初始化脚本
- 进行健康检查，确保服务可用

### 2. 停止服务
```bash
# 停止服务并保留数据
docker-compose down

# 停止并删除所有数据（用于完全重置）
docker-compose down -v
```

## 方式二：使用Docker Compose

如果你想手动控制流程，可以使用 `docker-compose`。

### 1. 启动MySQL容器
```bash
# 启动MySQL服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs mysql
```

### 2. 验证数据库

```bash
# 连接到MySQL容器
docker exec -it mysql-internship mysql -u root -p123456

# 或使用项目用户连接
docker exec -it mysql-internship mysql -u internship_user -pinternship_pass internship_db
```

### 3. 停止服务

```bash
# 停止服务
docker-compose down

# 停止并删除数据卷（注意：这会删除所有数据）
docker-compose down -v
```

## 方式三：手动执行SQL脚本

### 1. 启动MySQL容器（不使用初始化脚本）

```bash
docker run -d \
  --name mysql-internship \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  mysql:8.0
```

### 2. 执行数据库脚本

```bash
# 复制脚本到容器
docker cp database_setup.sql mysql-internship:/tmp/

# 连接并执行脚本
docker exec -it mysql-internship mysql -u root -p123456 -e "source /tmp/database_setup.sql"
```

## 方式三：使用本地MySQL

如果你有本地安装的MySQL 8.0：

```bash
# 直接执行脚本
mysql -u root -p < database_setup.sql
```

## 数据库表结构

### 主要表

1. **point_rule** - 积分规则表
   - 存储各种积分获取规则
   - 包含审核流程和有效期管理

2. **conversion_rule** - 转换规则表
   - 定义积分、学分、证书之间的转换规则
   - 支持转换条件和审核要求

3. **institution** - 机构表
   - 管理教育机构信息
   - 包含认证等级和联系信息

### 初始数据

脚本会自动插入以下测试数据：

- **机构**: 北京大学、清华大学、中国人民大学、职业技能培训中心
- **积分规则**: 在线课程、学术讲座、论文发表、社区服务、技能认证
- **转换规则**: 积分学分互转、证书积分转换

## 连接数据库

### 使用命令行

```bash
# 使用root用户
mysql -h localhost -P 3306 -u root -p123456

# 使用项目用户
mysql -h localhost -P 3306 -u internship_user -pinternship_pass internship_db
```

### 使用数据库工具

推荐使用以下数据库管理工具：

- **MySQL Workbench** (官方工具)
- **Navicat Premium** (商业版)
- **DBeaver** (免费开源)
- **phpMyAdmin** (Web界面)

连接参数：
```
Host: localhost
Port: 3306
Username: internship_user
Password: internship_pass
Database: internship_db
```

**JDBC URL (推荐完整格式):**
```
jdbc:mysql://localhost:3306/internship_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
```

## 验证安装

### 1. 检查表结构

```sql
USE internship_db;
SHOW TABLES;
DESCRIBE point_rule;
DESCRIBE conversion_rule;
DESCRIBE institution;
```

### 2. 查看数据

```sql
-- 查看数据统计
SELECT 'point_rule' as table_name, COUNT(*) as record_count FROM point_rule
UNION ALL
SELECT 'conversion_rule' as table_name, COUNT(*) as record_count FROM conversion_rule  
UNION ALL
SELECT 'institution' as table_name, COUNT(*) as record_count FROM institution;

-- 查看具体数据
SELECT * FROM institution LIMIT 5;
SELECT * FROM point_rule LIMIT 5;
SELECT * FROM conversion_rule LIMIT 5;
```

## 项目配置

确保你的 `application.properties` 文件配置正确。项目中的配置已是最新版本，通常无需修改。

```properties
# Database Configuration - MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/internship_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
spring.datasource.username=internship_user
spring.datasource.password=internship_pass
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

## 故障排除

### 常见问题

1. **连接被拒绝**
   ```bash
   # 检查容器是否运行
   docker ps | grep mysql-internship
   
   # 检查端口是否被占用
   lsof -i :3306
   ```

2. **权限问题**
   ```sql
   -- 重新授权
   GRANT ALL PRIVILEGES ON internship_db.* TO 'internship_user'@'%';
   FLUSH PRIVILEGES;
   ```

3. **字符集问题**
   ```sql
   -- 检查字符集
   SHOW VARIABLES LIKE 'character_set%';
   SHOW VARIABLES LIKE 'collation%';
   ```

### 重置数据库

如果需要重新创建数据库，最简单的方法是：
```bash
# 1. 停止并删除容器和数据
docker-compose down -v

# 2. 使用一键脚本重新启动
./start_database.sh
```

## 备份和恢复

### 备份数据库

```bash
# 备份整个数据库
docker exec mysql-internship mysqldump -u root -p123456 internship_db > backup_$(date +%Y%m%d_%H%M%S).sql

# 仅备份数据（不包含结构）
docker exec mysql-internship mysqldump -u root -p123456 --no-create-info internship_db > data_backup.sql
```

### 恢复数据库

```bash
# 恢复数据库
docker exec -i mysql-internship mysql -u root -p123456 internship_db < backup_file.sql
```

## 监控和维护

### 查看性能

```sql
-- 查看连接状态
SHOW PROCESSLIST;

-- 查看表状态
SHOW TABLE STATUS FROM internship_db;

-- 查看索引使用情况
SHOW INDEX FROM point_rule;
```

### 日志管理

```bash
# 查看MySQL日志
docker-compose logs mysql

# 实时查看日志
docker-compose logs -f mysql
```

## 安全建议

1. **更改默认密码**: 在生产环境中更改默认的root密码和用户密码
2. **限制网络访问**: 仅允许必要的IP地址访问数据库
3. **定期备份**: 建立定期备份机制
4. **监控日志**: 定期检查数据库日志以发现异常

## 下一步

数据库创建完成后，可以：

1. 启动Spring Boot应用程序
2. 访问API文档：http://localhost:8080/swagger-ui/index.html
3. 测试API接口功能
4. 查看项目的API文档 `API.md` 了解详细接口用法

---

🎓 **终身学习学分银行平台积分管理系统** - MySQL 8.0 数据库配置指南 