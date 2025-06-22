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
│   │       └── Application.java
│   └── resources/
│       └── application.properties
└── test/
    └── java/
```

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
- [ ] 用户管理模块
- [ ] 实习任务管理
- [ ] 数据分析模块（Spark）
- [ ] 系统监控和日志
- [ ] Docker部署配置

## 版本记录

* v1.0.0: 项目初始化，技术栈配置完成 