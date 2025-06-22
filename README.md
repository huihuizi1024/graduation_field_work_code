# 毕业设计项目

## 项目描述

这是我的毕业设计项目，基于Maven构建系统开发。

## 技术栈

* Java 17
* Maven
* 未来将添加Spring Boot等框架

## 项目结构

```
src/
├── main/
│   ├── java/
│   │   └── org/example/
│   │       └── Main.java
│   └── resources/
└── test/
    └── java/
```

## 运行说明

```bash
# 编译项目
mvn compile

# 运行项目
mvn exec:java -Dexec.mainClass="org.example.Main"

# 打包项目
mvn package
```

## 开发计划

- [x] 项目初始化
- [ ] 添加Spring Boot框架
- [ ] 实现核心业务逻辑
- [ ] 添加数据库支持
- [ ] 编写测试用例

## 版本记录

* v1.0.0: 项目初始化，Maven基础框架搭建 