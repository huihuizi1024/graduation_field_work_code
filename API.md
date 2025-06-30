# API接口文档

## 概述

本文档列出了终身学习学分银行平台积分管理系统的所有REST API接口。

### 基础信息
- **API基础URL**: `http://localhost:8080`
- **API文档**: http://localhost:8080/swagger-ui/index.html
- **数据格式**: JSON, UTF-8

### 响应格式
```json
{
  "success": true,
  "message": "操作成功",
  "data": {},
  "timestamp": "2025-06-22T16:44:13"
}
```

## 接口列表

### 1. 积分规则管理
- `POST /api/point-rules` - 创建积分规则
- `GET /api/point-rules` - 分页查询积分规则
- `GET /api/point-rules/{id}` - 获取积分规则详情
- `PUT /api/point-rules/{id}` - 更新积分规则
- `DELETE /api/point-rules/{id}` - 删除积分规则
- `POST /api/point-rules/{id}/review` - 审核积分规则
- `POST /api/point-rules/{id}/status` - 启用/禁用积分规则
- `DELETE /api/point-rules/batch` - 批量删除
- `GET /api/point-rules/statistics` - 获取统计信息
- `GET /api/point-rules/export` - 导出数据

#### 请求参数示例
```json
{
  "ruleName": "学习积分规则",
  "ruleCode": "STUDY_POINTS",
  "pointType": 1,
  "pointValue": 100,
  "description": "完成学习任务获得积分",
  "applicableObject": 1,
  "status": 1
}
```

### 2. 转换规则管理
- `POST /api/conversion-rules` - 创建转换规则
- `GET /api/conversion-rules` - 分页查询转换规则
- `GET /api/conversion-rules/{id}` - 获取转换规则详情
- `PUT /api/conversion-rules/{id}` - 更新转换规则
- `DELETE /api/conversion-rules/{id}` - 删除转换规则
- `POST /api/conversion-rules/{id}/review` - 审核转换规则
- `POST /api/conversion-rules/{id}/status` - 启用/禁用转换规则
- `POST /api/conversion-rules/{id}/test` - 测试转换规则
- `GET /api/conversion-rules/ratio-recommendations` - 获取转换比例推荐
- `GET /api/conversion-rules/statistics` - 获取统计信息

#### 请求参数示例
```json
{
  "ruleName": "积分学分转换",
  "conversionRatio": 10.0,
  "sourceType": "积分",
  "targetType": "学分",
  "description": "10积分转换为1学分"
}
```

### 3. 机构管理
- `POST /api/institutions` - 创建机构
- `GET /api/institutions` - 分页查询机构
- `GET /api/institutions/{id}` - 获取机构详情
- `PUT /api/institutions/{id}` - 更新机构信息
- `DELETE /api/institutions/{id}` - 删除机构
- `POST /api/institutions/{id}/review` - 审核机构
- `POST /api/institutions/{id}/status` - 修改机构状态
- `POST /api/institutions/{id}/certification` - 机构认证等级评定
- `GET /api/institutions/statistics` - 获取机构统计
- `GET /api/institutions/region-statistics` - 获取区域统计
- `GET /api/institutions/type-statistics` - 获取类型统计
- `GET /api/institutions/export` - 导出机构信息

#### 请求参数示例
```json
{
  "institutionName": "北京大学",
  "institutionCode": "PKU",
  "institutionType": 1,
  "region": "北京",
  "contactEmail": "contact@pku.edu.cn",
  "description": "综合性研究型大学"
}
```

### 4. 用户管理
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register/personal` - 个人注册
- `POST /api/auth/register/expert` - 专家注册
- `POST /api/auth/register/organization` - 机构注册
- `GET /api/users` - 分页查询用户
- `GET /api/users/{id}` - 获取用户详情
- `PUT /api/users/{id}` - 更新用户信息
- `DELETE /api/users/{id}` - 删除用户

### 5. 其他API接口
- `GET /api/certification-standards` - 认证标准管理
- `GET /api/business-processes` - 业务流程管理
- `GET /api/platform-activities` - 平台活动管理
- `GET /api/transactions` - 交易管理
- `GET /api/projects` - 项目管理
- `GET /api/experts` - 专家管理

## 快速测试

### 基础测试
```bash
# 健康检查
curl http://localhost:8080/actuator/health

# 查看API文档
curl http://localhost:8080/v3/api-docs

# 测试积分规则查询
curl http://localhost:8080/api/point-rules
```

### 创建测试数据
```bash
# 创建积分规则
curl -X POST http://localhost:8080/api/point-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"测试规则","ruleCode":"TEST001","pointType":1,"pointValue":100}'

# 创建转换规则  
curl -X POST http://localhost:8080/api/conversion-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"积分学分转换","conversionRatio":10.0}'

# 创建机构
curl -X POST http://localhost:8080/api/institutions \
  -H "Content-Type: application/json" \
  -d '{"institutionName":"测试大学","institutionCode":"TEST_UNIV","institutionType":1}'
```

---

💡 **提示**: 详细的接口参数和响应示例请参考 Swagger UI 文档 