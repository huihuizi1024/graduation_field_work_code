# 常见问题解答 (FAQ)

## 🔧 环境配置问题

### Q1: Java版本不兼容怎么办？
**A**: 本项目需要 Java 17+
```bash
# 检查Java版本
java -version

# 安装JDK 17
# MacOS: brew install openjdk@17
# Linux: sudo apt install openjdk-17-jdk
```

### Q2: Docker启动MySQL失败？
**A**: 检查端口占用和Docker状态
```bash
# 检查3306端口占用
lsof -i :3306

# 重启Docker服务
sudo systemctl restart docker

# 重新启动数据库
./start_database.sh
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

# 3. 清理并重新编译
mvn clean compile

# 4. 查看详细错误日志
mvn spring-boot:run -X
```

### Q5: 前端启动失败或白屏？
**A**: 前端问题排查步骤
```bash
# 1. 清理依赖并重新安装
cd frontend
rm -rf node_modules package-lock.json
npm install

# 2. 检查Node.js版本 (需要16+)
node --version

# 3. 启动开发服务器
npm start
```

### Q6: API接口调用失败？
**A**: 接口调用问题排查
```bash
# 1. 检查后端是否启动
curl http://localhost:8080/v3/api-docs

# 2. 检查跨域配置
# 前端package.json中应有 "proxy": "http://localhost:8080"

# 3. 测试API
curl -X GET http://localhost:8080/api/point-rules
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

# 3. 重启MySQL容器
docker restart mysql-internship
```

### Q8: 中文数据乱码？
**A**: 字符编码问题解决
```sql
-- 1. 检查数据库字符集
SHOW VARIABLES LIKE 'character_set%';

-- 2. 运行修复脚本 (如果需要)
SOURCE fix_encoding.sql;
```

### Q9: 数据表没有自动创建？
**A**: 表创建问题排查
```bash
# 1. 检查JPA配置
# spring.jpa.hibernate.ddl-auto=update

# 2. 手动运行SQL脚本
docker exec -i mysql-internship mysql -u root -p123456 internship_db < database_setup.sql

# 3. 查看应用启动日志中的Hibernate信息
```

## 🎨 前端开发问题

### Q10: Ant Design组件样式异常？
**A**: UI组件问题排查
```bash
# 1. 确保正确导入样式
# App.js 中应有 import 'antd/dist/reset.css';

# 2. 清理缓存重新启动
npm start -- --reset-cache

# 3. 检查Ant Design版本
npm list antd
```

### Q11: 注册表单验证不生效？
**A**: 表单验证问题
```jsx
// 确保正确使用Form.Item和验证规则
<Form.Item
  name="socialCreditCode"
  rules={[
    { required: true, message: '请输入统一社会信用代码' },
    { validator: (_, value) => validateSocialCreditCode(value) }
  ]}
>
  <Input placeholder="请输入18位统一社会信用代码" />
</Form.Item>
```

### Q12: 省市区级联选择不正常？
**A**: 级联选择问题
```javascript
// 检查数据文件是否正确导入
import { provinces, getCitiesByProvinceCode, getDistrictsByCityCode } from '../data/regions';

// 确保级联逻辑正确
const handleProvinceChange = (provinceCode) => {
  const cities = getCitiesByProvinceCode(provinceCode);
  setCityOptions(cities);
  setDistrictOptions([]); // 清空区县选项
};
```

## 🚀 部署问题

### Q13: 生产环境部署失败？
**A**: 部署问题排查
```bash
# 1. 检查JAR包是否正确生成
mvn clean package -DskipTests
ls -l target/*.jar

# 2. 检查服务器环境
java -version
docker --version

# 3. 查看服务日志
journalctl -u internship -f
```

### Q14: 性能问题如何优化？
**A**: 性能优化建议
```properties
# 1. JVM参数优化
-Xmx2g -Xms1g -XX:+UseG1GC

# 2. 数据库连接池优化
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5

# 3. 启用缓存
spring.cache.type=redis
```

## 📞 获取帮助

### 如何获取更多帮助？
1. **查看日志**: 应用日志通常包含详细的错误信息
2. **检查配置**: 验证数据库连接、端口配置等
3. **清理重启**: 清理缓存、重新编译、重启服务
4. **查阅文档**: 参考项目中的详细技术文档

### 调试技巧
```bash
# 1. 开启详细日志
mvn spring-boot:run -Ddebug=true

# 2. 查看网络请求 (浏览器F12)
# 检查API调用和响应

# 3. 数据库直接查询
docker exec -it mysql-internship mysql -u root -p123456 internship_db

# 4. 健康检查
curl http://localhost:8080/actuator/health
```

---

💡 **提示**: 大多数问题都与环境配置、数据库连接或端口冲突有关。按照上述步骤逐一排查，通常可以快速解决问题。 
💡 **提示**: 遇到问题时，请先查看相关日志信息，这样能更快定位问题原因。 