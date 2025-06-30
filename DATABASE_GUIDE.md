# 数据库使用指南

## 快速启动

### 方式一：一键启动脚本 (推荐)
这是最简单、最可靠的方式，会自动处理所有步骤。

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

### 方式二：使用Docker Compose
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

### 方式三：使用本地MySQL
如果你有本地安装的MySQL 8.0：
```bash
# 直接执行脚本
mysql -u root -p < database_setup.sql
```

## 配置信息

| 配置项 | 值 |
|--------|-----|
| 数据库名 | `internship_db` |
| 用户名 | `internship_user` |
| 密码 | `internship_pass` |
| Root密码 | `123456` |
| 端口 | `3306` |
| 字符集 | `utf8mb4` |

## 连接配置

### JDBC URL
```
jdbc:mysql://localhost:3306/internship_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
```

### 命令行连接
```bash
# 使用项目用户
mysql -h localhost -P 3306 -u internship_user -pinternship_pass internship_db

# 使用root用户
mysql -h localhost -P 3306 -u root -p123456
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

4. **user** - 用户表
   - 存储用户基本信息和认证数据

5. **expert** - 专家表
   - 专家信息和资质管理

### 初始数据
脚本会自动插入以下测试数据：
- **机构**: 北京大学、清华大学、中国人民大学、职业技能培训中心
- **积分规则**: 在线课程、学术讲座、论文发表、社区服务、技能认证
- **转换规则**: 积分学分互转、证书积分转换

## 验证安装

```sql
-- 检查表结构
USE internship_db;
SHOW TABLES;

-- 查看数据统计
SELECT 'point_rule' as table_name, COUNT(*) as count FROM point_rule
UNION ALL
SELECT 'institution' as table_name, COUNT(*) as count FROM institution;
```

## 常见操作

### 备份数据库
```bash
docker exec mysql-internship mysqldump -u root -p123456 internship_db > backup.sql
```

### 恢复数据库
```bash
cat backup.sql | docker exec -i mysql-internship mysql -u root -p123456 internship_db
```

### 重置数据库
```bash
# 停止并删除容器和数据
docker-compose down -v

# 重新启动
./start_database.sh
```

## 故障排除

### 连接失败
```bash
# 检查容器状态
docker ps | grep mysql-internship

# 检查端口占用
lsof -i :3306

# 重启容器
docker restart mysql-internship
```

### 字符编码问题
```sql
-- 检查字符集
SHOW VARIABLES LIKE 'character_set%';

-- 运行修复脚本 (如果需要)
SOURCE fix_encoding.sql;
```

## 数据库管理工具

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

## 项目配置

确保你的 `application.properties` 文件配置正确：

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/internship_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
spring.datasource.username=internship_user
spring.datasource.password=internship_pass
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# MyBatis Plus Configuration
mybatis-plus.mapper-locations=classpath:mapper/*.xml
mybatis-plus.configuration.map-underscore-to-camel-case=true
```

---

💡 **提示**: 首次使用建议使用一键启动脚本，它会自动处理所有配置 