# 数据库使用指南

## 🚀 快速启动

### 方式一：增强版一键启动脚本 (强烈推荐)
**新版本特性：自动初始化、智能检查、性能监控**

```bash
# Windows PowerShell 中使用 Git Bash
& "D:\Git\bin\bash.exe" start_database.sh

# 或者在 WSL/Linux 中
./start_database.sh
```

**v3.0 增强版功能：**
- ✅ 自动检测并执行数据库初始化
- ✅ MySQL + Redis 双服务智能启动
- ✅ 智能镜像检查（支持现有镜像复用）
- ✅ 智能健康检查（MySQL + Redis多层级验证）
- ✅ 性能监控（双容器CPU、内存、IO统计）
- ✅ 详细日志记录（自动生成日志文件）
- ✅ 快速功能测试验证（数据库 + 缓存）
- ✅ Redis缓存支持（短信验证码存储）
- ✅ 完整的错误处理和恢复机制
- ✅ 跨平台兼容性（Windows/Linux/macOS）
- ✅ 健壮的错误处理（非关键错误不会中断流程）

### 方式二：数据库管理工具 (新增)
**功能齐全的数据库管理界面**

```bash
# 启动数据库管理工具
& "D:\Git\bin\bash.exe" database_manager.sh
```

**管理工具功能：**
- 📊 实时状态监控（MySQL + Redis）
- 💾 数据库备份/恢复
- 📋 数据统计分析
- 🔧 数据库维护优化
- 📝 日志查看（MySQL + Redis）
- 🧪 功能测试（数据库 + 缓存连接测试）
- 🗑️ 清理和重置
- 🔄 强制重新初始化数据库
- 🔴 Redis缓存状态监控
- ⚡ Redis性能统计

### 方式三：传统 Docker Compose
```bash
# 启动MySQL服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs mysql

# 停止服务
docker-compose down
```

### 方式四：使用本地MySQL
如果你有本地安装的MySQL 8.0：
```bash
# 直接执行脚本
mysql -u root -p < database_setup.sql
```

## 📋 配置信息

### MySQL 数据库
| 配置项 | 值 |
|--------|-----|
| 数据库名 | `internship_db` |
| 用户名 | `internship_user` |
| 密码 | `internship_pass` |
| Root密码 | `123456` |
| 端口 | `3306` |
| 字符集 | `utf8mb4` |

### Redis 缓存
| 配置项 | 值 |
|--------|-----|
| 地址 | `localhost` |
| 端口 | `6379` |
| 密码 | 无密码 |
| 数据库 | `1` (短信验证码) |

## 🔗 连接配置

### MySQL 连接

#### JDBC URL
```
jdbc:mysql://localhost:3306/internship_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
```

#### 命令行连接
```bash
# 使用项目用户
mysql -h localhost -P 3306 -u internship_user -pinternship_pass internship_db

# 使用root用户
mysql -h localhost -P 3306 -u root -p123456

# 使用Docker容器内连接
docker exec -it mysql-internship mysql -u internship_user -pinternship_pass internship_db
```

### Redis 连接

#### 命令行连接
```bash
# 连接Redis（无密码）
redis-cli -h localhost -p 6379

# 使用Docker容器内连接
docker exec -it redis-internship redis-cli

# 选择验证码数据库
redis-cli -h localhost -p 6379 -n 1

# 测试连接
redis-cli ping
```

#### 常用Redis命令
```bash
# 查看所有键
KEYS *

# 查看验证码键（短信验证码通常以phone开头）
KEYS phone:*

# 获取验证码
GET phone:13800138001

# 查看键的过期时间
TTL phone:13800138001

# 清空当前数据库
FLUSHDB

# 查看Redis信息
INFO memory
```

## 📊 数据库表结构

### 核心业务表
1. **user** - 用户表
   - 多角色用户管理（学生、机构、专家、管理员）
   - 积分余额管理
   - 支持短信验证码登录

2. **point_rule** - 积分规则表
   - 存储各种积分获取规则
   - 包含审核流程和有效期管理

3. **conversion_rule** - 转换规则表
   - 定义积分、学分、证书之间的转换规则
   - 支持转换条件和审核要求

4. **institution** - 机构表
   - 管理教育机构信息
   - 包含认证等级和联系信息

5. **expert** - 专家表
   - 专家信息和资质管理

### 积分商城表
6. **product** - 商品表
   - 积分商城商品管理
   - 库存和状态管理

7. **product_order** - 订单表
   - 用户积分兑换订单
   - 完整的订单流程管理

8. **point_transaction** - 积分流水表
   - 记录所有积分变动
   - 支持积分获得、消费、过期

### 课程学习表
9. **project** - 项目/课程表
   - 在线课程管理
   - 支持视频课程和观看记录

10. **project_watch_record** - 观看记录表
    - 课程观看进度跟踪
    - 积分奖励管理

### 认证相关表
11. **certification_standard** - 认证标准表
12. **certificate_application** - 证书申请表
13. **user_certificate** - 用户证书表
14. **certificate_review_record** - 证书审核记录表

## 🔴 Redis 缓存系统

### Redis 在项目中的应用
Redis主要用于以下缓存场景：

1. **短信验证码存储**
   - 数据库：1
   - Key格式：`phone:{手机号}`
   - 过期时间：5分钟（300秒）
   - 示例：`phone:13800138001` -> `123456`

2. **用户会话缓存**（预留）
   - 数据库：0
   - 用于存储用户登录状态和临时数据

3. **API限流缓存**（预留）
   - 数据库：2
   - 用于接口调用频率限制

### Redis 数据库分配
| 数据库 | 用途 | 说明 |
|--------|------|------|
| DB 0 | 默认数据库 | 用户会话、临时数据 |
| DB 1 | 短信验证码 | 手机验证码存储，5分钟过期 |
| DB 2 | API限流 | 接口调用频率控制 |

### 验证码机制
```java
// 验证码生成流程
1. 用户输入手机号
2. 系统生成6位随机数字验证码
3. 存储到Redis: SET phone:{手机号} {验证码} EX 300
4. 发送短信给用户
5. 用户输入验证码验证: GET phone:{手机号}
6. 验证成功后删除验证码: DEL phone:{手机号}
```

## 🧪 测试数据

### 测试用户账户
| 用户名 | 密码 | 角色 | 手机号 | 积分 |
|--------|------|------|--------|------|
| student01 | password123 | 学生 | 13800138001 | 150 |
| org01 | password123 | 机构 | 13800138002 | 280 |
| expert01 | password123 | 专家 | 13800138003 | 500 |
| student02 | password123 | 学生 | 13800138004 | 75 |
| org02 | password123 | 机构 | 13800138005 | 320 |

### 测试机构
- 北京大学
- 清华大学  
- 北京职业技术学院
- 在线教育科技有限公司

### 测试商品
- 高级学习笔记本 (500积分)
- Python编程入门课程 (2000积分)
- 便携式电子词典 (1500积分)
- 职业规划咨询课程 (3000积分)

## ✅ 验证安装

### 自动验证（推荐）
```bash
# 运行增强版启动脚本会自动验证
./start_database.sh
```

### 手动验证
```sql
-- 检查表结构
USE internship_db;
SHOW TABLES;

-- 查看数据统计
SELECT 'user' as table_name, COUNT(*) as count FROM user
UNION ALL
SELECT 'institution' as table_name, COUNT(*) as count FROM institution
UNION ALL
SELECT 'product' as table_name, COUNT(*) as count FROM product
UNION ALL
SELECT 'point_rule' as table_name, COUNT(*) as count FROM point_rule;

-- 检查测试用户
SELECT username, full_name, role, phone, points_balance FROM user LIMIT 5;
```

## 🔧 常见操作

### 备份数据库
```bash
# 使用管理工具备份（推荐）
./database_manager.sh  # 选择选项 2

# 手动备份
docker exec mysql-internship mysqldump -u root -p123456 internship_db > backup.sql

# 带时间戳的备份
docker exec mysql-internship mysqldump -u root -p123456 internship_db > "backup_$(date +%Y%m%d_%H%M%S).sql"
```

### 恢复数据库
```bash
# 使用管理工具恢复（推荐）
./database_manager.sh  # 选择选项 3

# 手动恢复
cat backup.sql | docker exec -i mysql-internship mysql -u root -p123456 internship_db
```

### 重置数据库
```bash
# 完全重置（删除所有数据）
docker-compose down -v
./start_database.sh

# 或使用管理工具
./database_manager.sh  # 选择选项 8
```

### 监控性能
```bash
# 使用管理工具监控（推荐）
./database_manager.sh  # 选择选项 1

# 手动监控MySQL
docker stats mysql-internship

# 手动监控Redis
docker stats redis-internship

# 同时监控两个容器
docker stats mysql-internship redis-internship
```

### Redis 缓存操作
```bash
# 查看Redis状态
docker exec redis-internship redis-cli ping

# 查看Redis信息
docker exec redis-internship redis-cli info

# 查看内存使用
docker exec redis-internship redis-cli info memory

# 查看验证码数据（选择数据库1）
docker exec redis-internship redis-cli -n 1 keys "*"

# 手动设置验证码（测试用）
docker exec redis-internship redis-cli -n 1 set "phone:13800138001" "123456" EX 300

# 获取验证码
docker exec redis-internship redis-cli -n 1 get "phone:13800138001"

# 清空验证码数据库
docker exec redis-internship redis-cli -n 1 flushdb
```

## 🚨 故障排除

### MySQL 连接失败
```bash
# 检查MySQL容器状态
docker ps | grep mysql-internship

# 检查端口占用
netstat -tuln | grep 3306

# 重启MySQL容器
docker restart mysql-internship

# 查看MySQL详细日志
docker logs mysql-internship --tail 50
```

### Redis 连接失败
```bash
# 检查Redis容器状态
docker ps | grep redis-internship

# 检查Redis端口占用
netstat -tuln | grep 6379

# 重启Redis容器
docker restart redis-internship

# 查看Redis详细日志
docker logs redis-internship --tail 50

# 测试Redis连接
docker exec redis-internship redis-cli ping
```

### 应用连接Redis失败
```bash
# 检查应用日志中的Redis错误
# 常见错误：Unable to connect to Redis

# 确认Redis容器正在运行
docker ps | grep redis-internship

# 确认端口映射正确
docker port redis-internship

# 检查Redis配置
docker exec redis-internship redis-cli config get "*"

# 重启整个Docker服务
docker-compose restart
```

### 数据库启动失败
```bash
# 查看启动脚本日志
ls -la database_startup_*.log
cat database_startup_*.log

# 清理并重新启动
docker-compose down -v
./start_database.sh
```

### 字符编码问题
```sql
-- 检查字符集
SHOW VARIABLES LIKE 'character_set%';
SHOW VARIABLES LIKE 'collation%';

-- 数据库字符集应该是 utf8mb4
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME 
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'internship_db';
```

### 数据初始化问题
```bash
# 如果数据库启动但缺少测试数据
./database_manager.sh  # 选择选项 9 强制重新初始化

# 手动检查数据
docker exec -it mysql-internship mysql -u root -p123456 internship_db
mysql> SELECT COUNT(*) FROM user;
mysql> SELECT COUNT(*) FROM institution;

# 手动执行初始化脚本
docker cp database_setup.sql mysql-internship:/tmp/
docker exec -it mysql-internship mysql -u root -p123456 < /tmp/database_setup.sql
```

### Windows 环境问题
```bash
# 如果遇到换行符问题
wsl sed -i 's/\r$//' start_database.sh
wsl sed -i 's/\r$//' database_manager.sh

# 确保使用 Git Bash
& "D:\Git\bin\bash.exe" start_database.sh

# 如果遇到资源检查失败（非关键问题）
# 脚本会继续运行，这些警告可以忽略
```

## 🔨 数据库管理工具

### 推荐的可视化工具
- **MySQL Workbench** (官方工具)
- **Navicat Premium** (商业版)
- **DBeaver** (免费开源)
- **phpMyAdmin** (Web界面)

### 连接参数
```
Host: localhost
Port: 3306
Username: internship_user  
Password: internship_pass
Database: internship_db
```

### 命令行工具
```bash
# 项目提供的管理工具
./database_manager.sh

# Docker 内部管理
docker exec -it mysql-internship mysql -u root -p123456

# 数据库状态检查
docker exec mysql-internship mysqladmin status -u root -p123456
```

## ⚙️ 项目配置

确保你的 `application.properties` 文件配置正确：

```properties
# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/internship_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
spring.datasource.username=internship_user
spring.datasource.password=internship_pass
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Redis Configuration
spring.redis.host=localhost
spring.redis.port=6379
spring.redis.database=1
spring.redis.timeout=3000ms
spring.redis.lettuce.pool.max-active=8
spring.redis.lettuce.pool.max-idle=8
spring.redis.lettuce.pool.min-idle=0

# MyBatis Plus Configuration
mybatis-plus.mapper-locations=classpath:mapper/*.xml
mybatis-plus.configuration.map-underscore-to-camel-case=true
mybatis-plus.type-aliases-package=com.internship.entity

# Connection Pool Configuration
spring.datasource.type=com.zaxxer.hikari.HikariDataSource
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.connection-timeout=30000
```

## 📝 日志文件

### 启动脚本日志
```bash
# 日志文件格式: database_startup_YYYYMMDD_HHMMSS.log
ls -la database_startup_*.log

# 查看最新日志
tail -f database_startup_*.log
```

### Docker 容器日志
```bash
# 查看MySQL容器日志
docker logs mysql-internship

# 实时查看MySQL日志
docker logs -f mysql-internship

# 查看Redis容器日志
docker logs redis-internship

# 实时查看Redis日志
docker logs -f redis-internship

# 同时查看两个容器的日志
docker-compose logs -f mysql redis
```

## 🎯 最佳实践

1. **首次启动**：使用 `./start_database.sh` 进行自动化初始化（MySQL + Redis）
2. **日常管理**：使用 `./database_manager.sh` 进行数据库维护
3. **定期备份**：使用管理工具定期备份重要数据
4. **性能监控**：定期查看MySQL和Redis性能指标
5. **日志检查**：定期查看启动和运行日志
6. **数据验证**：启动后检查测试数据是否完整
7. **缓存监控**：定期检查Redis连接状态和内存使用
8. **验证码测试**：定期测试短信验证码功能
9. **故障恢复**：遇到数据问题时使用强制重新初始化功能
10. **服务依赖**：确保MySQL和Redis都正常运行再启动应用

## 🆘 获取帮助

```bash
# 查看管理工具帮助
./database_manager.sh  # 选择选项 10

# 查看MySQL容器详细信息
docker inspect mysql-internship

# 查看Redis容器详细信息
docker inspect redis-internship

# 查看Docker Compose服务状态
docker-compose ps

# 查看网络连接
docker network ls
docker network inspect graduation_field_work_code_internship-network
```

---

## 🎉 v3.0 Redis集成完成

### ✨ 本次更新亮点
- 🔴 **Redis缓存集成**：解决"Redis连接失败，使用内存存储验证码"问题
- 🚀 **双服务启动**：一键启动MySQL 8.0 + Redis 7.0
- 📊 **智能监控**：双容器性能监控和健康检查
- 🧪 **功能测试**：自动测试数据库和缓存连接
- 🔧 **管理增强**：管理工具支持Redis状态监控

### 🎯 解决的问题
- ✅ 短信验证码现在正确存储在Redis中
- ✅ 应用启动不再显示Redis连接失败警告
- ✅ 跨平台兼容性增强，支持Windows/Linux/macOS
- ✅ 非关键错误不再中断启动流程

💡 **提示**: 
- 首次使用建议使用增强版一键启动脚本
- 生产环境建议定期备份数据库
- 遇到问题时优先查看日志文件
- 使用数据库管理工具进行日常维护
- **新功能**：Redis缓存状态实时监控和管理 