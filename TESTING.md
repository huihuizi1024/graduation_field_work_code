# 项目测试指南

## 概述

本文档说明如何对终身学习学分银行平台积分管理系统进行全面测试。

## 1. 环境验证

### 1.1 检查依赖服务
```bash
# 检查Docker和MySQL容器
docker --version
docker ps | grep mysql-internship

# 验证MySQL容器日志
docker logs mysql-internship
```

### 1.2 应用启动检查
```bash
# Maven启动
mvn spring-boot:run

# 或在IDEA中启动 Application.java
```

#### 启动成功标志
```
✅ HikariPool-1 - Start completed
✅ Initialized JPA EntityManagerFactory
✅ Tomcat started on port 8080
✅ Started Application in X.X seconds
```

## 2. API接口测试

### 2.1 基础连通性测试
```bash
# 测试应用响应
curl -I http://localhost:8080

# Swagger UI访问测试
curl -s http://localhost:8080/swagger-ui/index.html > /dev/null && echo "✅ Swagger UI正常"

# API文档JSON
curl http://localhost:8080/v3/api-docs
```

### 2.2 Swagger UI界面验证
访问地址：**http://localhost:8080/swagger-ui/index.html**

预期API分组：
- **积分规则管理** (Point Rules) - 10个接口
- **转换规则管理** (Conversion Rules) - 10个接口  
- **机构管理** (Institutions) - 12个接口
- **用户管理** (Users) - 8个接口
- **其他业务模块** - 认证标准、业务流程等

### 2.3 核心API功能测试

#### 积分规则API测试
```bash
# 创建积分规则
curl -X POST http://localhost:8080/api/point-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"测试规则","ruleCode":"TEST001","pointType":1,"pointValue":100}'

# 查询积分规则
curl http://localhost:8080/api/point-rules

# 获取统计信息
curl http://localhost:8080/api/point-rules/statistics
```

#### 转换规则API测试
```bash
# 创建转换规则
curl -X POST http://localhost:8080/api/conversion-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"积分学分转换","conversionRatio":10.0}'

# 查询转换规则
curl http://localhost:8080/api/conversion-rules
```

#### 机构管理API测试
```bash
# 创建机构
curl -X POST http://localhost:8080/api/institutions \
  -H "Content-Type: application/json" \
  -d '{"institutionName":"测试大学","institutionCode":"TEST_UNIV","institutionType":1}'

# 查询机构
curl http://localhost:8080/api/institutions
```

## 3. 数据库测试

### 3.1 数据库连接测试
```bash
# 连接到MySQL容器
docker exec -it mysql-internship mysql -u root -p123456

# 验证数据库表
USE internship_db;
SHOW TABLES;
```

### 3.2 数据完整性验证
```sql
-- 检查表结构
DESCRIBE point_rule;
DESCRIBE conversion_rule;
DESCRIBE institution;

-- 验证数据统计
SELECT 'point_rule' as table_name, COUNT(*) as count FROM point_rule
UNION ALL
SELECT 'conversion_rule' as table_name, COUNT(*) as count FROM conversion_rule
UNION ALL  
SELECT 'institution' as table_name, COUNT(*) as count FROM institution;
```

## 4. 前端测试

### 4.1 前端启动验证
```bash
cd frontend
npm start
# 访问 http://localhost:3000
```

### 4.2 核心功能测试
- **登录页面**: http://localhost:3000/login
- **注册页面**: http://localhost:3000/register
- **主页面**: http://localhost:3000 (需登录)

#### 注册表单测试
1. **统一社会信用代码验证**: 测试代码 `91110000633674095F`
2. **省市区级联选择**: 测试 北京市→北京市→朝阳区
3. **表单验证**: 测试无效手机号、邮箱格式等

## 5. 集成测试

### 5.1 完整流程测试
```bash
# 1. 启动所有服务
docker ps  # 确认MySQL运行
# 启动Spring Boot应用 (8080端口)
# 启动前端应用 (3000端口)

# 2. 执行API调用链测试
curl -X POST http://localhost:8080/api/institutions \
  -H "Content-Type: application/json" \
  -d '{"institutionName":"测试大学","institutionCode":"TEST001","institutionType":1}'

curl -X POST http://localhost:8080/api/point-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"测试积分规则","ruleCode":"RULE001","pointType":1,"pointValue":100}'

# 3. 验证数据一致性
curl http://localhost:8080/api/institutions/statistics
curl http://localhost:8080/api/point-rules/statistics
```

## 6. 性能测试

### 6.1 响应时间测试
```bash
# 测试API响应时间
time curl http://localhost:8080/api/point-rules

# 详细时间信息
curl -w "响应时间: %{time_total}秒\n" -o /dev/null -s http://localhost:8080/api/point-rules
```

### 6.2 并发测试
```bash
# 简单并发测试
for i in {1..10}; do
  curl http://localhost:8080/api/point-rules &
done
wait
echo "并发测试完成"
```

## 7. 故障排除

### 7.1 常见问题解决

#### 应用启动失败
```bash
# 检查端口占用
lsof -i :8080
netstat -an | grep 8080

# 解决方案：杀死占用进程
kill -9 $(lsof -t -i:8080)
```

#### 数据库连接失败
```bash
# 检查MySQL容器状态
docker ps | grep mysql
docker logs mysql-internship

# 重启MySQL容器
docker restart mysql-internship
```

#### 前端启动失败
```bash
# 清理并重新安装依赖
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

#### API返回500错误
```bash
# 查看应用日志
tail -f logs/field-work-system.log

# 检查数据库连接
docker exec -it mysql-internship mysql -u root -p123456 -e "SELECT 1"
```

### 7.2 调试模式
```bash
# 启用调试模式
mvn spring-boot:run -Ddebug=true -Dlogging.level.com.internship=DEBUG
```

## 8. 自动化测试脚本

### 8.1 健康检查脚本
创建 `health-check.sh`：
```bash
#!/bin/bash
echo "🔍 开始系统健康检查..."

# 检查Docker
docker ps | grep mysql-internship > /dev/null && echo "✅ MySQL容器运行正常" || echo "❌ MySQL容器异常"

# 检查应用
curl -s http://localhost:8080/v3/api-docs > /dev/null && echo "✅ 应用API正常" || echo "❌ 应用API异常"

# 检查数据库连接
docker exec mysql-internship mysql -u root -p123456 -e "SELECT 1" > /dev/null 2>&1 && echo "✅ 数据库连接正常" || echo "❌ 数据库连接异常"

# 检查前端
curl -s http://localhost:3000 > /dev/null && echo "✅ 前端应用正常" || echo "❌ 前端应用异常"

echo "✅ 健康检查完成！"
```

使用方法：
```bash
chmod +x health-check.sh
./health-check.sh
```

### 8.2 API功能测试脚本
创建 `api-test.sh`：
```bash
#!/bin/bash
echo "🧪 开始API功能测试..."

BASE_URL="http://localhost:8080"

# 测试积分规则API
curl -s -X POST $BASE_URL/api/point-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"测试规则","ruleCode":"TEST001","pointType":1,"pointValue":100}' > /dev/null && echo "✅ 创建积分规则成功"

curl -s $BASE_URL/api/point-rules > /dev/null && echo "✅ 查询积分规则成功"

# 测试转换规则API
curl -s -X POST $BASE_URL/api/conversion-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"积分转学分","conversionRatio":10.0}' > /dev/null && echo "✅ 创建转换规则成功"

echo "✅ API功能测试完成！"
```

## 9. 测试结果验证清单

完成所有测试后，确认以下检查点：

- [ ] ✅ Docker和MySQL容器运行正常
- [ ] ✅ Spring Boot应用成功启动，无错误日志
- [ ] ✅ 数据库连接池正常工作
- [ ] ✅ JPA实体表自动创建成功
- [ ] ✅ Swagger UI界面可正常访问
- [ ] ✅ 32个API接口全部显示在文档中
- [ ] ✅ API基础CRUD操作测试通过
- [ ] ✅ 前端应用正常启动和访问
- [ ] ✅ 注册表单高级功能测试通过
- [ ] ✅ 数据库数据持久化正常
- [ ] ✅ 异常处理机制工作正常
- [ ] ✅ 应用性能指标在可接受范围内

## 10. 持续测试建议

### 每日开发测试
- 运行健康检查脚本
- 执行基础API测试
- 检查应用日志
- 验证数据库状态

### 回归测试
每次代码更改后执行：
1. 重新启动应用
2. 执行完整API测试
3. 验证数据库操作
4. 检查Swagger文档更新
5. 前端功能验证

---

💡 **提示**: 测试前确保所有依赖服务正常运行，建议使用自动化脚本进行日常测试 