#!/bin/bash

# ========================================
# 终身学习学分银行平台积分管理系统
# 数据库管理工具脚本
# 作者: huihuizi1024
# 日期: 2025.7.4
# 版本: v1.0
# ========================================

set -e

# 配置变量
CONTAINER_NAME="mysql-internship"
REDIS_CONTAINER_NAME="redis-internship"
DATABASE_NAME="internship_db"
DATABASE_USER="internship_user"
DATABASE_PASS="internship_pass"
ROOT_PASS="123456"
BACKUP_DIR="./database_backups"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

# 输出函数
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_step() { echo -e "${PURPLE}🚀 $1${NC}"; }
print_header() { echo -e "${WHITE}$1${NC}"; }
print_separator() { echo -e "${CYAN}==========================================${NC}"; }

# 检查容器是否运行
check_container() {
    if ! docker ps | grep -q $CONTAINER_NAME; then
        print_error "MySQL容器未运行，请先执行 ./start_database.sh"
        exit 1
    fi
    if ! docker ps | grep -q $REDIS_CONTAINER_NAME; then
        print_warning "Redis容器未运行，部分功能可能受限"
    fi
}

# 显示菜单
show_menu() {
    clear
    echo -e "${CYAN}"
    cat << "EOF"
  ╔═══════════════════════════════════════════════════════════╗
  ║                数据库管理工具 v1.0                        ║
  ║           终身学习学分银行平台积分管理系统                 ║
  ╚═══════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    print_separator
    echo -e "${WHITE}请选择操作：${NC}"
    echo "  1. 📊 数据库状态监控"
    echo "  2. 💾 数据库备份"
    echo "  3. 🔄 数据库恢复"
    echo "  4. 📋 查看数据统计"
    echo "  5. 🔧 数据库维护"
    echo "  6. 📝 查看日志"
    echo "  7. 🧪 执行测试查询"
    echo "  8. 🗑️  清理和重置"
    echo "  9. 🔄 强制重新初始化数据库"
    echo "  10. ❓ 帮助信息"
    echo "  0. 🚪 退出"
    print_separator
}

# 数据库状态监控
monitor_status() {
    print_header "数据库状态监控"
    check_container
    
    print_step "容器状态："
    echo "MySQL容器:"
    docker ps --filter name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    if docker ps | grep -q $REDIS_CONTAINER_NAME; then
        echo "Redis容器:"
        docker ps --filter name=$REDIS_CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
        print_warning "Redis容器未运行"
    fi
    
    print_step "容器资源使用："
    echo "MySQL资源:"
    docker stats $CONTAINER_NAME --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    if docker ps | grep -q $REDIS_CONTAINER_NAME; then
        echo "Redis资源:"
        docker stats $REDIS_CONTAINER_NAME --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    fi
    
    print_step "连接测试："
    if docker exec $CONTAINER_NAME mysqladmin ping -h localhost -u root -p$ROOT_PASS --silent 2>/dev/null; then
        print_success "MySQL连接正常"
    else
        print_error "MySQL连接失败"
    fi
    
    if docker ps | grep -q $REDIS_CONTAINER_NAME; then
        if docker exec $REDIS_CONTAINER_NAME redis-cli ping 2>/dev/null | grep -q "PONG"; then
            print_success "Redis连接正常"
        else
            print_error "Redis连接失败"
        fi
    fi
    
    print_step "数据统计："
    SIZE=$(docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS -e "SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'DB Size in MB' FROM information_schema.tables WHERE table_schema='$DATABASE_NAME';" 2>/dev/null | tail -1)
    echo "MySQL数据库大小: ${SIZE} MB"
    
    if docker ps | grep -q $REDIS_CONTAINER_NAME; then
        REDIS_MEMORY=$(docker exec $REDIS_CONTAINER_NAME redis-cli info memory 2>/dev/null | grep "used_memory_human:" | cut -d: -f2 || echo "N/A")
        echo "Redis内存使用: ${REDIS_MEMORY}"
    fi
    
    echo
    read -p "按Enter键返回主菜单..."
}

# 数据库备份
backup_database() {
    print_header "数据库备份"
    check_container
    
    # 创建备份目录
    mkdir -p $BACKUP_DIR
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/${DATABASE_NAME}_backup_$TIMESTAMP.sql"
    
    print_step "开始备份数据库..."
    print_info "备份文件: $BACKUP_FILE"
    
    if docker exec $CONTAINER_NAME mysqldump -u root -p$ROOT_PASS $DATABASE_NAME > $BACKUP_FILE 2>/dev/null; then
        BACKUP_SIZE=$(ls -lh $BACKUP_FILE | awk '{print $5}')
        print_success "备份完成！文件大小: $BACKUP_SIZE"
        
        # 显示最近的备份文件
        print_info "最近的备份文件："
        ls -lht $BACKUP_DIR/*.sql | head -5
    else
        print_error "备份失败"
    fi
    
    echo
    read -p "按Enter键返回主菜单..."
}

# 数据库恢复
restore_database() {
    print_header "数据库恢复"
    check_container
    
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A $BACKUP_DIR 2>/dev/null)" ]; then
        print_warning "没有找到备份文件"
        echo
        read -p "按Enter键返回主菜单..."
        return
    fi
    
    print_info "可用的备份文件："
    ls -lht $BACKUP_DIR/*.sql | nl
    
    echo
    read -p "请输入要恢复的备份文件编号 (输入0取消): " choice
    
    if [ "$choice" = "0" ]; then
        return
    fi
    
    BACKUP_FILE=$(ls -t $BACKUP_DIR/*.sql | sed -n "${choice}p")
    
    if [ -z "$BACKUP_FILE" ]; then
        print_error "无效的选择"
        echo
        read -p "按Enter键返回主菜单..."
        return
    fi
    
    print_warning "警告: 这将覆盖当前数据库的所有数据！"
    read -p "确认恢复吗？(y/N): " confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        print_step "开始恢复数据库..."
        if docker exec -i $CONTAINER_NAME mysql -u root -p$ROOT_PASS $DATABASE_NAME < $BACKUP_FILE; then
            print_success "数据库恢复完成！"
        else
            print_error "数据库恢复失败"
        fi
    else
        print_info "恢复操作已取消"
    fi
    
    echo
    read -p "按Enter键返回主菜单..."
}

# 查看数据统计
view_statistics() {
    print_header "数据库统计信息"
    check_container
    
    print_step "表统计："
    docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS $DATABASE_NAME -e "
    SELECT 
        table_name AS '表名',
        table_rows AS '记录数',
        ROUND(((data_length + index_length) / 1024 / 1024), 2) AS '大小(MB)'
    FROM information_schema.tables 
    WHERE table_schema = '$DATABASE_NAME' 
    ORDER BY table_rows DESC;" 2>/dev/null
    
    print_step "用户统计："
    docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS $DATABASE_NAME -e "
    SELECT 
        CASE role 
            WHEN 1 THEN '学生' 
            WHEN 2 THEN '机构' 
            WHEN 3 THEN '专家' 
            WHEN 4 THEN '管理员' 
            ELSE '其他' 
        END AS '用户类型',
        COUNT(*) AS '数量',
        ROUND(AVG(points_balance), 2) AS '平均积分'
    FROM user 
    GROUP BY role;" 2>/dev/null
    
    print_step "积分统计："
    docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS $DATABASE_NAME -e "
    SELECT 
        CASE transaction_type 
            WHEN 1 THEN '获得' 
            WHEN 2 THEN '消费' 
            WHEN 3 THEN '过期' 
            ELSE '其他' 
        END AS '交易类型',
        COUNT(*) AS '交易次数',
        ROUND(SUM(ABS(points_change)), 2) AS '总积分'
    FROM point_transaction 
    GROUP BY transaction_type;" 2>/dev/null
    
    echo
    read -p "按Enter键返回主菜单..."
}

# 数据库维护
database_maintenance() {
    print_header "数据库维护"
    check_container
    
    print_step "优化数据库表..."
    
    TABLES=$(docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS $DATABASE_NAME -e "SHOW TABLES;" 2>/dev/null | tail -n +2)
    
    for table in $TABLES; do
        print_info "优化表: $table"
        docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS $DATABASE_NAME -e "OPTIMIZE TABLE $table;" 2>/dev/null >/dev/null
    done
    
    print_success "数据库优化完成"
    
    print_step "检查数据一致性..."
    docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS $DATABASE_NAME -e "CHECK TABLE user, institution, product, point_transaction;" 2>/dev/null
    
    echo
    read -p "按Enter键返回主菜单..."
}

# 查看日志
view_logs() {
    print_header "数据库日志"
    
    print_step "Docker容器日志 (最近50行)："
    docker logs $CONTAINER_NAME --tail 50
    
    echo
    print_step "启动脚本日志："
    if ls database_startup_*.log 1> /dev/null 2>&1; then
        LATEST_LOG=$(ls -t database_startup_*.log | head -1)
        print_info "最新日志文件: $LATEST_LOG"
        echo
        tail -20 $LATEST_LOG
    else
        print_warning "没有找到启动脚本日志文件"
    fi
    
    echo
    read -p "按Enter键返回主菜单..."
}

# 执行测试查询
test_queries() {
    print_header "测试查询"
    check_container
    
    print_step "测试基本查询功能..."
    
    # 测试用户登录
    print_info "测试用户登录查询："
    docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS $DATABASE_NAME -e "
    SELECT username, full_name, role, points_balance 
    FROM user 
    WHERE phone = '13800138001';" 2>/dev/null
    
    # 测试积分商城
    print_info "测试积分商城查询："
    docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS $DATABASE_NAME -e "
    SELECT name, points, stock, status 
    FROM product 
    WHERE status = 1 
    LIMIT 3;" 2>/dev/null
    
    # 测试积分流水
    print_info "测试积分流水查询："
    docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS $DATABASE_NAME -e "
    SELECT u.username, pt.points_change, pt.description, pt.transaction_time
    FROM point_transaction pt
    JOIN user u ON pt.user_id = u.id
    ORDER BY pt.transaction_time DESC
    LIMIT 5;" 2>/dev/null
    
    print_success "测试查询完成"
    
    echo
    read -p "按Enter键返回主菜单..."
}

# 强制重新初始化数据库
force_reinitialize() {
    print_header "强制重新初始化数据库"
    check_container
    
    print_warning "警告: 这将删除所有现有数据并重新初始化数据库！"
    read -p "确认重新初始化？(输入'YES'确认): " confirm
    
    if [ "$confirm" != "YES" ]; then
        print_info "操作已取消"
        echo
        read -p "按Enter键返回主菜单..."
        return
    fi
    
    print_step "开始强制重新初始化..."
    
    # 检查SQL文件是否存在
    if [ ! -f "database_setup.sql" ]; then
        print_error "database_setup.sql 文件不存在"
        echo
        read -p "按Enter键返回主菜单..."
        return
    fi
    
    # 删除现有数据库
    print_info "删除现有数据库..."
    docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS -e "DROP DATABASE IF EXISTS $DATABASE_NAME;" 2>/dev/null
    
    # 复制SQL文件到容器
    print_info "准备初始化脚本..."
    docker cp database_setup.sql $CONTAINER_NAME:/tmp/init.sql
    
    # 执行初始化脚本
    print_info "执行数据库初始化..."
    if docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS < /tmp/init.sql 2>/dev/null; then
        print_success "数据库初始化成功！"
        
        # 验证数据
        print_step "验证初始化结果..."
        USER_COUNT=$(docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS $DATABASE_NAME -se "SELECT COUNT(*) FROM user;" 2>/dev/null || echo "0")
        INSTITUTION_COUNT=$(docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS $DATABASE_NAME -se "SELECT COUNT(*) FROM institution;" 2>/dev/null || echo "0")
        PRODUCT_COUNT=$(docker exec $CONTAINER_NAME mysql -u root -p$ROOT_PASS $DATABASE_NAME -se "SELECT COUNT(*) FROM product;" 2>/dev/null || echo "0")
        
        print_info "初始化结果:"
        echo "  👥 用户: $USER_COUNT"
        echo "  🏢 机构: $INSTITUTION_COUNT"
        echo "  🛍️ 商品: $PRODUCT_COUNT"
        
        if [ "$USER_COUNT" -gt 0 ] && [ "$INSTITUTION_COUNT" -gt 0 ]; then
            print_success "数据库重新初始化完成！"
        else
            print_warning "数据库已重新创建，但可能缺少部分数据"
        fi
    else
        print_error "数据库初始化失败"
    fi
    
    # 清理临时文件
    docker exec $CONTAINER_NAME rm /tmp/init.sql 2>/dev/null || true
    
    echo
    read -p "按Enter键返回主菜单..."
}

# 清理和重置
cleanup_reset() {
    print_header "清理和重置"
    
    echo -e "${YELLOW}警告: 以下操作将删除所有数据！${NC}"
    echo "1. 🗑️  清理容器 (保留数据)"
    echo "2. 💣 完全重置 (删除所有数据)"
    echo "3. 🧹 清理备份文件"
    echo "4. 📄 清理日志文件"
    echo "0. 返回主菜单"
    
    read -p "请选择操作: " choice
    
    case $choice in
        1)
            print_step "清理Docker容器..."
            docker-compose down
            print_success "容器清理完成"
            ;;
        2)
            read -p "确认完全重置？(输入'YES'确认): " confirm
            if [ "$confirm" = "YES" ]; then
                print_step "完全重置..."
                docker-compose down -v
                docker system prune -f
                print_success "完全重置完成"
            else
                print_info "操作已取消"
            fi
            ;;
        3)
            if [ -d "$BACKUP_DIR" ]; then
                rm -rf $BACKUP_DIR
                print_success "备份文件清理完成"
            else
                print_info "没有备份文件需要清理"
            fi
            ;;
        4)
            rm -f database_startup_*.log
            print_success "日志文件清理完成"
            ;;
        0)
            return
            ;;
        *)
            print_error "无效的选择"
            ;;
    esac
    
    echo
    read -p "按Enter键返回主菜单..."
}

# 帮助信息
show_help() {
    print_header "帮助信息"
    
    echo -e "${BLUE}数据库管理工具使用说明：${NC}"
    echo
    echo "📊 状态监控: 查看容器状态、资源使用情况"
    echo "💾 数据备份: 创建数据库备份文件"
    echo "🔄 数据恢复: 从备份文件恢复数据库"
    echo "📋 数据统计: 查看各表数据统计信息"
    echo "🔧 数据维护: 优化表、检查数据一致性"
    echo "📝 查看日志: 显示容器和脚本日志"
    echo "🧪 测试查询: 执行常用查询测试"
    echo "🗑️  清理重置: 清理容器或完全重置"
    echo "🔄 强制重新初始化: 删除现有数据并重新初始化数据库"
    echo
    echo -e "${YELLOW}注意事项：${NC}"
    echo "• 使用前请确保数据库容器正在运行"
    echo "• 备份文件保存在 ./database_backups/ 目录"
    echo "• 恢复操作会覆盖现有数据，请谨慎使用"
    echo "• 完全重置会删除所有数据和配置"
    echo "• 强制重新初始化会删除现有数据并重新创建"
    
    echo
    read -p "按Enter键返回主菜单..."
}

# 主程序循环
main() {
    while true; do
        show_menu
        read -p "请输入选择 (0-10): " choice
        
        case $choice in
            1) monitor_status ;;
            2) backup_database ;;
            3) restore_database ;;
            4) view_statistics ;;
            5) database_maintenance ;;
            6) view_logs ;;
            7) test_queries ;;
            8) cleanup_reset ;;
            9) force_reinitialize ;;
            10) show_help ;;
            0) 
                print_success "感谢使用数据库管理工具！"
                exit 0
                ;;
            *)
                print_error "无效的选择，请重试"
                sleep 1
                ;;
        esac
    done
}

# 检查依赖
if ! command -v docker &> /dev/null; then
    print_error "Docker未安装"
    exit 1
fi

# 启动主程序
main 