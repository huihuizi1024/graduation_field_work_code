# 毕业实习项目

## 项目描述

这是我的毕业实习项目，基于Spring Boot框架开发的终身学习学分银行平台积分管理系统。

## 技术栈

### 开发语言
- Java 17
- JavaScript

### 框架及中间件
- Spring Boot 3.2.1
- Redis 
- Nginx
- Apache Kafka
- Apache Spark

### 数据库
- MySQL 8.0
- Oracle 11g
- SQL Server 2012

### 配置管理系统
- Git
- SVN

### 集成开发环境
- IntelliJ IDEA 2024
- Eclipse 2024
- HBuilderX 4.0+
- JetBrains PyCharm 2024

### 工具
- VS Code 2024
- PowerDesigner 16.7+
- Microsoft Project 2024
- LoadRunner Professional 2024
- ALM (Quality Center) 16.0+
- SQLyog 13.0+ / Navicat 17.0+

### 部署环境
- Linux
- Windows  
- Docker

## 项目结构

```
src/
├── main/
│   ├── java/
│   │   └── com/internship/
│   │       ├── Application.java          # 主启动类
│   │       ├── controller/               # 控制器层
│   │       │   ├── PointRuleController.java      # 积分规则管理
│   │       │   ├── ConversionRuleController.java # 转换规则管理
│   │       │   └── InstitutionController.java    # 机构管理
│   │       ├── service/                  # 服务层
│   │       ├── repository/               # 数据访问层
│   │       ├── entity/                   # 实体类
│   │       │   ├── PointRule.java        # 积分规则实体
│   │       │   ├── ConversionRule.java   # 转换规则实体
│   │       │   └── Institution.java     # 机构实体
│   │       ├── dto/                      # 数据传输对象
│   │       │   ├── ApiResponse.java      # 统一响应类
│   │       │   └── PageResponse.java     # 分页响应类
│   │       ├── config/                   # 配置类
│   │       └── utils/                    # 工具类
│   └── resources/
│       └── application.properties        # 应用配置文件
└── test/
    └── java/
```

## 文档导航

📖 **详细文档链接**
- **[API接口文档](./API.md)** - 32个REST API接口详细说明
- **[项目测试文档](./TESTING.md)** - 完整的测试指南和自动化脚本

## 运行说明

```bash
# 编译项目
mvn compile

# 运行项目
mvn spring-boot:run

# 打包项目
mvn package

# Docker构建
mvn dockerfile:build
```

## 开发环境配置

### 1. Docker安装配置

#### macOS安装Docker Desktop

1. **下载Docker Desktop**
   - 访问：https://www.docker.com/products/docker-desktop
   - 点击 "Download for Mac"
   - 根据芯片类型选择：
     - Apple Silicon (M1/M2/M3): "Mac with Apple Chip"
     - Intel: "Mac with Intel Chip"

2. **安装步骤**
   - 打开下载的.dmg文件
   - 拖拽Docker到Applications文件夹
   - 从Applications启动Docker Desktop
   - 同意许可协议并等待启动完成

3. **验证安装**
   ```bash
   docker --version
   ```

#### Windows安装Docker Desktop

1. **下载安装包**
   - 访问：https://www.docker.com/products/docker-desktop
   - 下载Windows版本

2. **安装要求**
   - Windows 10 Pro/Enterprise/Education (Build 16299+)
   - 或 Windows 11
   - 启用Hyper-V和容器功能

3. **验证安装**
   ```cmd
   docker --version
   ```

### 2. MySQL数据库配置

#### 方法一：Docker Desktop图形界面（推荐）

1. **搜索MySQL镜像**
   - 打开Docker Desktop
   - 点击"Images"（镜像）选项卡
   - 搜索"mysql"
   - 选择官方MySQL镜像
   - 下载MySQL 8.0版本

2. **创建MySQL容器**
   - 转到"Containers"（容器）选项卡
   - 点击"Run"创建新容器
   - 选择MySQL镜像

3. **容器配置参数**
   ```
   容器名称：mysql-internship
   端口映射：3306:3306
   
   环境变量：
   MYSQL_ROOT_PASSWORD=123456
   MYSQL_DATABASE=internship_db
   MYSQL_CHARACTER_SET_SERVER=utf8mb4
   MYSQL_COLLATION_SERVER=utf8mb4_unicode_ci
   ```

4. **启动容器**
   - 检查配置并点击"Run"
   - 等待容器状态变为绿色Running

#### 方法二：命令行创建（快速）

```bash
# 创建MySQL容器
docker run -d \
  --name mysql-internship \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=internship_db \
  -e MYSQL_CHARACTER_SET_SERVER=utf8mb4 \
  -e MYSQL_COLLATION_SERVER=utf8mb4_unicode_ci \
  mysql:8.0

# 验证容器运行状态
docker ps

# 连接到MySQL容器
docker exec -it mysql-internship mysql -u root -p
```

#### 方法三：Docker Compose配置

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: mysql-internship
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: internship_db
      MYSQL_CHARACTER_SET_SERVER: utf8mb4
      MYSQL_COLLATION_SERVER: utf8mb4_unicode_ci
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

volumes:
  mysql_data:
```

启动命令：
```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs mysql
```

### 3. 数据库连接配置

在 `application.properties` 中配置数据库连接：

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/internship_db?useUnicode=true&characterEncoding=utf8mb4&useSSL=false&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

### 4. 数据库管理工具

推荐使用以下工具管理MySQL数据库：

- **MySQL Workbench**（官方工具）
- **Navicat Premium**（商业版）
- **DBeaver**（免费开源）
- **phpMyAdmin**（Web界面）

连接参数：
```
主机：localhost
端口：3306
用户名：root
密码：123456
数据库：internship_db
```

### 5. 开发环境验证

1. **验证Docker运行**
   ```bash
   docker ps
   ```

2. **验证MySQL连接**
   ```bash
   docker exec -it mysql-internship mysql -u root -p123456 -e "SHOW DATABASES;"
   ```

3. **验证项目启动**
   ```bash
   mvn spring-boot:run
   ```

4. **验证API文档**
   - 访问：http://localhost:8080/swagger-ui/index.html

## 快速开始测试

### 验证项目启动
```bash
# 检查Docker和MySQL容器
docker ps | grep mysql-internship

# 启动应用
mvn spring-boot:run

# 验证API文档
curl http://localhost:8080/swagger-ui/index.html

# 快速API测试
curl -X POST http://localhost:8080/api/point-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"测试规则","ruleCode":"TEST001","pointType":1,"points":100}'
```

🧪 **完整测试指南**：详细的测试步骤、故障排除和自动化脚本请查看 [TESTING.md](./TESTING.md)

## 环境要求

- JDK 17+
- Maven 3.6+
- Docker Desktop
- MySQL 8.0+ (通过Docker容器)
- Redis 6.0+
- Apache Kafka 2.8+

## 开发计划

- [x] 项目初始化，Maven基础框架搭建
- [x] Spring Boot核心依赖配置
- [x] 数据库多数据源配置
- [x] Redis缓存配置
- [x] Kafka消息队列配置
- [x] 核心实体类设计
- [x] 统一响应类和分页类
- [x] 积分规则管理API接口定义
- [x] 转换规则管理API接口定义
- [x] 机构管理API接口定义
- [x] Swagger API文档配置
- [ ] 认证标准管理API接口
- [ ] 业务流程管理API接口
- [ ] 平台活动管理API接口
- [ ] 交易管理API接口
- [ ] 项目管理API接口
- [ ] 专家管理API接口
- [ ] 管理用户管理API接口
- [ ] Service层业务逻辑实现
- [ ] Repository层数据访问实现
- [ ] 系统监控和日志
- [ ] 单元测试和集成测试
- [ ] Docker部署配置

## API文档访问

启动项目后，可以通过以下地址访问API文档：
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## 版本记录

* **v1.1.0** (2025.6.22): 完成核心实体类设计、统一响应类和所有API接口定义，文档分离优化
* **v1.0.0** (2025.6.22): 项目初始化，技术栈配置完成

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目仅用于学习和实习目的，遵循 MIT 许可证。

## 联系方式

- **作者**：huihuizi1024
- **GitHub**：https://github.com/huihuizi1024
- **项目地址**：https://github.com/huihuizi1024/graduation_field_work_code

---

🎓 **毕业实习项目** - 终身学习学分银行平台积分管理系统 v1.1.0 