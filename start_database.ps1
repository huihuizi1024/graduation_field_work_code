# ========================================
# 终身学习学分银行平台积分管理系统
# MySQL 8.0 数据库快速启动脚本 (PowerShell版)
# 作者: huihuizi1024
# 日期: 2025.7.2
# 版本: v2.0 PowerShell Edition
# ========================================

# 设置错误处理
$ErrorActionPreference = "Stop"

# 颜色函数
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    
    switch ($Color) {
        "Red" { Write-Host $Message -ForegroundColor Red }
        "Green" { Write-Host $Message -ForegroundColor Green }
        "Yellow" { Write-Host $Message -ForegroundColor Yellow }
        "Blue" { Write-Host $Message -ForegroundColor Blue }
        "Cyan" { Write-Host $Message -ForegroundColor Cyan }
        "Magenta" { Write-Host $Message -ForegroundColor Magenta }
        default { Write-Host $Message }
    }
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "✅ $Message" "Green"
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "ℹ️  $Message" "Blue"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "⚠️  $Message" "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "❌ $Message" "Red"
}

function Write-Step {
    param([string]$Message)
    Write-ColorOutput "🚀 $Message" "Magenta"
}

function Write-Separator {
    Write-ColorOutput "==========================================" "Cyan"
}

# 开始执行
Clear-Host
Write-ColorOutput @"
  ╔═══════════════════════════════════════════════════════════╗
  ║           终身学习学分银行平台积分管理系统                 ║
  ║               MySQL 8.0 数据库启动器                     ║
  ║                PowerShell版 v2.0                        ║
  ╚═══════════════════════════════════════════════════════════╝
"@ "Cyan"

Write-Separator
Write-Step "开始启动数据库服务..."
Write-Separator

# 检查系统环境
Write-Info "正在检查系统环境..."

# 检查Docker是否安装
try {
    $dockerVersion = docker --version
    Write-Success "Docker已安装: $dockerVersion"
} catch {
    Write-Error "Docker未安装，请先安装Docker"
    Write-Host "安装指南: https://docs.docker.com/get-docker/"
    exit 1
}

# 检查Docker Compose是否安装
try {
    $composeVersion = docker-compose --version
    Write-Success "Docker Compose已安装: $composeVersion"
} catch {
    Write-Error "Docker Compose未安装，请先安装Docker Compose"
    Write-Host "安装指南: https://docs.docker.com/compose/install/"
    exit 1
}

# 检查Docker服务是否运行
try {
    docker info | Out-Null
    Write-Success "Docker服务正常运行"
} catch {
    Write-Error "Docker服务未运行，请启动Docker服务"
    exit 1
}

# 检查必要文件是否存在
Write-Info "检查必要文件..."
if (-not (Test-Path "docker-compose.yml")) {
    Write-Error "docker-compose.yml文件不存在"
    exit 1
}
Write-Success "docker-compose.yml文件存在"

if (-not (Test-Path "database_setup.sql")) {
    Write-Error "database_setup.sql文件不存在"
    exit 1
}
Write-Success "database_setup.sql文件存在"

# 检查端口占用
Write-Info "检查端口占用..."
$port3306 = Get-NetTCPConnection -LocalPort 3306 -ErrorAction SilentlyContinue
if ($port3306) {
    Write-Warning "端口3306已被占用，将停止现有服务"
}

# 停止现有容器和数据卷，确保全新启动
Write-Step "清理旧环境..."
try {
    $containers = docker ps -a --filter "name=mysql-internship" --format "{{.Names}}"
    if ($containers -contains "mysql-internship") {
        Write-Info "发现旧容器，正在清理..."
        docker-compose down -v 2>$null
        Write-Success "旧环境清理完成"
    } else {
        Write-Info "未发现旧容器，跳过清理步骤"
    }
} catch {
    Write-Info "清理过程中出现警告，继续执行"
}

# 启动MySQL服务
Write-Step "启动MySQL 8.0服务..."
try {
    docker-compose up -d
    Write-Success "MySQL服务启动命令执行成功"
} catch {
    Write-Error "MySQL服务启动失败: $($_.Exception.Message)"
    exit 1
}

# 等待MySQL服务就绪
Write-Step "等待MySQL服务初始化..."
Write-Info "这可能需要30-60秒，请耐心等待..."

# 简单的等待提示
for ($i = 1; $i -le 10; $i++) {
    Write-Host "." -NoNewline -ForegroundColor Blue
    Start-Sleep 1
}
Write-Host ""

# 检查服务状态
Write-Step "检查MySQL服务状态..."
$maxAttempts = 30
$attempt = 1
$connected = $false

while ($attempt -le $maxAttempts -and -not $connected) {
    try {
        docker exec mysql-internship mysqladmin ping -h localhost -u root -p123456 --silent 2>$null
        $connected = $true
        Write-Success "MySQL服务已就绪！"
    } catch {
        Write-Host "⏳ MySQL服务启动中... (尝试 $attempt/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep 2
        $attempt++
    }
}

if (-not $connected) {
    Write-Error "MySQL服务启动超时"
    Write-Info "请检查日志: docker-compose logs mysql"
    exit 1
}

# 检查数据库连接
Write-Step "验证数据库连接..."
try {
    docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -e "SELECT 1;" 2>$null | Out-Null
    Write-Success "数据库连接测试成功"
} catch {
    Write-Warning "使用业务用户连接失败，检查root用户连接..."
    try {
        docker exec mysql-internship mysql -u root -p123456 -e "SELECT 1;" 2>$null | Out-Null
        Write-Success "Root用户连接正常"
    } catch {
        Write-Error "数据库连接失败"
        exit 1
    }
}

# 验证数据库和表
Write-Step "验证数据库结构和数据..."

# 检查表数量
try {
    $tablesCount = (docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -se "SHOW TABLES;" 2>$null).Count
    
    if ($tablesCount -ge 10) {
        Write-Success "数据库表创建成功！(共 $tablesCount 张表)"
    } else {
        Write-Warning "数据库表数量异常，检测到 $tablesCount 个表"
    }
} catch {
    Write-Warning "无法获取表数量信息"
}

# 验证核心数据
Write-Info "验证核心数据..."
try {
    $userCount = docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -se "SELECT COUNT(*) FROM user;" 2>$null
    $institutionCount = docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -se "SELECT COUNT(*) FROM institution;" 2>$null
    $productCount = docker exec mysql-internship mysql -u internship_user -pinternship_pass internship_db -se "SELECT COUNT(*) FROM product;" 2>$null
    
    Write-Info "数据统计："
    Write-Host "  👥 用户数量: $userCount"
    Write-Host "  🏢 机构数量: $institutionCount"  
    Write-Host "  🛍️  商品数量: $productCount"
    
    if ([int]$userCount -gt 0 -and [int]$institutionCount -gt 0 -and [int]$productCount -gt 0) {
        Write-Success "测试数据验证通过"
    } else {
        Write-Warning "部分测试数据可能缺失"
    }
} catch {
    Write-Warning "数据验证过程中出现问题"
}

# 显示测试用户信息
Write-Step "测试用户信息："
Write-ColorOutput "┌─────────────────────────────────────────────────────────────┐" "Cyan"
Write-ColorOutput "│                      测试账户信息                          │" "Cyan"
Write-ColorOutput "├─────────────────────────────────────────────────────────────┤" "Cyan"
Write-ColorOutput "│ 用户名      │ 密码        │ 角色     │ 手机号      │ 积分 │" "Cyan"
Write-ColorOutput "├─────────────────────────────────────────────────────────────┤" "Cyan"
Write-ColorOutput "│ student01   │ password123 │ 学生     │ 13800138001 │ 150  │" "Cyan"
Write-ColorOutput "│ teacher01   │ password123 │ 教师     │ 13800138002 │ 280  │" "Cyan"
Write-ColorOutput "│ expert01    │ password123 │ 专家     │ 13800138003 │ 500  │" "Cyan"
Write-ColorOutput "│ admin       │ password123 │ 管理员   │ 13800138000 │ 1000 │" "Cyan"
Write-ColorOutput "└─────────────────────────────────────────────────────────────┘" "Cyan"

# 显示连接信息
Write-Separator
Write-Success "🎉 数据库启动完成！"
Write-Separator

Write-ColorOutput "📋 连接信息：" "Blue"
Write-Host "   🌐 数据库地址: localhost:3306"
Write-Host "   💾 数据库名称: internship_db"
Write-Host "   👤 用户名: internship_user"
Write-Host "   🔐 密码: internship_pass"
Write-Host "   🔑 Root密码: 123456"
Write-Host ""

Write-ColorOutput "🔧 管理命令：" "Blue"
Write-Host "   📊 查看服务状态: docker-compose ps"
Write-Host "   📝 查看日志: docker-compose logs mysql"
Write-Host "   🔗 连接数据库: docker exec -it mysql-internship mysql -u internship_user -pinternship_pass internship_db"
Write-Host "   ⏹️  停止服务: docker-compose down"
Write-Host ""

Write-ColorOutput "🧪 测试建议：" "Blue"
Write-Host "   1. 启动Spring Boot应用: mvn spring-boot:run"
Write-Host "   2. 启动前端应用: cd frontend && npm start"
Write-Host "   3. 测试短信验证码: 使用手机号 13800138001"
Write-Host "   4. 访问Swagger UI: http://localhost:8080/swagger-ui/index.html"
Write-Host ""

Write-ColorOutput "📚 功能特性：" "Blue"
Write-Host "   ✨ 完整的测试数据 (用户、机构、商品、积分流水)"
Write-Host "   ✨ 短信验证码功能 (模拟实现)"
Write-Host "   ✨ 积分管理系统 (获得、消费、转换)"
Write-Host "   ✨ 积分商城功能 (商品兑换)"
Write-Host "   ✨ 多角色权限管理"
Write-Host ""

Write-Separator
Write-Success "🚀 现在可以启动应用程序开始测试了！"
Write-Separator 