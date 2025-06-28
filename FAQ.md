# 常见问题解答 (FAQ)

## 🔧 环境配置问题

### Q1: Java版本不兼容怎么办？
**A**: 本项目需要 Java 17+
```bash
# 检查Java版本
java -version

# 如果版本不对，请安装JDK 17
# Windows: 下载Oracle JDK 17或OpenJDK 17
# MacOS: brew install openjdk@17
# Linux: sudo apt install openjdk-17-jdk
```

### Q2: Docker启动MySQL失败？
**A**: 检查端口占用和Docker状态
```bash
# 检查3306端口是否被占用
netstat -an | grep 3306
lsof -i :3306

# 检查Docker是否运行
docker --version
docker ps

# 重启Docker服务
# Windows: 重启Docker Desktop
# Linux: sudo systemctl restart docker
```

### Q3: Maven依赖下载失败？
**A**: 配置国内镜像源
```xml
<!-- 在 ~/.m2/settings.xml 中添加阿里云镜像 -->
<mirrors>
  <mirror>
    <id>aliyunmaven</id>
    <mirrorOf>*</mirrorOf>
    <name>阿里云公共仓库</name>
    <url>https://maven.aliyun.com/repository/public</url>
  </mirror>
</mirrors>
```

## 🚀 启动问题

### Q4: Spring Boot启动失败？
**A**: 常见启动问题排查
```bash
# 1. 检查数据库连接
docker ps | grep mysql-internship

# 2. 检查端口占用
lsof -i :8080

# 3. 查看详细错误日志
mvn spring-boot:run -X

# 4. 清理并重新编译
mvn clean compile
```

### Q5: 前端启动失败或白屏？
**A**: 前端问题排查步骤
```bash
# 1. 清理node_modules
cd frontend
rm -rf node_modules package-lock.json
npm install

# 2. 检查Node.js版本 (需要16+)
node --version

# 3. 启动开发服务器
npm start

# 4. 检查浏览器控制台错误
# 按F12打开开发者工具查看错误信息
```

### Q6: API接口调用失败？
**A**: 接口调用问题排查
```bash
# 1. 检查后端是否启动
curl http://localhost:8080/v3/api-docs

# 2. 检查跨域配置
# 前端package.json中应有 "proxy": "http://localhost:3000"

# 3. 使用curl测试API
curl -X GET http://localhost:8080/api/point-rules

# 4. 检查请求格式
curl -X POST http://localhost:8080/api/point-rules \
  -H "Content-Type: application/json" \
  -d '{"ruleName":"测试","ruleCode":"TEST"}'
```

## 💾 数据库问题

### Q7: 数据库连接失败？
**A**: 数据库连接问题排查
```bash
# 1. 检查MySQL容器状态
docker ps | grep mysql-internship
docker logs mysql-internship

# 2. 测试数据库连接
docker exec -it mysql-internship mysql -u root -p123456

# 3. 检查数据库配置
# application.properties 中的数据库URL是否正确

# 4. 重启MySQL容器
docker restart mysql-internship
```

### Q8: 数据表没有自动创建？
**A**: 表创建问题排查
```bash
# 1. 检查JPA配置
# spring.jpa.hibernate.ddl-auto=update

# 2. 检查实体类扫描
# @Entity 注解是否正确

# 3. 手动运行SQL脚本
docker exec -i mysql-internship mysql -u root -p123456 internship_db < database_setup.sql

# 4. 查看应用启动日志
# 关注 Hibernate 相关日志信息
```

### Q9: 中文数据乱码？
**A**: 字符编码问题解决
```sql
-- 1. 检查数据库字符集
SHOW VARIABLES LIKE 'character_set%';

-- 2. 设置正确的字符集
ALTER DATABASE internship_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. 检查连接URL
jdbc:mysql://localhost:3306/internship_db?useUnicode=true&characterEncoding=utf8mb4

-- 4. 运行修复脚本
SOURCE fix_encoding.sql;
```

## 🎨 前端开发问题

### Q10: Ant Design组件样式异常？
**A**: UI组件问题排查
```bash
# 1. 检查Ant Design版本
npm list antd

# 2. 确保正确导入样式
# App.js 中应有 import 'antd/dist/reset.css';

# 3. 检查CSS冲突
# 使用浏览器开发者工具检查样式覆盖

# 4. 清理缓存重新启动
npm start -- --reset-cache
```

### Q11: 路由跳转失败？
**A**: React Router问题
```jsx
// 1. 检查路由配置
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 2. 确保正确的导航方式
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/point-rules');

// 3. 检查路由路径是否正确
// 路径要与组件定义的路径完全匹配
```

### Q12: 表单验证不生效？
**A**: 表单验证问题
```jsx
// 1. 确保正确使用Form.Item
<Form.Item
  name="ruleName"
  rules={[{ required: true, message: '请输入规则名称' }]}
>
  <Input />
</Form.Item>

// 2. 检查表单提交处理
const onFinish = (values) => {
  console.log('验证通过:', values);
};

// 3. 使用form实例进行手动验证
const [form] = Form.useForm();
form.validateFields();
```

## 🚀 部署问题

### Q13: 生产环境部署失败？
**A**: 部署问题排查
```bash
# 1. 检查JAR包是否正确生成
mvn clean package -DskipTests
ls -l target/*.jar

# 2. 检查生产环境配置
# application-prod.properties 配置是否正确

# 3. 检查服务器环境
java -version
docker --version

# 4. 查看应用日志
tail -f /app/internship/logs/field-work-system.log
```

### Q14: Nginx反向代理配置问题？
**A**: Nginx配置检查
```bash
# 1. 测试Nginx配置
sudo nginx -t

# 2. 检查代理配置
# location /api { proxy_pass http://localhost:8080; }

# 3. 重启Nginx
sudo systemctl restart nginx

# 4. 查看Nginx日志
sudo tail -f /var/log/nginx/error.log
```

## 📊 性能问题

### Q15: 应用响应缓慢？
**A**: 性能优化建议
```bash
# 1. 检查数据库连接池
# spring.datasource.hikari.maximum-pool-size=20

# 2. 启用SQL日志查看慢查询
# spring.jpa.show-sql=true

# 3. 检查内存使用
# 启动时设置JVM参数: -Xmx2g -Xms1g

# 4. 使用性能监控工具
# 集成 Spring Boot Actuator
```

### Q16: 前端加载慢？
**A**: 前端性能优化
```bash
# 1. 生产构建优化
npm run build

# 2. 使用代码分割
# React.lazy() 和 Suspense

# 3. 启用Gzip压缩
# Nginx配置 gzip on;

# 4. 使用CDN加速静态资源
```

## 🔒 安全问题

### Q17: 生产环境安全配置？
**A**: 安全配置检查清单
```properties
# 1. 修改默认密码
spring.datasource.password=${DB_PASSWORD:your_strong_password}

# 2. 禁用敏感端点
management.endpoints.web.exposure.include=health,info

# 3. 启用HTTPS
server.ssl.enabled=true

# 4. 设置安全头
security.headers.frame=deny
```

## 🛠️ 开发工具问题

### Q18: IDEA中项目导入失败？
**A**: IDE配置问题
```bash
# 1. 确保安装了必要插件
# - Lombok Plugin
# - Spring Boot Plugin

# 2. 刷新Maven项目
# 右键项目 -> Maven -> Reload project

# 3. 设置正确的JDK版本
# File -> Project Structure -> Project SDK

# 4. 重新导入项目
# File -> New -> Project from Existing Sources
```

### Q19: Git提交问题？
**A**: 版本控制问题
```bash
# 1. 检查.gitignore文件
# 确保排除了target/, node_modules/等目录

# 2. 处理文件冲突
git status
git add .
git commit -m "解决冲突"

# 3. 同步远程仓库
git pull origin main
git push origin main
```

## 📞 获取帮助

### 联系方式
- **GitHub Issues**: 在项目仓库提交Issue
- **项目文档**: 查看详细的技术文档
- **开发者**: huihuizi1024

### 调试技巧
1. **开启详细日志**: 修改日志级别为DEBUG
2. **使用断点调试**: 在IDE中设置断点
3. **查看网络请求**: 使用浏览器开发者工具
4. **数据库查询**: 直接连接数据库查看数据

---

💡 **提示**: 遇到问题时，请先查看相关日志信息，这样能更快定位问题原因。 