#!/bin/bash

# Windows 兼容性设置
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

# 检测是否在 Windows 环境中运行
is_windows() {
    case "$(uname -s)" in
        MINGW*|MSYS*|CYGWIN*)
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Windows 路径转换函数
convert_path() {
    if is_windows; then
        echo "$1" | sed 's/\\/\//g'
    else
        echo "$1"
    fi
}

# 修改文件检查函数
check_file_exists() {
    local file="$1"
    if [ ! -f "$(convert_path "$file")" ]; then
        return 1
    fi
    return 0
}

# 修改端口检查函数 - Windows 兼容版
check_port_windows() {
    local port=$1
    if command -v netstat >/dev/null 2>&1; then
        netstat -ano 2>/dev/null | grep -E ":$port\s+" >/dev/null
        return $?
    else
        # 如果 netstat 不可用，尝试使用 PowerShell
        if command -v powershell >/dev/null 2>&1; then
            powershell -Command "Get-NetTCPConnection -LocalPort $port 2>$null" >/dev/null 2>&1
            return $?
        fi
    fi
    return 1
}

# 修改进度条函数 - Windows 兼容版
show_progress_windows() {
    local duration=$1
    local steps=20
    local step_duration=$((duration / steps))
    
    for ((i=0; i<=steps; i++)); do
        local progress=$((i * 100 / steps))
        printf "\r[%-${steps}s] %d%%" "$(printf '#%.0s' $(seq 1 $i))" "$progress"
        sleep $step_duration
    done
    echo
}

# 修改日志函数 - Windows 兼容版
log_message() {
    local timestamp
    if is_windows; then
        timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    else
        timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    fi
    echo "$timestamp - $1" >> "$(convert_path "$LOG_FILE")"
}

# 修改备份函数 - Windows 兼容版
backup_database_windows() {
    print_step "创建数据库备份..."
    local backup_dir="backups"
    local backup_file="${backup_dir}/backup_$(date +%Y%m%d_%H%M%S).sql"
    
    # 创建备份目录
    mkdir -p "$(convert_path "$backup_dir")"
    
    # 执行备份
    print_info "正在备份数据库到 $backup_file ..."
    if is_windows; then
        docker exec $CONTAINER_NAME mysqldump -u root -p$ROOT_PASS --databases $DATABASE_NAME > "$(convert_path "$backup_file")" 2>/dev/null
    else
        docker exec $CONTAINER_NAME mysqldump -u root -p$ROOT_PASS --databases $DATABASE_NAME > "$backup_file" 2>/dev/null
    fi
    
    if [ $? -eq 0 ]; then
        print_success "数据库备份成功: $backup_file"
        # 压缩备份文件
        if command -v gzip >/dev/null 2>&1; then
            gzip "$(convert_path "$backup_file")"
            print_success "备份文件已压缩: ${backup_file}.gz"
        else
            print_warning "gzip 不可用，跳过压缩"
        fi
    else
        print_error "数据库备份失败"
        return 1
    fi
}

# 替换原有的平台检测函数
detect_platform() {
    if is_windows; then
        echo "windows"
    else
        case "$(uname -s)" in
            Darwin*)
                echo "macos"
                ;;
            Linux*)
                echo "linux"
                ;;
            *)
                echo "unknown"
                ;;
        esac
    fi
}

# 在脚本开头添加 Windows 兼容性设置
#!/bin/bash

# ========================================
# 终身学习学分银行平台积分管理系统
# MySQL 8.0 数据库快速启动脚本(增强版)
# 作者: huihuizi1024
# 日期: 2025.7.4
# 版本: v3.3 - 跨平台智能健康管理版
# 新增功能: Windows/Mac/Linux跨平台兼容、智能容器健康检测、自动修复、降级重建、Redis集成
# 支持平台: Windows (Git Bash/WSL), macOS, Linux
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

# 平台检测
detect_platform() {
    local platform=""
    case "$(uname -s)" in
        MINGW*|MSYS*|CYGWIN*)
            platform="windows"
            ;;
        Darwin*)
            platform="macos"
            ;;
        Linux*)
            platform="linux"
            ;;
        *)
            platform="unknown"
            ;;
    esac
    echo "$platform"
}

PLATFORM=$(detect_platform)

# 颜色定义 - 跨平台兼容
if [[ "$PLATFORM" == "windows" && -z "$WT_SESSION" ]]; then
    # Windows Git Bash 可能不完全支持颜色，但大多数情况下是可以的
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    PURPLE='\033[0;35m'
    CYAN='\033[0;36m'
    NC='\033[0m'
else
    # macOS, Linux, Windows Terminal 都支持完整颜色
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    PURPLE='\033[0;35m'
    CYAN='\033[0;36m'
    NC='\033[0m'
fi

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

print_platform_info() {
    case "$PLATFORM" in
        windows)
            print_info "检测到 Windows 环境 (Git Bash/WSL)"
            ;;
        macos)
            print_info "检测到 macOS 环境"
            ;;
        linux)
            print_info "检测到 Linux 环境"
            ;;
        *)
            print_warning "检测到未知操作系统环境"
            ;;
    esac
}

# 跨平台网络检查函数
check_port_usage() {
    local port=$1
    case "$PLATFORM" in
        windows)
            # Windows 上使用 netstat 或者 ss
            if command -v netstat >/dev/null 2>&1; then
                netstat -an 2>/dev/null | grep ":$port " >/dev/null
            else
                # Git Bash 环境可能没有 netstat，返回 false
                return 1
            fi
            ;;
        macos)
            # macOS 使用 netstat
            netstat -an 2>/dev/null | grep "\\.$port " >/dev/null
            ;;
        linux)
            # Linux 优先使用 ss，fallback 到 netstat
            if command -v ss >/dev/null 2>&1; then
                ss -tuln 2>/dev/null | grep ":$port " >/dev/null
            elif command -v netstat >/dev/null 2>&1; then
                netstat -tuln 2>/dev/null | grep ":$port " >/dev/null
            else
                return 1
            fi
            ;;
        *)
            return 1
            ;;
    esac
}

# 跨平台 Docker 检查函数
check_docker_service() {
    case "$PLATFORM" in
        windows)
            # Windows 上检查 Docker Desktop
            if docker info >/dev/null 2>&1; then
                return 0
            else
                print_error "Docker Desktop 未运行或未安装"
                print_info "请启动 Docker Desktop 应用程序"
                print_info "下载地址: https://www.docker.com/products/docker-desktop"
                return 1
            fi
            ;;
        macos)
            # macOS 上检查 Docker Desktop 或 Docker
            if docker info >/dev/null 2>&1; then
                return 0
            else
                print_error "Docker 未运行或未安装"
                print_info "请启动 Docker Desktop 或安装 Docker"
                print_info "安装命令: brew install --cask docker"
                return 1
            fi
            ;;
        linux)
            # Linux 上检查 Docker 服务
            if docker info >/dev/null 2>&1; then
                return 0
            else
                print_error "Docker 服务未运行或未安装"
                print_info "启动服务: sudo systemctl start docker"
                print_info "或安装 Docker: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
                return 1
            fi
            ;;
        *)
            return 1
            ;;
    esac
}

# 日志函数
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# 智能容器健康检测函数
check_container_health() {
    local container_name="$1"
    local service_type="$2"  # mysql 或 redis
    local health_score=0
    local issues=()
    
    print_info "检查 $service_type 容器健康状态..."
    
    # 1. 检查容器是否存在
    if ! docker ps -a --format "{{.Names}}" | grep -q "^$container_name$"; then
        print_info "$service_type 容器不存在"
        return 3  # 容器不存在，需要创建
    fi
    
    # 2. 检查容器运行状态
    local container_status=$(docker ps -a --filter "name=$container_name" --format "{{.Status}}")
    if echo "$container_status" | grep -q "Up"; then
        health_score=$((health_score + 25))
        print_success "✓ 容器运行状态正常"
    elif echo "$container_status" | grep -q "Exited"; then
        print_warning "⚠ 容器已停止，尝试启动..."
        if docker start "$container_name" >/dev/null 2>&1; then
            print_success "✓ 容器启动成功"
            health_score=$((health_score + 20))
            sleep 3  # 等待服务启动
        else
            issues+=("容器启动失败")
        fi
    else
        issues+=("容器状态异常: $container_status")
    fi
    
    # 3. 检查端口监听 - 跨平台兼容
    if [ "$service_type" = "mysql" ]; then
        if check_port_usage 3306 || docker exec "$container_name" sh -c 'command -v netstat >/dev/null && netstat -tuln 2>/dev/null | grep ":3306 "' >/dev/null 2>&1; then
            health_score=$((health_score + 25))
            print_success "✓ MySQL端口监听正常"
        else
            issues+=("MySQL端口3306未监听")
        fi
    elif [ "$service_type" = "redis" ]; then
        if check_port_usage 6379 || docker exec "$container_name" sh -c 'command -v netstat >/dev/null && netstat -tuln 2>/dev/null | grep ":6379 "' >/dev/null 2>&1; then
            health_score=$((health_score + 25))
            print_success "✓ Redis端口监听正常"
        else
            issues+=("Redis端口6379未监听")
        fi
    fi
    
    # 4. 检查服务响应
    if [ "$service_type" = "mysql" ]; then
        if docker exec "$container_name" mysqladmin ping -h localhost -u root -p$ROOT_PASS --silent 2>/dev/null; then
            health_score=$((health_score + 25))
            print_success "✓ MySQL服务响应正常"
        else
            issues+=("MySQL服务无响应")
        fi
    elif [ "$service_type" = "redis" ]; then
        if docker exec "$container_name" redis-cli ping 2>/dev/null | grep -q "PONG"; then
            health_score=$((health_score + 25))
            print_success "✓ Redis服务响应正常"
        else
            issues+=("Redis服务无响应")
        fi
    fi
    
    # 5. 检查数据卷挂载
    local volume_check=$(docker inspect "$container_name" --format '{{range .Mounts}}{{.Source}}:{{.Destination}} {{end}}' 2>/dev/null || echo "")
    if [ -n "$volume_check" ]; then
        health_score=$((health_score + 25))
        print_success "✓ 数据卷挂载正常"
    else
        issues+=("数据卷挂载异常")
    fi
    
    # 输出健康评估结果
    print_info "$service_type 容器健康分数: $health_score/100"
    
    if [ ${#issues[@]} -gt 0 ]; then
        print_warning "发现问题:"
        for issue in "${issues[@]}"; do
            echo "    - $issue"
        done
    fi
    
    # 返回健康状态：0=健康(80+), 1=需要修复(50-79), 2=需要重建(<50), 3=容器不存在
    if [ $health_score -ge 80 ]; then
        return 0  # 健康
    elif [ $health_score -ge 50 ]; then
        return 1  # 需要修复
    else
        return 2  # 需要重建
    fi
}

# 服务可用性最终验证
verify_service_availability() {
    print_step "验证服务最终可用性..."
    local mysql_available=false
    local redis_available=false
    
    # 验证MySQL
    if docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS -e "SELECT 1;" >/dev/null 2>&1; then
        mysql_available=true
        print_success "✓ MySQL服务可用"
    else
        print_error "❌ MySQL服务不可用"
    fi
    
    # 验证Redis (如果存在)
    if docker ps | grep -q "redis-internship"; then
        if docker exec redis-internship redis-cli ping 2>/dev/null | grep -q "PONG"; then
            redis_available=true
            print_success "✓ Redis服务可用"
        else
            print_error "❌ Redis服务不可用"
        fi
    else
        redis_available=true  # Redis不存在时视为正常
        print_info "Redis服务未启动"
    fi
    
    if [ "$mysql_available" = true ] && [ "$redis_available" = true ]; then
        return 0  # 全部可用
    else
        return 1  # 有服务不可用
    fi
}

# 显示平台特定的启动说明
show_platform_instructions() {
    echo -e "${BLUE}🖥️  平台特定说明：${NC}"
    case "$PLATFORM" in
        windows)
            echo "   📁 推荐使用 Git Bash 或 Windows Terminal"
            echo "   🐳 确保 Docker Desktop 正在运行"
            echo "   💡 如果遇到权限问题，尝试以管理员身份运行"
            echo "   🔧 启动方式: ./start_database.sh 或 bash start_database.sh"
            ;;
        macos)
            echo "   🍎 确保已安装 Docker Desktop 或 Docker"
            echo "   🔧 启动方式: ./start_database.sh"
            echo "   💡 如需安装 Docker: brew install --cask docker"
            ;;
        linux)
            echo "   🐧 确保 Docker 服务正在运行"
            echo "   🔧 启动方式: ./start_database.sh"
            echo "   💡 可能需要 sudo 权限: sudo ./start_database.sh"
            echo "   📦 启动 Docker 服务: sudo systemctl start docker"
            ;;
    esac
    echo ""
}

# 数据库字符集和排序规则验证
check_database_charset() {
    print_step "验证数据库字符集和排序规则..."
    local charset_check=$(docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS -e "
        SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME 
        FROM information_schema.SCHEMATA 
        WHERE SCHEMA_NAME = '$DATABASE_NAME';" 2>/dev/null)
    
    if echo "$charset_check" | grep -q "utf8mb4"; then
        print_success "数据库字符集配置正确 (utf8mb4)"
    else
        print_warning "数据库字符集配置不正确，尝试修复..."
        docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS -e "
            ALTER DATABASE $DATABASE_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            print_success "数据库字符集已修复"
        else
            print_error "数据库字符集修复失败"
            return 1
        fi
    fi
}

# 数据库表结构和数据完整性验证
verify_database_integrity() {
    print_step "验证数据库完整性..."
    local tables_check=$(docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS -e "
        SELECT COUNT(*) as tables_count FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = '$DATABASE_NAME';" 2>/dev/null | tail -n 1)
    
    if [ -z "$tables_check" ] || [ "$tables_check" -lt 10 ]; then
        print_warning "数据库表数量异常 (发现 $tables_check 张表，期望至少10张)"
        return 1
    else
        print_success "数据库表结构完整 (共 $tables_check 张表)"
    fi

    # 验证核心表数据
    local core_tables=("user" "institution" "point_rule" "conversion_rule" "product")
    for table in "${core_tables[@]}"; do
        local count=$(docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS -e "
            SELECT COUNT(*) FROM $DATABASE_NAME.$table;" 2>/dev/null | tail -n 1)
        if [ -z "$count" ] || [ "$count" -eq 0 ]; then
            print_warning "表 $table 中没有数据"
            return 1
        else
            print_success "表 $table 数据正常 (${count}条记录)"
        fi
    done
}

# 数据库索引检查和优化
check_and_optimize_indexes() {
    print_step "检查和优化数据库索引..."
    
    # 检查必要的索引是否存在
    local required_indexes=(
        "user.idx_user_username"
        "user.idx_user_role"
        "point_transaction.idx_point_transaction_user_id"
        "conversion_history.idx_conversion_history_user_id"
        "product.idx_category"
    )
    
    for index in "${required_indexes[@]}"; do
        IFS='.' read -r table index_name <<< "$index"
        local index_exists=$(docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS -e "
            SELECT COUNT(*) FROM information_schema.STATISTICS 
            WHERE TABLE_SCHEMA = '$DATABASE_NAME' 
            AND TABLE_NAME = '$table' 
            AND INDEX_NAME = '$index_name';" 2>/dev/null | tail -n 1)
            
        if [ "$index_exists" -eq 0 ]; then
            print_warning "缺少索引: $table.$index_name"
            case "$index" in
                "user.idx_user_username")
                    docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS -e "
                        CREATE INDEX idx_user_username ON $DATABASE_NAME.user(username);" 2>/dev/null
                    ;;
                "user.idx_user_role")
                    docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS -e "
                        CREATE INDEX idx_user_role ON $DATABASE_NAME.user(role);" 2>/dev/null
                    ;;
                # ... 其他索引修复
            esac
        else
            print_success "索引正常: $table.$index_name"
        fi
    done
    
    # 优化表
    print_info "优化数据库表..."
    docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS -e "
        OPTIMIZE TABLE $DATABASE_NAME.user, 
                      $DATABASE_NAME.point_transaction, 
                      $DATABASE_NAME.conversion_history, 
                      $DATABASE_NAME.product;" 2>/dev/null
}

# 数据库性能监控
monitor_database_performance() {
    print_step "监控数据库性能..."
    
    # 检查连接数
    local connections=$(docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS -e "
        SHOW STATUS LIKE 'Threads_connected';" 2>/dev/null | awk 'NR==2{print $2}')
    print_info "当前连接数: $connections"
    
    # 检查缓冲池使用情况
    local buffer_pool_ratio=$(docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS -e "
        SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_read_requests';" 2>/dev/null | awk 'NR==2{print $2}')
    print_info "缓冲池读取请求: $buffer_pool_ratio"
    
    # 检查慢查询
    local slow_queries=$(docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS -e "
        SHOW GLOBAL STATUS LIKE 'Slow_queries';" 2>/dev/null | awk 'NR==2{print $2}')
    print_info "慢查询数量: $slow_queries"
}

# 数据库备份功能
backup_database() {
    print_step "创建数据库备份..."
    local backup_dir="backups"
    local backup_file="${backup_dir}/backup_$(date +%Y%m%d_%H%M%S).sql"
    
    # 创建备份目录
    mkdir -p "$backup_dir"
    
    # 执行备份
    print_info "正在备份数据库到 $backup_file ..."
    docker exec $CONTAINER_NAME mysqldump -u root -p$ROOT_PASS --databases $DATABASE_NAME > "$backup_file"
    
    if [ $? -eq 0 ]; then
        print_success "数据库备份成功: $backup_file"
        # 压缩备份文件
        gzip "$backup_file"
        print_success "备份文件已压缩: ${backup_file}.gz"
    else
        print_error "数据库备份失败"
        return 1
    fi
}

# Windows 特定的错误处理函数
handle_windows_error() {
    local error_code=$1
    local error_message=$2
    
    case $error_code in
        1)
            print_warning "Windows 环境下的权限问题，尝试以管理员身份运行..."
            if command -v powershell >/dev/null 2>&1; then
                print_info "尝试使用 PowerShell 提升权限..."
                powershell -Command "Start-Process -Verb RunAs 'bash' -ArgumentList '$0'"
                exit 0
            fi
            ;;
        2)
            print_warning "Windows 环境下的路径问题，尝试修复..."
            local fixed_path=$(convert_path "$error_message")
            print_info "转换后的路径: $fixed_path"
            ;;
        3)
            print_warning "Windows 环境下的进程占用问题..."
            print_info "尝试结束占用进程..."
            if command -v powershell >/dev/null 2>&1; then
                powershell -Command "Stop-Process -Id (Get-NetTCPConnection -LocalPort $error_message).OwningProcess -Force" 2>/dev/null
            fi
            ;;
        *)
            print_error "未知的 Windows 错误"
            ;;
    esac
}

# 修改错误处理函数
handle_error() {
    local error_code=$1
    local error_message=$2
    
    if is_windows; then
        handle_windows_error "$error_code" "$error_message"
        if [ $? -eq 0 ]; then
            return 0
        fi
    fi
    
    print_error "发生错误 (代码: $error_code): $error_message"
    
    case $error_code in
        1)
            print_warning "尝试修复数据库连接..."
            docker restart $CONTAINER_NAME
            sleep 5
            ;;
        2)
            print_warning "尝试修复数据库结构..."
            if is_windows; then
                docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS < "$(convert_path "database_setup.sql")"
            else
                docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS < database_setup.sql
            fi
            ;;
        3)
            print_warning "尝试从最近的备份恢复..."
            local latest_backup
            if is_windows; then
                latest_backup=$(ls -t "$(convert_path "backups")/"*.sql.gz 2>/dev/null | head -n1)
            else
                latest_backup=$(ls -t backups/*.sql.gz 2>/dev/null | head -n1)
            fi
            if [ -n "$latest_backup" ]; then
                if command -v gunzip >/dev/null 2>&1; then
                    gunzip -c "$latest_backup" | docker exec -i $CONTAINER_NAME mysql -u root -p$ROOT_PASS
                else
                    print_error "Windows 环境下 gunzip 不可用"
                    print_info "请手动解压备份文件并导入"
                fi
            else
                print_error "没有找到可用的备份"
            fi
            ;;
        *)
            print_error "未知错误，无法自动修复"
            exit 1
            ;;
    esac
}

# 开始执行
clear
echo -e "${CYAN}"
cat << "EOF"
  ╔══════════════════════════════════════════════════════════════╗
  ║          终身学习学分银行平台积分管理系统                 ║
  ║              MySQL 8.0 数据库启动器                     ║
  ║        增强版 v3.3 - 跨平台智能健康管理版              ║
  ║          支持 Windows | macOS | Linux                   ║
  ╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

print_separator
print_step "开始启动数据库服务..."
print_platform_info
print_separator

# 检查系统环境
print_info "正在检查系统环境..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    print_error "Docker未安装，请先安装Docker"
    case "$PLATFORM" in
        windows)
            echo "Windows 安装指南: https://docs.docker.com/desktop/windows/install/"
            echo "下载 Docker Desktop: https://www.docker.com/products/docker-desktop"
            ;;
        macos)
            echo "macOS 安装指南: https://docs.docker.com/desktop/mac/install/"
            echo "或使用 Homebrew: brew install --cask docker"
            ;;
        linux)
            echo "Linux 安装指南: https://docs.docker.com/engine/install/"
            echo "快速安装: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
            ;;
    esac
    exit 1
fi
print_success "Docker已安装: $(docker --version)"

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose未安装，请先安装Docker Compose"
    case "$PLATFORM" in
        windows|macos)
            echo "Docker Desktop 通常已包含 Docker Compose"
            ;;
        linux)
            echo "安装指南: https://docs.docker.com/compose/install/"
            echo "或使用包管理器: sudo apt-get install docker-compose"
            ;;
    esac
    exit 1
fi
print_success "Docker Compose已安装: $(docker-compose --version)"

# 检查Docker服务是否运行 - 跨平台兼容
if ! check_docker_service; then
    exit 1
fi
print_success "Docker服务正常运行"

# 修改文件权限检查部分
print_info "检查必要文件..."
if ! check_file_exists "docker-compose.yml"; then
    print_error "docker-compose.yml文件不存在"
    exit 1
fi
print_success "docker-compose.yml文件存在"

if ! check_file_exists "database_setup.sql"; then
    print_error "database_setup.sql文件不存在"
    exit 1
fi
print_success "database_setup.sql文件存在"

# 修改特殊字符显示
if is_windows; then
    # Windows 环境下使用简化的字符
    INFO_ICON="[i]"
    SUCCESS_ICON="[v]"
    WARNING_ICON="[!]"
    ERROR_ICON="[x]"
    ROCKET_ICON="[>]"
else
    # Unix 环境下使用 emoji
    INFO_ICON="ℹ️"
    SUCCESS_ICON="✅"
    WARNING_ICON="⚠️"
    ERROR_ICON="❌"
    ROCKET_ICON="🚀"
fi

# 修改输出函数
print_info() {
    echo -e "${BLUE}${INFO_ICON} $1${NC}"
}

print_success() {
    echo -e "${GREEN}${SUCCESS_ICON} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}${WARNING_ICON} $1${NC}"
}

print_error() {
    echo -e "${RED}${ERROR_ICON} $1${NC}"
}

print_step() {
    echo -e "${PURPLE}${ROCKET_ICON} $1${NC}"
}

# 检查端口占用 - 跨平台兼容
print_info "检查端口占用..."
if check_port_usage 3306; then
    print_warning "端口3306已被占用，将停止现有服务"
fi

# 智能容器管理
print_step "智能容器管理..."
print_info "检查现有容器状态并智能管理..."

# 初始化管理状态
SKIP_COMPOSE_UP=false
NEED_REBUILD=false

# 检查MySQL容器
print_separator
print_info "=== MySQL容器检查 ==="
check_container_health "$CONTAINER_NAME" "mysql"
mysql_health_status=$?

print_info "MySQL健康检查返回状态: $mysql_health_status"

case $mysql_health_status in
    0)
        print_success "🟢 MySQL容器健康状态良好，直接使用"
        SKIP_COMPOSE_UP=true
        ;;
    1)
        print_warning "🟡 MySQL容器需要修复，尝试修复..."
        # 尝试重启修复
        docker restart "$CONTAINER_NAME" >/dev/null 2>&1
        sleep 5
        # 重新检查
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
        print_error "🔴 MySQL容器状态严重异常，需要重新创建"
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

print_info "当前状态: SKIP_COMPOSE_UP=$SKIP_COMPOSE_UP, NEED_REBUILD=$NEED_REBUILD"

# 检查Redis容器 (如果存在)
print_separator
print_info "=== Redis容器检查 ==="
if docker ps -a | grep -q "redis-internship"; then
    check_container_health "redis-internship" "redis"
    redis_health_status=$?
    
    case $redis_health_status in
        0)
            print_success "🟢 Redis容器健康状态良好，直接使用"
            ;;
        1)
            print_warning "🟡 Redis容器需要修复，尝试修复..."
            docker restart "redis-internship" >/dev/null 2>&1
            sleep 3
            ;;
        2)
            print_error "🔴 Redis容器状态异常，建议手动检查"
            ;;
    esac
else
    print_info "🔵 Redis容器不存在，如需要请手动启动"
fi

# 根据检查结果决定操作
print_separator
print_info "决策阶段: SKIP_COMPOSE_UP=$SKIP_COMPOSE_UP, NEED_REBUILD=$NEED_REBUILD"

if [ "$NEED_REBUILD" = true ]; then
    print_warning "⚠️  检测到容器异常，执行清理重建..."
    print_step "清理异常容器..."
    docker-compose down -v 2>/dev/null || true
    sleep 2
    print_success "异常容器清理完成，将重新创建"
    SKIP_COMPOSE_UP=false
elif [ "$SKIP_COMPOSE_UP" = true ]; then
    print_success "🎉 容器状态良好，无需重新创建"
    print_info "将直接使用现有容器进行后续操作"
    
    # 最终验证服务可用性
    if ! verify_service_availability; then
        print_error "❌ 服务可用性验证失败，自动降级到重建模式"
        print_step "执行自动降级清理重建..."
        docker-compose down -v 2>/dev/null || true
        sleep 2
        SKIP_COMPOSE_UP=false
        NEED_REBUILD=true
    fi
else
    print_info "🔵 需要创建新容器"
    print_info "将执行 docker-compose up -d"
fi

print_info "最终决策: SKIP_COMPOSE_UP=$SKIP_COMPOSE_UP"

# 启动MySQL服务
print_step "启动MySQL 8.0服务..."
print_info "执行服务启动逻辑，当前 SKIP_COMPOSE_UP=$SKIP_COMPOSE_UP"

# 如果智能管理已经处理好容器，跳过docker-compose启动
if [ "$SKIP_COMPOSE_UP" = true ]; then
    print_success "使用现有容器，跳过docker-compose启动"
else
    print_info "启动新的数据库服务..."
    print_step "执行命令: docker-compose up -d"
    
    if docker-compose up -d; then
        print_success "MySQL服务启动命令执行成功"
    else
        print_error "MySQL服务启动失败"
        # 显示错误日志
        print_info "错误日志:"
        docker-compose logs mysql 2>/dev/null || true
        exit 1
    fi
    
    print_info "docker-compose up -d 执行完成"
fi

# 等待MySQL服务就绪
print_step "等待MySQL服务初始化..."
print_info "这可能需要10-60秒，请耐心等待..."

# 进度条函数 - 跨平台兼容
show_progress() {
    local duration=$1
    local steps=20
    local step_duration=$((duration / steps))
    
    for ((i=0; i<=steps; i++)); do
        local progress=$((i * 100 / steps))
        local filled=$((i * 50 / steps))
        local empty=$((50 - filled))
        
        # 使用更兼容的 printf 方式
        printf "\r${BLUE}["
        printf "%*s" $filled | tr ' ' '='
        printf "%*s" $empty
        printf "${BLUE}] %d%%${NC}" $progress
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
    handle_error 1 "服务启动超时"
    exit 1
fi

# 添加字符集验证
print_step "验证数据库配置..."
if ! check_database_charset; then
    handle_error 2 "数据库字符集配置错误"
    exit 1
fi

# 验证数据库完整性
print_step "验证数据库完整性..."
if ! verify_database_integrity; then
    print_warning "数据库完整性检查失败，尝试修复..."
    if docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS < database_setup.sql; then
        print_success "数据库修复成功"
    else
        handle_error 2 "数据库完整性修复失败"
        exit 1
    fi
fi

# 检查和优化索引
print_step "检查和优化数据库索引..."
check_and_optimize_indexes

# 监控数据库性能
print_step "监控数据库性能..."
monitor_database_performance

# 创建数据库备份
print_step "创建数据库备份..."
if ! backup_database; then
    print_warning "数据库备份失败，但不影响系统使用"
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

# 验证数据库结构和数据
print_step "验证数据库结构和数据..."

# 检查表数量
TABLES_COUNT=$(docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -se "SHOW TABLES;" 2>/dev/null | wc -l)

if [ $TABLES_COUNT -ge 10 ]; then
    print_success "数据库表创建成功（共 $TABLES_COUNT 张表）"
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
echo "  🛍️ 商品数量: $PRODUCT_COUNT"

if [ $USER_COUNT -gt 0 ] && [ $INSTITUTION_COUNT -gt 0 ] && [ $PRODUCT_COUNT -gt 0 ]; then
    print_success "测试数据验证通过"
else
    print_warning "部分测试数据可能缺失"
fi

# 显示测试用户信息
print_step "测试用户信息："
echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│                     测试账户信息                          │${NC}"
echo -e "${CYAN}├─────────────────────────────────────────────────────────────┤${NC}"
echo -e "${CYAN}│ 用户名     │ 密码        │ 角色     │ 手机号     │ 积分 │${NC}"
echo -e "${CYAN}├─────────────────────────────────────────────────────────────┤${NC}"
echo -e "${CYAN}│ student01   │ password123 │ 学生     │ 13800138001 │ 150  │${NC}"
echo -e "${CYAN}│ teacher01   │ password123 │ 教师     │ 13800138002 │ 280  │${NC}"
echo -e "${CYAN}│ expert01    │ password123 │ 专家     │ 13800138003 │ 500  │${NC}"
echo -e "${CYAN}│ admin       │ password123 │ 管理员  │ 13800138000 │ 1000 │${NC}"
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
echo "   3. 测试短信验证码: 使用手机号13800138001"
echo "   4. 访问Swagger UI: http://localhost:8080/swagger-ui/index.html"
echo ""

echo -e "${BLUE}📚 功能特性：${NC}"
echo "   ✓ 跨平台支持 (Windows/macOS/Linux)"
echo "   ✓ 完整的测试数据(用户、机构、商品、积分流水)"
echo "   ✓ 短信验证码功能(模拟实现)"
echo "   ✓ 积分管理系统 (获得、消费、转换)"
echo "   ✓ 积分商城功能 (商品兑换)"
echo "   ✓ 多角色权限管理"
echo "   ✓ 智能容器健康管理 (自动检测、修复、降级重建)"
echo "   ✓ 五维度健康评估(状态、端口、响应、数据卷、网络)"
echo "   ✓ 零干预智能管理(优先保留数据，异常时自动重建)"
echo "   ✓ Redis缓存支持 (兼容现有环境)"
echo ""

echo -e "${BLUE}🤖 智能健康管理说明：${NC}"
echo "   🔍 自动检测: 脚本会自动检测MySQL和Redis容器健康状态"
echo "   📊 健康评分: 基于5个维度进行100分制健康评估"
echo "     - 容器运行状态(25分)"
echo "     - 端口监听状态(25分)" 
echo "     - 服务响应状态(25分)"
echo "     - 数据卷挂载(25分)"
echo "   🔧 智能修复: 健康分50-79分时自动尝试重启修复"
echo "   🔄 自动降级: 健康分<50分或修复失败时自动清理重建"
echo "   ⚡ 零干预: 无需用户选择，全自动智能管理"
echo ""

# 显示平台特定说明
show_platform_instructions

print_separator
print_success "🚀 现在可以启动应用程序开始测试了！"
print_separator 