#!/bin/bash

# ========================================
# 终身学习学分银行平台积分管理系统
# MySQL 8.0 数据库快速启动脚本 (增强版)
# 作者: huihuizi1024
# 日期: 2025.7.2
# 版本: v2.0
# ========================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 输出函数
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_step() {
    echo -e "${PURPLE}🚀 $1${NC}"
}

print_separator() {
    echo -e "${CYAN}==========================================${NC}"
}

# 开始执行
clear
echo -e "${CYAN}"
cat << "EOF"
  ╔═══════════════════════════════════════════════════════════╗
  ║           终身学习学分银行平台积分管理系统                 ║
  ║               MySQL 8.0 数据库启动器                     ║
  ║                    增强版 v2.0                           ║
  ╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

print_separator
print_step "开始启动数据库服务..."
print_separator

# 检查系统环境
print_info "正在检查系统环境..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    print_error "Docker未安装，请先安装Docker"
    echo "安装指南: https://docs.docker.com/get-docker/"
    exit 1
fi
print_success "Docker已安装: $(docker --version)"

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose未安装，请先安装Docker Compose"
    echo "安装指南: https://docs.docker.com/compose/install/"
    exit 1
fi
print_success "Docker Compose已安装: $(docker-compose --version)"

# 检查Docker服务是否运行
if ! docker info &> /dev/null; then
    print_error "Docker服务未运行，请启动Docker服务"
    exit 1
fi
print_success "Docker服务正常运行"

# 检查必要文件是否存在
print_info "检查必要文件..."
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml文件不存在"
    exit 1
fi
print_success "docker-compose.yml文件存在"

if [ ! -f "database_setup.sql" ]; then
    print_error "database_setup.sql文件不存在"
    exit 1
fi
print_success "database_setup.sql文件存在"

# 检查端口占用
print_info "检查端口占用..."
if netstat -tuln 2>/dev/null | grep -q ":3306 "; then
    print_warning "端口3306已被占用，将停止现有服务"
fi

# 停止现有容器和数据卷，确保全新启动
print_step "清理旧环境..."
if docker ps -a | grep -q mysql-internship; then
    print_info "发现旧容器，正在清理..."
    docker-compose down -v 2>/dev/null || true
    print_success "旧环境清理完成"
else
    print_info "未发现旧容器，跳过清理步骤"
fi

# 启动MySQL服务
print_step "启动MySQL 8.0服务..."
if docker-compose up -d; then
    print_success "MySQL服务启动命令执行成功"
else
    print_error "MySQL服务启动失败"
    exit 1
fi

# 等待MySQL服务就绪
print_step "等待MySQL服务初始化..."
print_info "这可能需要30-60秒，请耐心等待..."

# 进度条函数
show_progress() {
    local duration=$1
    local steps=20
    local step_duration=$((duration / steps))
    
    for ((i=0; i<=steps; i++)); do
        local progress=$((i * 100 / steps))
        local filled=$((i * 50 / steps))
        local empty=$((50 - filled))
        
        printf "\r${BLUE}[$(printf "%*s" $filled | tr ' ' '=')$(printf "%*s" $empty)${BLUE}] %d%%${NC}" $progress
        sleep $step_duration
    done
    echo
}

# 显示进度条
show_progress 10

# 检查服务状态
print_step "检查MySQL服务状态..."
MAX_ATTEMPTS=30
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    if docker exec mysql-internship mysqladmin ping -h localhost -u root -p123456 --silent 2>/dev/null; then
        print_success "MySQL服务已就绪！"
        break
    else
        printf "\r${YELLOW}⏳ MySQL服务启动中... (尝试 $ATTEMPT/$MAX_ATTEMPTS)${NC}"
        sleep 2
        ATTEMPT=$((ATTEMPT + 1))
    fi
done

echo # 换行

if [ $ATTEMPT -gt $MAX_ATTEMPTS ]; then
    print_error "MySQL服务启动超时"
    print_info "请检查日志："
    echo "docker-compose logs mysql"
    exit 1
fi

# 检查数据库连接
print_step "验证数据库连接..."
if docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -e "SELECT 1;" &>/dev/null; then
    print_success "数据库连接测试成功"
else
    print_warning "使用业务用户连接失败，检查root用户连接..."
    if docker exec mysql-internship mysql -u root -p123456 -e "SELECT 1;" &>/dev/null; then
        print_success "Root用户连接正常"
    else
        print_error "数据库连接失败"
        exit 1
    fi
fi

# 验证数据库和表
print_step "验证数据库结构和数据..."

# 检查表数量
TABLES_COUNT=$(docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -se "SHOW TABLES;" 2>/dev/null | wc -l)

if [ $TABLES_COUNT -ge 10 ]; then
    print_success "数据库表创建成功！(共 $TABLES_COUNT 张表)"
else
    print_warning "数据库表数量异常，检测到 $TABLES_COUNT 个表"
fi

# 验证核心数据
print_info "验证核心数据..."
USER_COUNT=$(docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -se "SELECT COUNT(*) FROM user;" 2>/dev/null || echo "0")
INSTITUTION_COUNT=$(docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -se "SELECT COUNT(*) FROM institution;" 2>/dev/null || echo "0")
PRODUCT_COUNT=$(docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -se "SELECT COUNT(*) FROM product;" 2>/dev/null || echo "0")

print_info "数据统计："
echo "  👥 用户数量: $USER_COUNT"
echo "  🏢 机构数量: $INSTITUTION_COUNT"  
echo "  🛍️  商品数量: $PRODUCT_COUNT"

if [ $USER_COUNT -gt 0 ] && [ $INSTITUTION_COUNT -gt 0 ] && [ $PRODUCT_COUNT -gt 0 ]; then
    print_success "测试数据验证通过"
else
    print_warning "部分测试数据可能缺失"
fi

# 显示测试用户信息
print_step "测试用户信息："
echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│                      测试账户信息                          │${NC}"
echo -e "${CYAN}├─────────────────────────────────────────────────────────────┤${NC}"
echo -e "${CYAN}│ 用户名      │ 密码        │ 角色     │ 手机号      │ 积分 │${NC}"
echo -e "${CYAN}├─────────────────────────────────────────────────────────────┤${NC}"
echo -e "${CYAN}│ student01   │ password123 │ 学生     │ 13800138001 │ 150  │${NC}"
echo -e "${CYAN}│ teacher01   │ password123 │ 教师     │ 13800138002 │ 280  │${NC}"
echo -e "${CYAN}│ expert01    │ password123 │ 专家     │ 13800138003 │ 500  │${NC}"
echo -e "${CYAN}│ admin       │ password123 │ 管理员   │ 13800138000 │ 1000 │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"

# 显示连接信息
print_separator
print_success "🎉 数据库启动完成！"
print_separator

echo -e "${BLUE}📋 连接信息：${NC}"
echo "   🌐 数据库地址: localhost:3306"
echo "   💾 数据库名称: internship_db"
echo "   👤 用户名: internship_user"
echo "   🔐 密码: internship_pass"
echo "   🔑 Root密码: 123456"
echo ""

echo -e "${BLUE}🔧 管理命令：${NC}"
echo "   📊 查看服务状态: docker-compose ps"
echo "   📝 查看日志: docker-compose logs mysql"
echo "   🔗 连接数据库: docker exec -it mysql-internship mysql -u internship_user -pinternship_pass internship_db"
echo "   ⏹️  停止服务: docker-compose down"
echo ""

echo -e "${BLUE}🧪 测试建议：${NC}"
echo "   1. 启动Spring Boot应用: mvn spring-boot:run"
echo "   2. 启动前端应用: cd frontend && npm start"
echo "   3. 测试短信验证码: 使用手机号 13800138001"
echo "   4. 访问Swagger UI: http://localhost:8080/swagger-ui/index.html"
echo ""

echo -e "${BLUE}📚 功能特性：${NC}"
echo "   ✨ 完整的测试数据 (用户、机构、商品、积分流水)"
echo "   ✨ 短信验证码功能 (模拟实现)"
echo "   ✨ 积分管理系统 (获得、消费、转换)"
echo "   ✨ 积分商城功能 (商品兑换)"
echo "   ✨ 多角色权限管理"
echo ""

print_separator
print_success "🚀 现在可以启动应用程序开始测试了！"
print_separator 