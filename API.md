# API接口文档

## 概述

本文档详细描述了终身学习学分银行平台积分管理系统的所有REST API接口。

### 基础信息

- **API基础URL**: `http://localhost:8080`
- **数据格式**: JSON
- **字符编码**: UTF-8
- **API文档**: http://localhost:8080/swagger-ui/index.html

### 统一响应格式

所有API接口都使用统一的响应格式：

```json
{
  "success": true,
  "message": "操作成功",
  "data": {}, 
  "timestamp": "2025-06-22T16:44:13"
}
```

### 分页响应格式

分页查询接口使用以下响应格式：

```json
{
  "success": true,
  "message": "查询成功",
  "data": {
    "page": 1,
    "size": 10,
    "total": 100,
    "data": []
  },
  "timestamp": "2025-06-22T16:44:13"
}
```

## 1. 积分规则管理模块

### 1.1 创建积分规则

**接口描述**: 新建积分规则，需要管理员权限

- **URL**: `/api/point-rules`
- **方法**: `POST`
- **请求头**: `Content-Type: application/json`

**请求参数**:
```json
{
  "ruleName": "学习积分规则",
  "ruleCode": "STUDY_POINTS",
  "pointType": 1,
  "points": 100,
  "description": "完成学习任务获得积分",
  "applicableObject": 1,
  "validStartTime": "2025-01-01T00:00:00",
  "validEndTime": "2025-12-31T23:59:59"
}
```

**测试命令**:
```bash
curl -X POST http://localhost:8080/api/point-rules \
  -H "Content-Type: application/json" \
  -d '{
    "ruleName": "测试积分规则",
    "ruleCode": "TEST001",
    "pointType": 1,
    "points": 100,
    "description": "这是一个测试规则"
  }'
```

### 1.2 分页查询积分规则

**接口描述**: 支持多条件筛选的分页查询

- **URL**: `/api/point-rules`
- **方法**: `GET`

**查询参数**:
- `page`: 页码，从1开始，默认1
- `size`: 每页大小，默认10
- `ruleName`: 规则名称（模糊查询）
- `ruleCode`: 规则编码
- `pointType`: 积分类型
- `applicableObject`: 适用对象
- `status`: 状态
- `reviewStatus`: 审核状态

**测试命令**:
```bash
curl "http://localhost:8080/api/point-rules?page=1&size=10&ruleName=学习"
```

### 1.3 获取积分规则详情

**接口描述**: 根据ID获取积分规则详细信息

- **URL**: `/api/point-rules/{id}`
- **方法**: `GET`

**路径参数**:
- `id`: 积分规则ID

**测试命令**:
```bash
curl http://localhost:8080/api/point-rules/1
```

### 1.4 更新积分规则

**接口描述**: 更新指定ID的积分规则

- **URL**: `/api/point-rules/{id}`
- **方法**: `PUT`
- **请求头**: `Content-Type: application/json`

**测试命令**:
```bash
curl -X PUT http://localhost:8080/api/point-rules/1 \
  -H "Content-Type: application/json" \
  -d '{
    "ruleName": "更新后的积分规则",
    "points": 150
  }'
```

### 1.5 删除积分规则

**接口描述**: 软删除指定ID的积分规则

- **URL**: `/api/point-rules/{id}`
- **方法**: `DELETE`

**测试命令**:
```bash
curl -X DELETE http://localhost:8080/api/point-rules/1
```

### 1.6 审核积分规则

**接口描述**: 对积分规则进行审核通过或拒绝

- **URL**: `/api/point-rules/{id}/review`
- **方法**: `POST`

**请求参数**:
- `reviewStatus`: 审核结果（1-通过，2-拒绝）
- `reviewComment`: 审核意见

**测试命令**:
```bash
curl -X POST "http://localhost:8080/api/point-rules/1/review?reviewStatus=1&reviewComment=审核通过"
```

### 1.7 启用/禁用积分规则

**接口描述**: 修改积分规则的启用状态

- **URL**: `/api/point-rules/{id}/status`
- **方法**: `POST`

**请求参数**:
- `status`: 状态（1-启用，0-禁用）

**测试命令**:
```bash
curl -X POST "http://localhost:8080/api/point-rules/1/status?status=1"
```

### 1.8 批量删除积分规则

**接口描述**: 批量软删除积分规则

- **URL**: `/api/point-rules/batch`
- **方法**: `DELETE`
- **请求头**: `Content-Type: application/json`

**请求参数**:
```json
[1, 2, 3, 4, 5]
```

**测试命令**:
```bash
curl -X DELETE http://localhost:8080/api/point-rules/batch \
  -H "Content-Type: application/json" \
  -d '[1, 2, 3]'
```

### 1.9 获取积分规则统计

**接口描述**: 获取积分规则的统计信息

- **URL**: `/api/point-rules/statistics`
- **方法**: `GET`

**测试命令**:
```bash
curl http://localhost:8080/api/point-rules/statistics
```

### 1.10 导出积分规则

**接口描述**: 导出积分规则数据为Excel文件

- **URL**: `/api/point-rules/export`
- **方法**: `GET`

**查询参数**:
- `ruleName`: 规则名称
- `pointType`: 积分类型
- `status`: 状态

**测试命令**:
```bash
curl -O http://localhost:8080/api/point-rules/export
```

## 2. 转换规则管理模块

### 2.1 创建转换规则

**接口描述**: 新建转换规则

- **URL**: `/api/conversion-rules`
- **方法**: `POST`
- **请求头**: `Content-Type: application/json`

**请求参数**:
```json
{
  "ruleName": "积分学分转换",
  "conversionRatio": 10.0,
  "sourceType": "积分",
  "targetType": "学分",
  "description": "10积分转换为1学分"
}
```

**测试命令**:
```bash
curl -X POST http://localhost:8080/api/conversion-rules \
  -H "Content-Type: application/json" \
  -d '{
    "ruleName": "积分学分转换",
    "conversionRatio": 10.0,
    "sourceType": "积分",
    "targetType": "学分"
  }'
```

### 2.2 分页查询转换规则

**接口描述**: 支持多条件筛选的分页查询

- **URL**: `/api/conversion-rules`
- **方法**: `GET`

**测试命令**:
```bash
curl "http://localhost:8080/api/conversion-rules?page=1&size=10"
```

### 2.3 获取转换规则详情

**接口描述**: 根据ID获取转换规则详细信息

- **URL**: `/api/conversion-rules/{id}`
- **方法**: `GET`

**测试命令**:
```bash
curl http://localhost:8080/api/conversion-rules/1
```

### 2.4 更新转换规则

**接口描述**: 更新指定ID的转换规则

- **URL**: `/api/conversion-rules/{id}`
- **方法**: `PUT`

**测试命令**:
```bash
curl -X PUT http://localhost:8080/api/conversion-rules/1 \
  -H "Content-Type: application/json" \
  -d '{"conversionRatio": 15.0}'
```

### 2.5 删除转换规则

**接口描述**: 软删除指定ID的转换规则

- **URL**: `/api/conversion-rules/{id}`
- **方法**: `DELETE`

**测试命令**:
```bash
curl -X DELETE http://localhost:8080/api/conversion-rules/1
```

### 2.6 审核转换规则

**接口描述**: 对转换规则进行审核

- **URL**: `/api/conversion-rules/{id}/review`
- **方法**: `POST`

**测试命令**:
```bash
curl -X POST "http://localhost:8080/api/conversion-rules/1/review?reviewStatus=1"
```

### 2.7 启用/禁用转换规则

**接口描述**: 修改转换规则的启用状态

- **URL**: `/api/conversion-rules/{id}/status`
- **方法**: `POST`

**测试命令**:
```bash
curl -X POST "http://localhost:8080/api/conversion-rules/1/status?status=1"
```

### 2.8 测试转换规则

**接口描述**: 测试转换规则的转换效果

- **URL**: `/api/conversion-rules/{id}/test`
- **方法**: `POST`

**测试命令**:
```bash
curl -X POST "http://localhost:8080/api/conversion-rules/1/test?inputValue=100"
```

### 2.9 获取转换比例推荐

**接口描述**: 基于历史数据获取智能转换比例推荐

- **URL**: `/api/conversion-rules/ratio-recommendations`
- **方法**: `GET`

**测试命令**:
```bash
curl http://localhost:8080/api/conversion-rules/ratio-recommendations
```

### 2.10 获取转换规则统计

**接口描述**: 获取转换规则的统计信息

- **URL**: `/api/conversion-rules/statistics`
- **方法**: `GET`

**测试命令**:
```bash
curl http://localhost:8080/api/conversion-rules/statistics
```

## 3. 机构管理模块

### 3.1 创建机构

**接口描述**: 新建教育机构

- **URL**: `/api/institutions`
- **方法**: `POST`
- **请求头**: `Content-Type: application/json`

**请求参数**:
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

**测试命令**:
```bash
curl -X POST http://localhost:8080/api/institutions \
  -H "Content-Type: application/json" \
  -d '{
    "institutionName": "测试大学",
    "institutionCode": "TEST_UNIV",
    "institutionType": 1,
    "region": "北京",
    "contactEmail": "test@university.edu"
  }'
```

### 3.2 分页查询机构

**接口描述**: 支持多条件筛选的分页查询

- **URL**: `/api/institutions`
- **方法**: `GET`

**测试命令**:
```bash
curl "http://localhost:8080/api/institutions?page=1&size=10&region=北京"
```

### 3.3 获取机构详情

**接口描述**: 根据ID获取机构详细信息

- **URL**: `/api/institutions/{id}`
- **方法**: `GET`

**测试命令**:
```bash
curl http://localhost:8080/api/institutions/1
```

### 3.4 更新机构信息

**接口描述**: 更新指定ID的机构信息

- **URL**: `/api/institutions/{id}`
- **方法**: `PUT`

**测试命令**:
```bash
curl -X PUT http://localhost:8080/api/institutions/1 \
  -H "Content-Type: application/json" \
  -d '{"contactEmail": "new@university.edu"}'
```

### 3.5 删除机构

**接口描述**: 软删除指定ID的机构

- **URL**: `/api/institutions/{id}`
- **方法**: `DELETE`

**测试命令**:
```bash
curl -X DELETE http://localhost:8080/api/institutions/1
```

### 3.6 审核机构

**接口描述**: 对机构进行审核

- **URL**: `/api/institutions/{id}/review`
- **方法**: `POST`

**测试命令**:
```bash
curl -X POST "http://localhost:8080/api/institutions/1/review?reviewStatus=1"
```

### 3.7 修改机构状态

**接口描述**: 修改机构的启用状态

- **URL**: `/api/institutions/{id}/status`
- **方法**: `POST`

**测试命令**:
```bash
curl -X POST "http://localhost:8080/api/institutions/1/status?status=1"
```

### 3.8 机构认证等级评定

**接口描述**: 对机构进行认证等级评定

- **URL**: `/api/institutions/{id}/certification`
- **方法**: `POST`

**测试命令**:
```bash
curl -X POST "http://localhost:8080/api/institutions/1/certification?certificationLevel=A"
```

### 3.9 获取机构统计

**接口描述**: 获取机构的统计信息

- **URL**: `/api/institutions/statistics`
- **方法**: `GET`

**测试命令**:
```bash
curl http://localhost:8080/api/institutions/statistics
```

### 3.10 获取区域统计

**接口描述**: 获取按区域分组的机构统计

- **URL**: `/api/institutions/region-statistics`
- **方法**: `GET`

**测试命令**:
```bash
curl http://localhost:8080/api/institutions/region-statistics
```

### 3.11 获取类型统计

**接口描述**: 获取按类型分组的机构统计

- **URL**: `/api/institutions/type-statistics`
- **方法**: `GET`

**测试命令**:
```bash
curl http://localhost:8080/api/institutions/type-statistics
```

### 3.12 导出机构信息

**接口描述**: 导出机构信息为Excel文件

- **URL**: `/api/institutions/export`
- **方法**: `GET`

**测试命令**:
```bash
curl -O http://localhost:8080/api/institutions/export
```

## 错误响应

当API调用出现错误时，会返回以下格式的响应：

```json
{
  "success": false,
  "message": "错误信息描述",
  "data": null,
  "timestamp": "2025-06-22T16:44:13"
}
```

### 常见错误代码

- **400 Bad Request**: 请求参数错误
- **401 Unauthorized**: 未授权访问
- **403 Forbidden**: 权限不足
- **404 Not Found**: 资源不存在
- **500 Internal Server Error**: 服务器内部错误

## API使用示例

### 完整流程示例

```bash
# 1. 创建机构
curl -X POST http://localhost:8080/api/institutions \
  -H "Content-Type: application/json" \
  -d '{"institutionName":"示例大学","institutionCode":"DEMO001","institutionType":1}'

# 2. 创建积分规则
curl -X POST http://localhost:8080/api/point-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"学习积分","ruleCode":"STUDY001","pointType":1,"points":100}'

# 3. 创建转换规则
curl -X POST http://localhost:8080/api/conversion-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"积分转学分","conversionRatio":10.0}'

# 4. 查询创建的数据
curl http://localhost:8080/api/institutions/statistics
curl http://localhost:8080/api/point-rules/statistics
curl http://localhost:8080/api/conversion-rules/statistics
```

## 注意事项

1. 所有时间字段使用ISO 8601格式：`YYYY-MM-DDTHH:mm:ss`
2. 分页查询的页码从1开始
3. 删除操作均为软删除，不会物理删除数据
4. 审核状态：0-待审核，1-审核通过，2-审核拒绝
5. 启用状态：0-禁用，1-启用 