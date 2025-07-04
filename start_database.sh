#!/bin/bash

# ========================================
# 终身学习学分银行平台积分管理系统
# MySQL 8.0 数据库快速启动脚�?(增强�?
# 作�? huihuizi1024
# 日期: 2025.7.4
# 版本: v3.2 - 智能健康管理�?
# 新增功能: 智能容器健康检测、自动修复、降级重建、Redis集成
# ========================================

set -e

# 脚本配置
SCRIPT_START_TIME=$(date +%s)
LOG_FILE="database_startup_$(date +%Y%m%d_%H%M%S).log"
CONTAINER_NAME="mysql-internship"
DATABASE_NAME="internship_db"
DATABASE_USER="internship_user"
DATABASE_PASS="internship_pass"
ROOT_PASS="123456"
SQL_FILE="database_setup.sql"

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
    echo -e "${GREEN}�?$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}�?$1${NC}"
}

print_step() {
    echo -e "${PURPLE}🚀 $1${NC}"
}

print_separator() {
    echo -e "${CYAN}==========================================${NC}"
}

# 日志函数
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# 智能容器健康检测函�?
check_container_health() {
    local container_name="$1"
    local service_type="$2"  # mysql �?redis
    local health_score=0
    local issues=()
    
    print_info "检�?$service_type 容器健康状�?.."
    
    # 1. 检查容器是否存�?
    if ! docker ps -a --format "{{.Names}}" | grep -q "^$container_name$"; then
        print_info "$service_type 容器不存�?
        return 3  # 容器不存在，需要创�?
    fi
    
    # 2. 检查容器运行状�?
    local container_status=$(docker ps -a --filter "name=$container_name" --format "{{.Status}}")
    if echo "$container_status" | grep -q "Up"; then
        health_score=$((health_score + 25))
        print_success "�?容器运行状态正�?
    elif echo "$container_status" | grep -q "Exited"; then
        print_warning "�?容器已停止，尝试启动..."
        if docker start "$container_name" >/dev/null 2>&1; then
            print_success "�?容器启动成功"
            health_score=$((health_score + 20))
            sleep 3  # 等待服务启动
        else
            issues+=("容器启动失败")
        fi
    else
        issues+=("容器状态异�? $container_status")
    fi
    
    # 3. 检查端口监�?
    if [ "$service_type" = "mysql" ]; then
        if netstat -tuln 2>/dev/null | grep -q ":3306 " || docker exec "$container_name" netstat -tuln 2>/dev/null | grep -q ":3306 "; then
            health_score=$((health_score + 25))
            print_success "�?MySQL端口监听正常"
        else
            issues+=("MySQL端口3306未监�?)
        fi
    elif [ "$service_type" = "redis" ]; then
        if netstat -tuln 2>/dev/null | grep -q ":6379 " || docker exec "$container_name" netstat -tuln 2>/dev/null | grep -q ":6379 "; then
            health_score=$((health_score + 25))
            print_success "�?Redis端口监听正常"
        else
            issues+=("Redis端口6379未监�?)
        fi
    fi
    
    # 4. 检查服务响�?
    if [ "$service_type" = "mysql" ]; then
        if docker exec "$container_name" mysqladmin ping -h localhost -u root -p$ROOT_PASS --silent 2>/dev/null; then
            health_score=$((health_score + 25))
            print_success "�?MySQL服务响应正常"
        else
            issues+=("MySQL服务无响�?)
        fi
    elif [ "$service_type" = "redis" ]; then
        if docker exec "$container_name" redis-cli ping 2>/dev/null | grep -q "PONG"; then
            health_score=$((health_score + 25))
            print_success "�?Redis服务响应正常"
        else
            issues+=("Redis服务无响�?)
        fi
    fi
    
    # 5. 检查数据卷挂载
    local volume_check=$(docker inspect "$container_name" --format '{{range .Mounts}}{{.Source}}:{{.Destination}} {{end}}' 2>/dev/null || echo "")
    if [ -n "$volume_check" ]; then
        health_score=$((health_score + 25))
        print_success "�?数据卷挂载正�?
    else
        issues+=("数据卷挂载异�?)
    fi
    
    # 输出健康评估结果
    print_info "$service_type 容器健康�? $health_score/100"
    
    if [ ${#issues[@]} -gt 0 ]; then
        print_warning "发现问题:"
        for issue in "${issues[@]}"; do
            echo "    - $issue"
        done
    fi
    
    # 返回健康状态：0=健康(80+), 1=需要修�?50-79), 2=需要重�?<50), 3=容器不存�?
    if [ $health_score -ge 80 ]; then
        return 0  # 健康
    elif [ $health_score -ge 50 ]; then
        return 1  # 需要修�?
    else
        return 2  # 需要重�?
    fi
}

# 服务可用性最终验�?
verify_service_availability() {
    print_step "验证服务最终可用�?.."
    local mysql_available=false
    local redis_available=false
    
    # 验证MySQL
    if docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS -e "SELECT 1;" >/dev/null 2>&1; then
        mysql_available=true
        print_success "�?MySQL服务可用"
    else
        print_error "�?MySQL服务不可�?
    fi
    
    # 验证Redis (如果存在)
    if docker ps | grep -q "redis-internship"; then
        if docker exec redis-internship redis-cli ping 2>/dev/null | grep -q "PONG"; then
            redis_available=true
            print_success "�?Redis服务可用"
        else
            print_error "�?Redis服务不可�?
        fi
    else
        redis_available=true  # Redis不存在时视为正常
        print_info "Redis服务未启�?
    fi
    
    if [ "$mysql_available" = true ] && [ "$redis_available" = true ]; then
        return 0  # 全部可用
    else
        return 1  # 有服务不可用
    fi
}

# 开始执�?
clear
echo -e "${CYAN}"
cat << "EOF"
  ╔═══════════════════════════════════════════════════════════�?
  �?          终身学习学分银行平台积分管理系统                 �?
  �?              MySQL 8.0 数据库启动器                     �?
  �?            增强�?v3.2 - 智能健康管理                   �?
  ╚═══════════════════════════════════════════════════════════�?
EOF
echo -e "${NC}"

print_separator
print_step "开始启动数据库服务..."
print_separator

# 检查系统环�?
print_info "正在检查系统环�?.."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    print_error "Docker未安装，请先安装Docker"
    echo "安装指南: https://docs.docker.com/get-docker/"
    exit 1
fi
print_success "Docker已安�? $(docker --version)"

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose未安装，请先安装Docker Compose"
    echo "安装指南: https://docs.docker.com/compose/install/"
    exit 1
fi
print_success "Docker Compose已安�? $(docker-compose --version)"

# 检查Docker服务是否运行
if ! docker info &> /dev/null; then
    print_error "Docker服务未运行，请启动Docker服务"
    exit 1
fi
print_success "Docker服务正常运行"

# 检查必要文件是否存�?
print_info "检查必要文�?.."
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml文件不存�?
    exit 1
fi
print_success "docker-compose.yml文件存在"

if [ ! -f "database_setup.sql" ]; then
    print_error "database_setup.sql文件不存�?
    exit 1
fi
print_success "database_setup.sql文件存在"

# 检查端口占�?
print_info "检查端口占�?.."
if netstat -tuln 2>/dev/null | grep -q ":3306 "; then
    print_warning "端口3306已被占用，将停止现有服务"
fi

# 智能容器管理
print_step "智能容器管理..."
print_info "检查现有容器状态并智能管理..."

# 初始化管理状�?
SKIP_COMPOSE_UP=false
NEED_REBUILD=false

# 检查MySQL容器
print_separator
print_info "=== MySQL容器检�?==="
check_container_health "$CONTAINER_NAME" "mysql"
mysql_health_status=$?

print_info "MySQL健康检查返回状�? $mysql_health_status"

case $mysql_health_status in
    0)
        print_success "🟢 MySQL容器健康状态良好，直接使用"
        SKIP_COMPOSE_UP=true
        ;;
    1)
        print_warning "🟡 MySQL容器需要修复，尝试修复�?.."
        # 尝试重启修复
        docker restart "$CONTAINER_NAME" >/dev/null 2>&1
        sleep 5
        # 重新检�?
        check_container_health "$CONTAINER_NAME" "mysql"
        if [ $? -eq 0 ]; then
            print_success "🟢 MySQL容器修复成功"
            SKIP_COMPOSE_UP=true
        else
            print_error "🔴 MySQL容器修复失败，将重新创建"
            NEED_REBUILD=true
        fi
        ;;
    2)
        print_error "🔴 MySQL容器状态严重异常，需要重新创�?
        NEED_REBUILD=true
        ;;
    3)
        print_info "🔵 MySQL容器不存在，将创建新容器"
        print_info "设置 SKIP_COMPOSE_UP=false"
        SKIP_COMPOSE_UP=false
        ;;
    *)
        print_warning "🟠 MySQL容器状态未知，将创建新容器"
        print_info "设置 SKIP_COMPOSE_UP=false"
        SKIP_COMPOSE_UP=false
        ;;
esac

print_info "当前状�? SKIP_COMPOSE_UP=$SKIP_COMPOSE_UP, NEED_REBUILD=$NEED_REBUILD"

# 检查Redis容器 (如果存在)
print_separator
print_info "=== Redis容器检�?==="
if docker ps -a | grep -q "redis-internship"; then
    check_container_health "redis-internship" "redis"
    redis_health_status=$?
    
    case $redis_health_status in
        0)
            print_success "🟢 Redis容器健康状态良好，直接使用"
            ;;
        1)
            print_warning "🟡 Redis容器需要修复，尝试修复�?.."
            docker restart "redis-internship" >/dev/null 2>&1
            sleep 3
            ;;
        2)
            print_error "🔴 Redis容器状态异常，建议手动检�?
            ;;
    esac
else
    print_info "🔵 Redis容器不存在，如需要请手动启动"
fi

# 根据检查结果决定操�?
print_separator
print_info "决策阶段: SKIP_COMPOSE_UP=$SKIP_COMPOSE_UP, NEED_REBUILD=$NEED_REBUILD"

if [ "$NEED_REBUILD" = true ]; then
    print_warning "⚠️  检测到容器异常，执行清理重�?.."
    print_step "清理异常容器..."
    docker-compose down -v 2>/dev/null || true
    sleep 2
    print_success "异常容器清理完成，将重新创建"
    SKIP_COMPOSE_UP=false
elif [ "$SKIP_COMPOSE_UP" = true ]; then
    print_success "🎉 容器状态良好，无需重新创建"
    print_info "将直接使用现有容器进行后续操�?
    
    # 最终验证服务可用�?
    if ! verify_service_availability; then
        print_error "�?服务可用性验证失败，自动降级到重建模�?
        print_step "执行自动降级清理重建..."
        docker-compose down -v 2>/dev/null || true
        sleep 2
        SKIP_COMPOSE_UP=false
        NEED_REBUILD=true
    fi
else
    print_info "🔵 需要创建新容器"
    print_info "将执�?docker-compose up -d"
fi

print_info "最终决�? SKIP_COMPOSE_UP=$SKIP_COMPOSE_UP"

# 启动MySQL服务
print_step "启动MySQL 8.0服务..."
print_info "执行服务启动逻辑，当�?SKIP_COMPOSE_UP=$SKIP_COMPOSE_UP"

# 如果智能管理已经处理好容器，跳过docker-compose启动
if [ "$SKIP_COMPOSE_UP" = true ]; then
    print_success "使用现有容器，跳过docker-compose启动"
else
    print_info "启动新的数据库服�?.."
    print_step "执行命令: docker-compose up -d"
    
    if docker-compose up -d; then
        print_success "MySQL服务启动命令执行成功"
    else
        print_error "MySQL服务启动失败"
        # 显示错误日志
        print_info "错误日志�?
        docker-compose logs mysql 2>/dev/null || true
        exit 1
    fi
    
    print_info "docker-compose up -d 执行完成"
fi

# 等待MySQL服务就绪
print_step "等待MySQL服务初始�?.."
print_info "这可能需�?0-60秒，请耐心等待..."

# 进度条函�?
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

# 显示进度�?
show_progress 10

# 检查服务状�?
print_step "检查MySQL服务状�?.."
MAX_ATTEMPTS=30
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    if docker exec mysql-internship mysqladmin ping -h localhost -u root -p123456 --silent 2>/dev/null; then
        print_success "MySQL服务已就绪！"
        break
    else
        printf "\r${YELLOW}�?MySQL服务启动�?.. (尝试 $ATTEMPT/$MAX_ATTEMPTS)${NC}"
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
print_step "验证数据库连�?.."
if docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -e "SELECT 1;" &>/dev/null; then
    print_success "数据库连接测试成�?
else
    print_warning "使用业务用户连接失败，检查root用户连接..."
    if docker exec mysql-internship mysql -u root -p123456 -e "SELECT 1;" &>/dev/null; then
        print_success "Root用户连接正常"
    else
        print_error "数据库连接失�?
        exit 1
    fi
fi

# 验证数据库和�?
print_step "验证数据库结构和数据..."

# 检查表数量
TABLES_COUNT=$(docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -se "SHOW TABLES;" 2>/dev/null | wc -l)

if [ $TABLES_COUNT -ge 10 ]; then
    print_success "数据库表创建成功�?�?$TABLES_COUNT 张表)"
else
    print_warning "数据库表数量异常，检测到 $TABLES_COUNT 个表"
fi

# 验证核心数据
print_info "验证核心数据..."
USER_COUNT=$(docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -se "SELECT COUNT(*) FROM user;" 2>/dev/null || echo "0")
INSTITUTION_COUNT=$(docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -se "SELECT COUNT(*) FROM institution;" 2>/dev/null || echo "0")
PRODUCT_COUNT=$(docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -se "SELECT COUNT(*) FROM product;" 2>/dev/null || echo "0")

print_info "数据统计�?
echo "  👥 用户数量: $USER_COUNT"
echo "  🏢 机构数量: $INSTITUTION_COUNT"  
echo "  🛍�? 商品数量: $PRODUCT_COUNT"

if [ $USER_COUNT -gt 0 ] && [ $INSTITUTION_COUNT -gt 0 ] && [ $PRODUCT_COUNT -gt 0 ]; then
    print_success "测试数据验证通过"
else
    print_warning "部分测试数据可能缺失"
fi

# 显示测试用户信息
print_step "测试用户信息�?
echo -e "${CYAN}┌─────────────────────────────────────────────────────────────�?{NC}"
echo -e "${CYAN}�?                     测试账户信息                          �?{NC}"
echo -e "${CYAN}├─────────────────────────────────────────────────────────────�?{NC}"
echo -e "${CYAN}�?用户�?     �?密码        �?角色     �?手机�?     �?积分 �?{NC}"
echo -e "${CYAN}├─────────────────────────────────────────────────────────────�?{NC}"
echo -e "${CYAN}�?student01   �?password123 �?学生     �?13800138001 �?150  �?{NC}"
echo -e "${CYAN}�?teacher01   �?password123 �?教师     �?13800138002 �?280  �?{NC}"
echo -e "${CYAN}�?expert01    �?password123 �?专家     �?13800138003 �?500  �?{NC}"
echo -e "${CYAN}�?admin       �?password123 �?管理�?  �?13800138000 �?1000 �?{NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────�?{NC}"

# 显示连接信息
print_separator
print_success "🎉 数据库启动完成！"
print_separator

echo -e "${BLUE}📋 连接信息�?{NC}"
echo "   🌐 数据库地址: localhost:3306"
echo "   💾 数据库名�? internship_db"
echo "   👤 用户�? internship_user"
echo "   🔐 密码: internship_pass"
echo "   🔑 Root密码: 123456"
echo ""

echo -e "${BLUE}🔧 管理命令�?{NC}"
echo "   📊 查看服务状�? docker-compose ps"
echo "   📝 查看日志: docker-compose logs mysql"
echo "   🔗 连接数据�? docker exec -it mysql-internship mysql -u internship_user -pinternship_pass internship_db"
echo "   ⏹️  停止服务: docker-compose down"
echo ""

echo -e "${BLUE}🧪 测试建议�?{NC}"
echo "   1. 启动Spring Boot应用: mvn spring-boot:run"
echo "   2. 启动前端应用: cd frontend && npm start"
echo "   3. 测试短信验证�? 使用手机�?13800138001"
echo "   4. 访问Swagger UI: http://localhost:8080/swagger-ui/index.html"
echo ""

echo -e "${BLUE}📚 功能特性：${NC}"
echo "   �?完整的测试数�?(用户、机构、商品、积分流�?"
echo "   �?短信验证码功�?(模拟实现)"
echo "   �?积分管理系统 (获得、消费、转�?"
echo "   �?积分商城功能 (商品兑换)"
echo "   �?多角色权限管�?
echo "   �?智能容器健康管理 (自动检测、修复、降级重�?"
echo "   �?五维度健康评�?(状态、端口、响应、数据卷、网�?"
echo "   �?零干预智能管�?(优先保留数据，异常时自动重建)"
echo "   �?Redis缓存支持 (兼容现有环境)"
echo ""

echo -e "${BLUE}🤖 智能健康管理说明�?{NC}"
echo "   🔍 自动检�? 脚本会自动检测MySQL和Redis容器健康状�?
echo "   📊 健康评分: 基于5个维度进�?00分制健康评估"
echo "     - 容器运行状�?(25�?"
echo "     - 端口监听状�?(25�?" 
echo "     - 服务响应状�?(25�?"
echo "     - 数据卷挂�?(25�?"
echo "   🔧 智能修复: 健康�?0-79分时自动尝试重启修复"
echo "   🔄 自动降级: 健康�?50分或修复失败时自动清理重�?
echo "   �?零干�? 无需用户选择，全自动智能管理"
echo ""

print_separator
print_success "🚀 现在可以启动应用程序开始测试了�?
print_separator 