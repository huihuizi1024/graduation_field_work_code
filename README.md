# 毕业实习项目

## 项目描述

这是我的毕业实习项目，基于Spring Boot框架开发的终身学习学分银行平台积分管理系统。

## 技术栈

### 开发语言
- Java 17

### 框架及中间件
- Spring Boot 3.1.5
- MyBatis Plus 3.5.4.1
- Redis (通过Spring Boot管理)
- Kafka (通过Spring Boot管理)
- Apache Spark 3.5.0

### 数据库
- MySQL 8.0 (通过Docker容器)

### 配置管理系统
- Git
- SVN

### 集成开发环境
- IntelliJ IDEA 2024
- Eclipse 2024
- HBuilderX 4.0+
- JetBrains PyCharm 2024

### 工具
- Docker
- Maven 3.6+
- Git
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
│   │       ├── service/                  # 服务层
│   │       ├── mapper/                   # 数据访问层 (MyBatis Plus)
│   │       ├── entity/                   # 实体类
│   │       ├── dto/                      # 数据传输对象
│   │       ├── config/                   # 配置类
│   │       └── utils/                    # 工具类
│   └── resources/
│       ├── mapper/                   # MyBatis Mapper XML
│       └── application.properties        # 应用配置文件
└── test/
    └── java/
```

## 文档导航

📖 **详细文档链接**
- **[API接口文档](./API.md)** - 32个REST API接口详细说明
- **[数据库使用指南](./DATABASE_GUIDE.md)** - 完整的数据库构建、配置和使用手册

## 运行说明

### 1. 启动数据库 (推荐)
使用项目根目录的一键启动脚本：
```bash
# 添加执行权限 (仅首次需要)
chmod +x start_database.sh

# 启动数据库
./start_database.sh
```

### 2. 启动应用程序
```bash
# 运行Spring Boot应用
mvn spring-boot:run
```

### 3. 访问服务
- **API文档**: http://localhost:8080/swagger-ui/index.html
- **数据库**: 主机 `localhost`, 端口 `3306`

## 开发环境配置

### 1. 核心依赖
- JDK 17+
- Maven 3.6+
- Docker & Docker Compose

### 2. 数据库配置
项目推荐使用 `docker-compose.yml` 来管理数据库。

#### 方法一：一键启动脚本 (推荐)
```bash
./start_database.sh
```
该脚本会自动完成所有Docker操作，并进行健康检查。

#### 方法二：手动使用Docker Compose
```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs mysql
```

### 3. 数据库连接配置
`application.properties` 中的连接信息已预先配置好，对应 `docker-compose.yml` 中的设置。
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

## 开发计划

- [x] 项目初始化，Maven基础框架搭建
- [x] Spring Boot核心依赖配置
- [x] 数据库多数据源配置
- [x] MyBatis Plus 架构集成
- [x] 移除JPA依赖
- [x] Redis缓存配置
- [x] Kafka消息队列配置
- [x] 核心实体类设计
- [x] 统一响应类和分页类
- [x] 积分规则管理API接口定义
- [x] 转换规则管理API接口定义
- [x] 机构管理API接口定义
- [x] Swagger API文档配置
- [x] 数据库构建脚本 (database_setup.sql)
- [x] Docker Compose 部署方案
- [x] 一键启动脚本 (start_database.sh)
- [x] 数据库使用指南 (DATABASE_GUIDE.md)
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

## API文档访问

启动项目后，可以通过以下地址访问API文档：
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## 版本记录

* **v1.2.1** (2025.6.24): 架构重构至MyBatis Plus，完善数据库解决方案
* **v1.1.0** (2025.6.23): 完成核心实体类设计、统一响应类和所有API接口定义
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

🎓 **毕业实习项目** - 终身学习学分银行平台积分管理系统 v1.2.1 