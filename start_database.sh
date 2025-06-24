#!/bin/bash

# ========================================
# 终身学习学分银行平台积分管理系统
# MySQL 8.0 数据库快速启动脚本
# 作者: huihuizi1024
# 日期: 2025.6.22
# ========================================

set -e

echo "🚀 启动终身学习学分银行平台积分管理系统数据库..."
echo "=========================================="

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker未安装，请先安装Docker"
    echo "安装指南: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ 错误: Docker Compose未安装，请先安装Docker Compose"
    echo "安装指南: https://docs.docker.com/compose/install/"
    exit 1
fi

# 检查必要文件是否存在
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ 错误: docker-compose.yml文件不存在"
    exit 1
fi

if [ ! -f "database_setup.sql" ]; then
    echo "❌ 错误: database_setup.sql文件不存在"
    exit 1
fi

# 停止现有容器（如果存在）
echo "🔄 检查并停止现有容器..."
if docker ps -a | grep -q mysql-internship; then
    echo "🛑 停止现有MySQL容器..."
    docker-compose down
fi

# 启动MySQL服务
echo "🐬 启动MySQL 8.0服务..."
docker-compose up -d

# 等待MySQL服务就绪
echo "⏳ 等待MySQL服务启动..."
sleep 10

# 检查服务状态
MAX_ATTEMPTS=30
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    if docker exec mysql-internship mysqladmin ping -h localhost -u root -p123456 --silent; then
        echo "✅ MySQL服务已就绪！"
        break
    else
        echo "⏳ MySQL服务启动中... (尝试 $ATTEMPT/$MAX_ATTEMPTS)"
        sleep 2
        ATTEMPT=$((ATTEMPT + 1))
    fi
done

if [ $ATTEMPT -gt $MAX_ATTEMPTS ]; then
    echo "❌ MySQL服务启动超时，请检查日志："
    echo "docker-compose logs mysql"
    exit 1
fi

# 验证数据库和表
echo "🔍 验证数据库设置..."
TABLES_COUNT=$(docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -se "SHOW TABLES;" | wc -l)

if [ $TABLES_COUNT -eq 3 ]; then
    echo "✅ 数据库表创建成功！"
    
    # 显示数据统计
    echo "📊 数据库统计信息："
    docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -se "
    SELECT 'point_rule' as table_name, COUNT(*) as record_count FROM point_rule
    UNION ALL
    SELECT 'conversion_rule' as table_name, COUNT(*) as record_count FROM conversion_rule  
    UNION ALL
    SELECT 'institution' as table_name, COUNT(*) as record_count FROM institution;"
else
    echo "⚠️  警告: 数据库表可能未正确创建，检测到 $TABLES_COUNT 个表"
fi

# 显示连接信息
echo ""
echo "🎉 数据库启动完成！"
echo "=========================================="
echo "📋 连接信息："
echo "   数据库地址: localhost:3306"
echo "   数据库名称: internship_db"
echo "   用户名: internship_user"
echo "   密码: internship_pass"
echo "   Root密码: 123456"
echo ""
echo "🔧 管理命令："
echo "   查看服务状态: docker-compose ps"
echo "   查看日志: docker-compose logs mysql"
echo "   连接数据库: docker exec -it mysql-internship mysql -u internship_user -pinternship_pass internship_db"
echo "   停止服务: docker-compose down"
echo ""
echo "📚 更多信息请查看: DATABASE_GUIDE.md"
echo "🚀 现在可以启动Spring Boot应用程序了！"
echo "==========================================" 