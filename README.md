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
- Redis 7.0 (通过Docker容器，用于短信验证码缓存)

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

## ✨ 项目特色

### 🎯 核心功能
- **智能编码生成**: 中文规则名称自动转换为英文编码，支持30+智能映射规则
- **编码模板库**: 4大分类16个常用编码模板，支持一键应用
- **动态表单验证**: 基于依赖的条件验证和UI状态智能控制
- **积分规则管理**: 完整的CRUD操作，支持审核流程和批量操作
- **高级注册表单**: 统一社会信用代码验证 + 全国省市区级联选择
- **现代化界面**: 使用最新Ant Design 5.0组件，零警告，用户体验优良
- **积分商城系统**: 完整的商品管理、订单处理和积分消费功能
- **个人中心管理**: 用户积分记录查询、订单历史和个人信息管理

### 🔧 技术亮点
- **前后端分离**: React + Spring Boot 完整技术栈
- **RESTful API设计**: 统一响应格式，完善错误处理机制
- **MyBatis Plus架构**: 强大的数据访问层，自动代码生成
- **Docker容器化**: 一键部署数据库环境，开发环境统一
- **智能数据库管理**: 增强版启动脚本v3.0，支持跨平台、自动初始化、性能监控
- **完整管理工具**: 数据库备份/恢复、状态监控、维护优化一体化解决方案
- **智能表单系统**: 三种编码生成方式，满足不同用户需求
- **高级数据验证**: 统一社会信用代码算法验证，ISO 7064 Mod 97-10标准
- **完整地区数据库**: 全国34个省份380+个城市完整三级级联数据
- **文件上传系统**: 统一的文件验证工具，支持多种文件类型，友好的错误提示
- **事务管理**: 完善的数据库事务处理，确保积分消费和订单创建的一致性
- **用户体验**: 响应式布局，统一的UI风格，优雅的交互效果

📖 **详细文档链接**
- **[API接口文档](./API.md)** - 32个REST API接口详细说明
- **[前端开发指南](./FRONTEND_GUIDE.md)** - React + Ant Design 前端项目完整指南
- **[数据库使用指南](./DATABASE_GUIDE.md)** - 完整的数据库构建、配置和使用手册
- **[测试指南](./TESTING.md)** - 功能测试、集成测试、性能测试完整方案
- **[部署指南](./DEPLOYMENT.md)** - 生产环境部署和运维完整流程
- **[常见问题解答](./FAQ.md)** - 开发、部署、使用过程中的常见问题及解决方案
- **[更新日志](./UPDATE_LOG.md)** - 详细的功能更新和技术改进记录

## 🚀 快速开始 (5分钟体验)

### 🎯 一键启动演示

#### Windows 环境 (推荐)
```bash
# 1. 启动数据库 (增强版脚本 v3.0)
& "D:\Git\bin\bash.exe" start_database.sh

# 2. 启动后端服务
mvn spring-boot:run

# 3. 启动前端服务 (新终端)
cd frontend && npm start
```

#### Linux/macOS 环境
```bash
# 1. 启动数据库 (一键脚本)
./start_database.sh

# 2. 启动后端服务
mvn spring-boot:run

# 3. 启动前端服务 (新终端)
cd frontend && npm start
```

### 🌐 访问地址
- **前端界面**: http://localhost:3000
- **API文档**: http://localhost:8080/swagger-ui/index.html
- **MySQL数据库**: localhost:3306 (用户: root, 密码: 123456)
- **Redis缓存**: localhost:6379 (无密码，用于短信验证码存储)

### 📱 功能演示
1. **积分规则管理**: 创建、编辑、审核积分规则
2. **转换规则配置**: 设置积分与学分的转换比例
3. **机构信息管理**: 管理教育机构基本信息
4. **智能编码生成**: 中文规则名自动转换英文编码
5. **高级注册表单**: 统一社会信用代码验证 + 省市区级联选择 (访问 `/register`)
6. **积分商城系统**: 浏览商品、下单购买、积分消费 (访问 `/points-mall`)
7. **个人中心管理**: 查看积分记录、订单历史、个人信息 (访问 `/profile`)

## 运行说明

### 1. 启动数据库 (推荐)
使用项目根目录的增强版一键启动脚本：

#### Windows 环境
```bash
# 启动数据库 (增强版脚本 v3.0)
& "D:\Git\bin\bash.exe" start_database.sh

# 或使用数据库管理工具
& "D:\Git\bin\bash.exe" database_manager.sh
```

#### Linux/macOS 环境
```bash
# 启动数据库
./start_database.sh

# 或使用数据库管理工具
./database_manager.sh
```

### 2. 启动应用程序
```bash
# 运行Spring Boot应用
mvn spring-boot:run
```

### 3. 访问服务
- **API文档**: http://localhost:8080/swagger-ui/index.html
- **MySQL数据库**: 主机 `localhost`, 端口 `3306`
- **Redis缓存**: 主机 `localhost`, 端口 `6379`

## 开发环境配置

### 1. 核心依赖
- JDK 17+
- Maven 3.6+
- Docker & Docker Compose

### 2. 数据库配置
项目推荐使用 `docker-compose.yml` 来管理数据库。

#### 方法一：增强版一键启动脚本 (推荐)

**Windows 环境：**
```bash
& "D:\Git\bin\bash.exe" start_database.sh
```

**Linux/macOS 环境：**
```bash
./start_database.sh
```

该脚本会自动完成所有Docker操作，并进行健康检查、数据初始化、性能监控等。

#### 方法二：手动使用Docker Compose
```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs mysql
```

### 3. 数据库和缓存连接配置
`application.properties` 中的连接信息已预先配置好，对应 `docker-compose.yml` 中的设置。
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
- [x] 积分商城系统实现
- [x] 订单管理系统实现
- [x] 个人中心功能完善
- [x] 文件上传系统实现
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

* **v1.3.5** (2025.7.4): 用户界面优化与文件上传功能增强，优化轮播图布局和头像功能，提升用户体验
* **v1.3.4** (2025.7.4): Redis缓存集成与数据库管理工具升级，实现MySQL + Redis双服务智能管理，解决Redis连接失败问题
* **v1.3.3** (2025.7.4): 证书认定积分奖励功能实现，完善证书标准管理，修复编译错误
* **v1.3.2** (2025.7.3): 热门活动模块优化与数据库连接，轮播图交互优化
* **v1.3.1** (2025.7.2): 课程发布系统与管理平台优化，个人主页功能完善
* **v1.3.0** (2025.7.2): 积分商城与订单系统上线，实现商品管理、订单处理、图片上传和个人中心功能完善
* **v1.2.3** (2025.6.30): 地区数据库完善，全国省市区三级级联数据完整覆盖，直辖市结构优化
* **v1.2.2** (2025.6.30): 注册表单增强，统一社会信用代码验证，省市区级联选择功能
* **v1.2.1** (2025.6.30): 认证授权与注册模块重构，密码加密存储，前端UI优化
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

🎓 **毕业实习项目** - 终身学习学分银行平台积分管理系统 v1.3.5 