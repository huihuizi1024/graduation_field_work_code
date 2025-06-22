# 项目测试文档

## 概述

本文档详细说明了如何对终身学习学分银行平台积分管理系统进行全面测试，包括功能测试、集成测试、性能测试等。

## 1. 应用启动验证

### 1.1 检查依赖服务状态
```bash
# 检查Docker是否运行
docker --version
docker ps

# 验证MySQL容器状态
docker ps | grep mysql-internship

# 查看MySQL容器日志
docker logs mysql-internship
```

### 1.2 应用启动检查
```bash
# 方法1：使用Maven启动
mvn clean compile
mvn spring-boot:run

# 方法2：在IDEA中启动
# 右键 Application.java -> Run 'Application.main()'
```

### 1.3 启动成功标志
应用启动成功后，应看到以下日志：
```
✅ HikariPool-1 - Start completed
✅ Initialized JPA EntityManagerFactory for persistence unit 'default'
✅ Tomcat started on port 8080 (http) with context path ''
✅ Started Application in X.X seconds
```

## 2. API接口测试

### 2.1 基础连通性测试
```bash
# 测试应用是否响应
curl -I http://localhost:8080

# 获取API文档JSON
curl http://localhost:8080/v3/api-docs

# 测试健康检查（如果启用）
curl http://localhost:8080/actuator/health
```

### 2.2 Swagger UI界面测试
访问地址：
- **主要入口**：http://localhost:8080/swagger-ui/index.html
- **备用入口**：http://localhost:8080/swagger-ui.html
- **API JSON**：http://localhost:8080/v3/api-docs

预期看到的API分组：
```
📋 积分规则管理 (Point Rules)
   ├── POST   /api/point-rules              创建积分规则
   ├── GET    /api/point-rules              分页查询积分规则
   ├── GET    /api/point-rules/{id}         获取积分规则详情
   ├── PUT    /api/point-rules/{id}         更新积分规则
   ├── DELETE /api/point-rules/{id}         删除积分规则
   ├── POST   /api/point-rules/{id}/review  审核积分规则
   ├── POST   /api/point-rules/{id}/status  启用/禁用积分规则
   ├── DELETE /api/point-rules/batch        批量删除积分规则
   ├── GET    /api/point-rules/statistics   获取积分规则统计
   └── GET    /api/point-rules/export       导出积分规则

📋 转换规则管理 (Conversion Rules)
   ├── POST   /api/conversion-rules                    创建转换规则
   ├── GET    /api/conversion-rules                    分页查询转换规则
   ├── GET    /api/conversion-rules/{id}               获取转换规则详情
   ├── PUT    /api/conversion-rules/{id}               更新转换规则
   ├── DELETE /api/conversion-rules/{id}               删除转换规则
   ├── POST   /api/conversion-rules/{id}/review        审核转换规则
   ├── POST   /api/conversion-rules/{id}/status        启用/禁用转换规则
   ├── POST   /api/conversion-rules/{id}/test          测试转换规则
   ├── GET    /api/conversion-rules/ratio-recommendations 获取转换比例推荐
   └── GET    /api/conversion-rules/statistics         获取转换规则统计

📋 机构管理 (Institutions)
   ├── POST   /api/institutions                        创建机构
   ├── GET    /api/institutions                        分页查询机构
   ├── GET    /api/institutions/{id}                   获取机构详情
   ├── PUT    /api/institutions/{id}                   更新机构信息
   ├── DELETE /api/institutions/{id}                   删除机构
   ├── POST   /api/institutions/{id}/review            审核机构
   ├── POST   /api/institutions/{id}/status            修改机构状态
   ├── POST   /api/institutions/{id}/certification     机构认证等级评定
   ├── GET    /api/institutions/statistics             获取机构统计
   ├── GET    /api/institutions/region-statistics      获取区域统计
   ├── GET    /api/institutions/type-statistics        获取类型统计
   └── GET    /api/institutions/export                 导出机构信息
```

### 2.3 API接口功能测试

**测试积分规则管理接口：**
```bash
# 1. 测试创建积分规则
curl -X POST http://localhost:8080/api/point-rules \
  -H "Content-Type: application/json" \
  -d '{
    "ruleName": "测试积分规则",
    "ruleCode": "TEST001",
    "pointType": 1,
    "points": 100,
    "description": "这是一个测试规则"
  }'

# 2. 测试查询积分规则列表
curl "http://localhost:8080/api/point-rules?page=1&size=10"

# 3. 测试获取规则详情
curl http://localhost:8080/api/point-rules/1

# 4. 测试规则统计
curl http://localhost:8080/api/point-rules/statistics
```

**测试转换规则管理接口：**
```bash
# 1. 测试创建转换规则
curl -X POST http://localhost:8080/api/conversion-rules \
  -H "Content-Type: application/json" \
  -d '{
    "ruleName": "积分学分转换",
    "conversionRatio": 10.0,
    "sourceType": "积分",
    "targetType": "学分"
  }'

# 2. 测试查询转换规则
curl "http://localhost:8080/api/conversion-rules?page=1&size=10"

# 3. 测试转换比例推荐
curl http://localhost:8080/api/conversion-rules/ratio-recommendations
```

**测试机构管理接口：**
```bash
# 1. 测试创建机构
curl -X POST http://localhost:8080/api/institutions \
  -H "Content-Type: application/json" \
  -d '{
    "institutionName": "测试大学",
    "institutionCode": "TEST_UNIV",
    "institutionType": 1,
    "region": "北京",
    "contactEmail": "test@university.edu"
  }'

# 2. 测试查询机构列表
curl "http://localhost:8080/api/institutions?page=1&size=10"

# 3. 测试机构统计
curl http://localhost:8080/api/institutions/statistics
```

## 3. 数据库测试

### 3.1 数据库连接测试
```bash
# 连接到MySQL容器
docker exec -it mysql-internship mysql -u root -p123456

# 在MySQL中执行以下命令：
USE internship_db;
SHOW TABLES;
DESCRIBE point_rule;
DESCRIBE conversion_rule;
DESCRIBE institution;
```

### 3.2 数据库表结构验证
验证以下表是否自动创建：
```sql
-- 查看所有表
SHOW TABLES;

-- 预期输出：
-- +---------------------------+
-- | Tables_in_internship_db   |
-- +---------------------------+
-- | conversion_rule           |
-- | institution               |
-- | point_rule                |
-- +---------------------------+

-- 查看表结构
DESCRIBE point_rule;
DESCRIBE conversion_rule;  
DESCRIBE institution;
```

### 3.3 数据完整性测试
```sql
-- 测试插入数据
INSERT INTO point_rule (rule_name, rule_code, point_type, points, description, status, created_time) 
VALUES ('测试规则', 'TEST001', 1, 100, '测试描述', 1, NOW());

-- 验证数据插入
SELECT * FROM point_rule;

-- 清理测试数据
DELETE FROM point_rule WHERE rule_code = 'TEST001';
```

## 4. 系统集成测试

### 4.1 完整流程测试
```bash
# 1. 启动所有服务
docker ps  # 确认MySQL运行
# 启动Spring Boot应用

# 2. 执行API调用链测试
curl -X POST http://localhost:8080/api/institutions \
  -H "Content-Type: application/json" \
  -d '{"institutionName":"测试大学","institutionCode":"TEST001","institutionType":1}'

curl -X POST http://localhost:8080/api/point-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"测试积分规则","ruleCode":"RULE001","pointType":1,"points":100}'

curl -X POST http://localhost:8080/api/conversion-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"积分学分转换","conversionRatio":10.0}'

# 3. 验证数据一致性
curl http://localhost:8080/api/institutions/statistics
curl http://localhost:8080/api/point-rules/statistics
curl http://localhost:8080/api/conversion-rules/statistics
```

### 4.2 并发测试
```bash
# 使用简单并发测试
for i in {1..10}; do
  curl http://localhost:8080/api/point-rules &
done
wait

# 检查并发访问是否正常
echo "并发测试完成"
```

## 5. 性能测试

### 5.1 响应时间测试
```bash
# 测试API响应时间
time curl http://localhost:8080/api/point-rules

# 使用curl的详细时间信息
curl -w "响应时间: %{time_total}秒\n" -o /dev/null -s http://localhost:8080/api/point-rules
```

### 5.2 数据库性能测试
```bash
# 检查数据库连接池状态
docker exec mysql-internship mysqladmin -u root -p123456 status

# 查看数据库进程
docker exec mysql-internship mysql -u root -p123456 -e "SHOW PROCESSLIST;"
```

## 6. 故障排除指南

### 6.1 常见问题及解决方案

**问题1：应用启动失败**
```bash
# 检查端口占用
lsof -i :8080
netstat -an | grep 8080

# 解决方案：杀死占用进程或更改端口
kill -9 $(lsof -t -i:8080)
# 或在application.properties中修改server.port
```

**问题2：数据库连接失败**
```bash
# 检查MySQL容器状态
docker ps | grep mysql
docker logs mysql-internship

# 检查网络连接
telnet localhost 3306

# 解决方案：重启MySQL容器
docker restart mysql-internship
```

**问题3：Swagger UI无法访问**
```bash
# 检查应用是否正常启动
curl http://localhost:8080/v3/api-docs

# 尝试不同的URL路径
curl http://localhost:8080/swagger-ui/index.html
curl http://localhost:8080/swagger-ui.html
```

**问题4：API返回500错误**
```bash
# 查看应用日志
tail -f logs/field-work-system.log

# 检查数据库连接
docker exec -it mysql-internship mysql -u root -p123456 -e "SELECT 1"

# 验证JSON格式
echo '{"test": "data"}' | python -m json.tool
```

### 6.2 调试模式启动
```bash
# 启用调试模式
mvn spring-boot:run -Dspring-boot.run.profiles=dev -Ddebug=true

# 或在IDEA中设置JVM参数
-Ddebug=true -Dlogging.level.com.internship=DEBUG
```

### 6.3 日志分析
```bash
# 实时查看应用日志
tail -f logs/field-work-system.log

# 搜索错误信息
grep -i error logs/field-work-system.log
grep -i exception logs/field-work-system.log

# 查看特定模块日志
grep "com.internship" logs/field-work-system.log
```

## 7. 安全性测试

### 7.1 输入验证测试
```bash
# 测试SQL注入防护
curl -X POST http://localhost:8080/api/point-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"test'; DROP TABLE point_rule; --","ruleCode":"TEST"}'

# 测试XSS防护
curl -X POST http://localhost:8080/api/point-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"<script>alert(\"xss\")</script>","ruleCode":"TEST"}'

# 测试长字符串处理
curl -X POST http://localhost:8080/api/point-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"'$(python -c "print('A' * 1000)")'"}'
```

### 7.2 异常情况测试
```bash
# 测试无效的API端点
curl http://localhost:8080/api/invalid-endpoint

# 测试无效的HTTP方法
curl -X PATCH http://localhost:8080/api/point-rules

# 测试无效的请求数据
curl -X POST http://localhost:8080/api/point-rules \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'

# 测试无效的ID
curl http://localhost:8080/api/point-rules/999999
```

## 8. 测试结果验证清单

完成所有测试后，请确认以下检查点：

- [ ] ✅ Docker和MySQL容器运行正常
- [ ] ✅ Spring Boot应用成功启动，无错误日志
- [ ] ✅ 数据库连接池正常工作
- [ ] ✅ JPA实体表自动创建成功
- [ ] ✅ Swagger UI界面可正常访问
- [ ] ✅ 32个API接口全部显示在文档中
- [ ] ✅ API基础CRUD操作测试通过
- [ ] ✅ 数据库数据持久化正常
- [ ] ✅ 异常处理机制工作正常
- [ ] ✅ 应用性能指标在可接受范围内
- [ ] ✅ 安全性基础测试通过
- [ ] ✅ 系统日志记录完整清晰

## 9. 自动化测试脚本

### 9.1 快速健康检查脚本

创建 `health-check.sh` 文件：

```bash
#!/bin/bash
echo "🔍 开始系统健康检查..."

# 检查Docker
docker ps | grep mysql-internship > /dev/null && echo "✅ MySQL容器运行正常" || echo "❌ MySQL容器异常"

# 检查应用
curl -s http://localhost:8080/v3/api-docs > /dev/null && echo "✅ 应用API正常" || echo "❌ 应用API异常"

# 检查数据库连接
docker exec mysql-internship mysql -u root -p123456 -e "SELECT 1" > /dev/null 2>&1 && echo "✅ 数据库连接正常" || echo "❌ 数据库连接异常"

# 检查Swagger UI
curl -s http://localhost:8080/swagger-ui/index.html > /dev/null && echo "✅ Swagger UI正常" || echo "❌ Swagger UI异常"

echo "✅ 健康检查完成！"
```

使用方法：
```bash
chmod +x health-check.sh
./health-check.sh
```

### 9.2 API功能测试脚本

创建 `api-test.sh` 文件：

```bash
#!/bin/bash
echo "🧪 开始API功能测试..."

BASE_URL="http://localhost:8080"

# 测试积分规则API
echo "测试积分规则API..."
curl -s -X POST $BASE_URL/api/point-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"测试规则","ruleCode":"TEST001","pointType":1,"points":100}' > /dev/null && echo "✅ 创建积分规则成功" || echo "❌ 创建积分规则失败"

curl -s $BASE_URL/api/point-rules > /dev/null && echo "✅ 查询积分规则成功" || echo "❌ 查询积分规则失败"

# 测试转换规则API
echo "测试转换规则API..."
curl -s -X POST $BASE_URL/api/conversion-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"积分转学分","conversionRatio":10.0}' > /dev/null && echo "✅ 创建转换规则成功" || echo "❌ 创建转换规则失败"

# 测试机构管理API
echo "测试机构管理API..."
curl -s -X POST $BASE_URL/api/institutions \
  -H "Content-Type: application/json" \
  -d '{"institutionName":"测试大学","institutionCode":"TEST_UNIV","institutionType":1}' > /dev/null && echo "✅ 创建机构成功" || echo "❌ 创建机构失败"

echo "✅ API功能测试完成！"
```

## 10. 持续测试建议

### 10.1 每日开发测试
- 运行健康检查脚本
- 执行基础API测试
- 检查应用日志
- 验证数据库状态

### 10.2 回归测试
每次代码更改后执行：
1. 重新启动应用
2. 执行完整API测试
3. 验证数据库操作
4. 检查Swagger文档更新
5. 运行性能基准测试

### 10.3 生产环境准备
- 配置生产环境数据库连接
- 设置适当的日志级别
- 配置应用监控和告警
- 准备负载测试脚本
- 制定灾难恢复计划

## 注意事项

1. 测试前确保所有依赖服务正常运行
2. 测试数据请使用专门的测试数据库
3. 生产环境测试需要额外的安全审查
4. 定期备份测试数据和配置
5. 记录测试结果和问题解决过程 