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

## API接口文档

### 1. 积分规则管理模块 (`/api/point-rules`)

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/point-rules` | POST | 创建积分规则 |
| `/api/point-rules` | GET | 分页查询积分规则 |
| `/api/point-rules/{id}` | GET | 获取积分规则详情 |
| `/api/point-rules/{id}` | PUT | 更新积分规则 |
| `/api/point-rules/{id}` | DELETE | 删除积分规则 |
| `/api/point-rules/{id}/review` | POST | 审核积分规则 |
| `/api/point-rules/{id}/status` | POST | 启用/禁用积分规则 |
| `/api/point-rules/batch` | DELETE | 批量删除积分规则 |
| `/api/point-rules/statistics` | GET | 获取积分规则统计 |
| `/api/point-rules/export` | GET | 导出积分规则 |

### 2. 转换规则管理模块 (`/api/conversion-rules`)

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/conversion-rules` | POST | 创建转换规则 |
| `/api/conversion-rules` | GET | 分页查询转换规则 |
| `/api/conversion-rules/{id}` | GET | 获取转换规则详情 |
| `/api/conversion-rules/{id}` | PUT | 更新转换规则 |
| `/api/conversion-rules/{id}` | DELETE | 删除转换规则 |
| `/api/conversion-rules/{id}/review` | POST | 审核转换规则 |
| `/api/conversion-rules/{id}/status` | POST | 启用/禁用转换规则 |
| `/api/conversion-rules/{id}/test` | POST | 测试转换规则 |
| `/api/conversion-rules/ratio-recommendations` | GET | 获取转换比例推荐 |
| `/api/conversion-rules/statistics` | GET | 获取转换规则统计 |

### 3. 机构管理模块 (`/api/institutions`)

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/institutions` | POST | 创建机构 |
| `/api/institutions` | GET | 分页查询机构 |
| `/api/institutions/{id}` | GET | 获取机构详情 |
| `/api/institutions/{id}` | PUT | 更新机构信息 |
| `/api/institutions/{id}` | DELETE | 删除机构 |
| `/api/institutions/{id}/review` | POST | 审核机构 |
| `/api/institutions/{id}/status` | POST | 修改机构状态 |
| `/api/institutions/{id}/certification` | POST | 机构认证等级评定 |
| `/api/institutions/statistics` | GET | 获取机构统计 |
| `/api/institutions/region-statistics` | GET | 获取区域统计 |
| `/api/institutions/type-statistics` | GET | 获取类型统计 |
| `/api/institutions/export` | GET | 导出机构信息 |

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

## 环境要求

- JDK 17+
- Maven 3.6+
- MySQL 8.0+
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

* v1.1.0: 完成核心实体类设计、统一响应类和所有API接口定义（2025.6.22）
* v1.0.0: 项目初始化，技术栈配置完成 