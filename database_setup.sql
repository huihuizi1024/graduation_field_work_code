-- ========================================
-- 终身学习学分银行平台积分管理系统
-- MySQL 8.0 数据库创建脚本
-- 作者: huihuizi1024
-- 日期: 2025.6.22
-- 版本: 1.2.1
-- ========================================

-- 设置客户端字符集
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = utf8mb4_unicode_ci;

-- 1. 创建数据库
DROP DATABASE IF EXISTS internship_db;
CREATE DATABASE internship_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. 创建用户和授权
DROP USER IF EXISTS 'internship_user'@'%';
CREATE USER 'internship_user'@'%' IDENTIFIED BY 'internship_pass';
GRANT ALL PRIVILEGES ON internship_db.* TO 'internship_user'@'%';
FLUSH PRIVILEGES;

-- 3. 使用创建的数据库
USE internship_db;

-- ========================================
-- 表结构创建
-- ========================================

-- 4. 创建积分规则表 (point_rule)
DROP TABLE IF EXISTS point_rule;
CREATE TABLE point_rule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    rule_name VARCHAR(255) NOT NULL COMMENT '规则名称',
    rule_code VARCHAR(100) NOT NULL UNIQUE COMMENT '规则编码',
    rule_description TEXT COMMENT '规则描述',
    point_type INT NOT NULL COMMENT '积分类型：1-学习积分，2-活动积分，3-贡献积分',
    point_value DECIMAL(10,2) NOT NULL COMMENT '积分值',
    applicable_object INT NOT NULL COMMENT '适用对象：1-学生，2-教师，3-专家，4-管理员',
    validity_type INT NOT NULL COMMENT '有效期类型：1-永久有效，2-固定期限，3-相对期限',
    validity_days INT COMMENT '有效期（天数）',
    status INT NOT NULL DEFAULT 1 COMMENT '状态：1-有效，0-无效',
    creator_id BIGINT COMMENT '创建人ID',
    creator_name VARCHAR(100) COMMENT '创建人姓名',
    reviewer_id BIGINT COMMENT '审核人ID',
    reviewer_name VARCHAR(100) COMMENT '审核人姓名',
    review_status INT DEFAULT 0 COMMENT '审核状态：0-待审核，1-审核通过，2-审核拒绝',
    review_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '审核时间',
    review_comment TEXT COMMENT '审核意见',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分规则表';

-- 5. 创建转换规则表 (conversion_rule)
DROP TABLE IF EXISTS conversion_rule;
CREATE TABLE conversion_rule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    rule_name VARCHAR(255) NOT NULL COMMENT '规则名称',
    rule_code VARCHAR(100) NOT NULL UNIQUE COMMENT '规则编码',
    source_type INT NOT NULL COMMENT '源类型：1-积分，2-学分，3-证书',
    target_type INT NOT NULL COMMENT '目标类型：1-积分，2-学分，3-证书',
    conversion_ratio DECIMAL(10,4) NOT NULL COMMENT '转换比例（源:目标）',
    min_conversion_amount DECIMAL(10,2) COMMENT '最小转换数量',
    max_conversion_amount DECIMAL(10,2) COMMENT '最大转换数量',
    conversion_conditions TEXT COMMENT '转换条件描述',
    review_required INT NOT NULL DEFAULT 0 COMMENT '审核要求：0-无需审核，1-需要审核',
    applicable_institution_id BIGINT COMMENT '适用机构ID',
    applicable_institution_name VARCHAR(255) COMMENT '适用机构名称',
    effective_start_time DATETIME COMMENT '有效期开始时间',
    effective_end_time DATETIME COMMENT '有效期结束时间',
    status INT NOT NULL DEFAULT 1 COMMENT '状态：1-有效，0-无效',
    creator_id BIGINT COMMENT '创建人ID',
    creator_name VARCHAR(100) COMMENT '创建人姓名',
    reviewer_id BIGINT COMMENT '审核人ID',
    reviewer_name VARCHAR(100) COMMENT '审核人姓名',
    review_status INT DEFAULT 0 COMMENT '审核状态：0-待审核，1-审核通过，2-审核拒绝',
    review_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '审核时间',
    review_comment TEXT COMMENT '审核意见',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='转换规则表';

-- 6. 创建机构表 (institution)
DROP TABLE IF EXISTS institution;
CREATE TABLE institution (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    institution_name VARCHAR(255) NOT NULL COMMENT '机构名称',
    institution_code VARCHAR(100) NOT NULL UNIQUE COMMENT '机构代码',
    institution_type INT NOT NULL COMMENT '机构类型：1-高等院校，2-职业院校，3-培训机构，4-社会组织',
    institution_level INT COMMENT '机构级别：1-国家级，2-省级，3-市级，4-区县级',
    social_credit_code VARCHAR(50) COMMENT '统一社会信用代码',
    legal_representative VARCHAR(100) COMMENT '法定代表人',
    contact_person VARCHAR(100) COMMENT '联系人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    contact_email VARCHAR(100) COMMENT '联系邮箱',
    address TEXT COMMENT '详细地址',
    province VARCHAR(50) COMMENT '省份',
    city VARCHAR(50) COMMENT '城市',
    district VARCHAR(50) COMMENT '区县',
    institution_description TEXT COMMENT '机构简介',
    business_scope TEXT COMMENT '业务范围',
    certification_level INT COMMENT '认证等级：1-AAA级，2-AA级，3-A级，4-B级，5-C级',
    certification_expiry_date DATETIME COMMENT '认证有效期',
    validity_months INT COMMENT '认证有效期(月)',
    status INT NOT NULL DEFAULT 1 COMMENT '状态：1-正常，2-暂停，3-注销',
    creator_id BIGINT COMMENT '创建人ID',
    creator_name VARCHAR(100) COMMENT '创建人姓名',
    reviewer_id BIGINT COMMENT '审核人ID',
    reviewer_name VARCHAR(100) COMMENT '审核人姓名',
    review_status INT DEFAULT 0 COMMENT '审核状态：0-待审核，1-审核通过，2-审核拒绝',
    review_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '审核时间',
    review_comment TEXT COMMENT '审核意见',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='机构表';

-- ========================================
-- 新增核心业务表
-- ========================================

-- 7. 创建用户表 (user)
DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(100) NOT NULL UNIQUE COMMENT '用户名/学号',
    password_hash VARCHAR(255) NOT NULL COMMENT '加密后的密码',
    full_name VARCHAR(100) COMMENT '真实姓名',
    role INT NOT NULL COMMENT '角色：1-学生, 2-机构, 3-专家, 4-管理员',

    email VARCHAR(100) UNIQUE COMMENT '邮箱',
    phone VARCHAR(20) UNIQUE COMMENT '手机号',
    institution_id BIGINT COMMENT '所属机构ID',
    status INT NOT NULL DEFAULT 1 COMMENT '状态：1-正常, 0-禁用',
    points_balance DECIMAL(10,2) DEFAULT 0.0 COMMENT '用户积分余额',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (institution_id) REFERENCES institution(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 8. 创建积分流水表 (point_transaction)
DROP TABLE IF EXISTS point_transaction;
CREATE TABLE point_transaction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '流水ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    point_rule_id BIGINT COMMENT '关联的积分规则ID (可为空)',
    transaction_type INT NOT NULL COMMENT '交易类型：1-获得, 2-消费, 3-过期',
    points_change DECIMAL(10, 2) NOT NULL COMMENT '变动积分（正为增加，负为扣减）',
    balance_after DECIMAL(10, 2) NOT NULL COMMENT '变动后总积分',
    description VARCHAR(255) COMMENT '交易描述，例如：完成在线课程学习',
    related_id VARCHAR(100) COMMENT '关联外部业务ID（如课程ID、活动ID）',
    transaction_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '交易时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (point_rule_id) REFERENCES point_rule(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分流水表';

-- 9. 创建转换历史表 (conversion_history)
DROP TABLE IF EXISTS conversion_history;
CREATE TABLE conversion_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '转换历史ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    conversion_rule_id BIGINT NOT NULL COMMENT '关联的转换规则ID',
    source_amount DECIMAL(10, 2) NOT NULL COMMENT '源数量（消耗的数量）',
    target_amount DECIMAL(10, 2) NOT NULL COMMENT '目标数量（获得的数量）',
    status INT NOT NULL COMMENT '状态：1-成功, 2-失败, 3-审核中',
    remark TEXT COMMENT '备注或审核意见',
    conversion_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '转换时间',
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (conversion_rule_id) REFERENCES conversion_rule(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学分转换历史表';

-- 10. 创建认证标准表 (certification_standard)
DROP TABLE IF EXISTS certification_standard;
CREATE TABLE certification_standard (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    standard_name VARCHAR(255) NOT NULL COMMENT '标准名称',
    standard_code VARCHAR(100) NOT NULL UNIQUE COMMENT '标准编码',
    standard_description TEXT COMMENT '标准描述',
    category INT COMMENT '标准类别：1-课程，2-项目，3-活动，4-考试，5-证书',
    issuing_organization VARCHAR(255) COMMENT '颁发机构',
    effective_start_time DATETIME COMMENT '有效期开始时间',
    effective_end_time DATETIME COMMENT '有效期结束时间',
    status INT NOT NULL DEFAULT 1 COMMENT '状态：1-有效，0-无效',
    creator_id BIGINT COMMENT '创建人ID',
    creator_name VARCHAR(100) COMMENT '创建人姓名',
    reviewer_id BIGINT COMMENT '审核人ID',
    reviewer_name VARCHAR(100) COMMENT '审核人姓名',
    review_status INT DEFAULT 0 COMMENT '审核状态：0-待审核，1-审核通过，2-审核拒绝',
    review_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '审核时间',
    review_comment TEXT COMMENT '审核意见',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='认证标准表';

-- 11. 创建业务流程表 (business_process)
DROP TABLE IF EXISTS business_process;
CREATE TABLE business_process (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    process_name VARCHAR(255) NOT NULL COMMENT '流程名称',
    process_code VARCHAR(100) NOT NULL UNIQUE COMMENT '流程编码',
    process_description TEXT COMMENT '流程描述',
    category INT COMMENT '流程类别：1-积分获取，2-积分转换，3-认证申请，4-活动参与，5-课程学习',
    responsible_department VARCHAR(255) COMMENT '负责部门',
    status INT NOT NULL DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    creator_id BIGINT COMMENT '创建人ID',
    creator_name VARCHAR(100) COMMENT '创建人姓名',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='业务流程表';

-- 12. 创建平台活动表 (platform_activity)
DROP TABLE IF EXISTS platform_activity;
CREATE TABLE platform_activity (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    activity_name VARCHAR(255) NOT NULL COMMENT '活动名称',
    activity_code VARCHAR(100) NOT NULL UNIQUE COMMENT '活动编码',
    activity_description TEXT COMMENT '活动描述',
    activity_type INT COMMENT '活动类型：1-线上活动，2-线下活动，3-混合活动',
    start_time DATETIME NOT NULL COMMENT '活动开始时间',
    end_time DATETIME NOT NULL COMMENT '活动结束时间',
    location VARCHAR(255) COMMENT '活动地点',
    organizer VARCHAR(255) COMMENT '组织者',
    contact_person VARCHAR(100) COMMENT '联系人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    reward_points DECIMAL(10,2) COMMENT '奖励积分',
    status INT NOT NULL DEFAULT 1 COMMENT '状态：1-进行中，0-已结束，2-已取消',
    creator_id BIGINT COMMENT '创建人ID',
    creator_name VARCHAR(100) COMMENT '创建人姓名',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='平台活动表';

-- 13. 创建项目表 (project) - 根据前端ProjectList.js定义
DROP TABLE IF EXISTS project;
CREATE TABLE project (
    id VARCHAR(50) PRIMARY KEY COMMENT '项目ID',
    project_name VARCHAR(100) NOT NULL COMMENT '项目名称',
    project_code VARCHAR(50) NOT NULL UNIQUE COMMENT '项目编码',
    负责人 VARCHAR(50) NOT NULL COMMENT '负责人姓名',
    start_date DATE COMMENT '开始日期',
    end_date DATE COMMENT '结束日期',
    status INT NOT NULL DEFAULT 1 COMMENT '状态：1-进行中, 0-已完成',
    description TEXT COMMENT '项目描述',
    creator_id BIGINT COMMENT '创建人ID',
    institution_id BIGINT COMMENT '机构ID',
    category INT COMMENT '课程分类：1-专业技能, 2-学术教育, 3-职业发展, 4-创新创业, 5-人文艺术, 6-科学技术',
    video_url VARCHAR(255) COMMENT '课程视频URL',
    cover_image_url VARCHAR(255) COMMENT '课程封面图URL',
    points_reward INT DEFAULT 5 COMMENT '观看完成可获得积分',
    duration INT DEFAULT 30 COMMENT '项目时长(分钟)',
    view_count INT DEFAULT 0 COMMENT '浏览量',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目/课程表';

-- 创建课程观看记录表
CREATE TABLE IF NOT EXISTS course_watch_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    course_id VARCHAR(64) NOT NULL COMMENT '课程ID',
    watch_status INT DEFAULT 0 COMMENT '观看状态：0-未完成，1-已完成',
    watch_progress INT DEFAULT 0 COMMENT '观看进度（百分比）',
    is_rewarded INT DEFAULT 0 COMMENT '是否已获得积分：0-未获得，1-已获得',
    last_watch_time DATETIME COMMENT '最后观看时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id),
    INDEX idx_user_course (user_id, course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程观看记录表';

-- 创建外键约束
ALTER TABLE course_watch_record
ADD CONSTRAINT fk_course_watch_user_id
FOREIGN KEY (user_id) REFERENCES user(id)
ON DELETE CASCADE ON UPDATE CASCADE;

-- 创建数据触发器，当course_watch_record表的watch_status从0变为1时，自动增加user表中的points_balance
DELIMITER //
CREATE TRIGGER IF NOT EXISTS trg_course_completed
AFTER UPDATE ON course_watch_record
FOR EACH ROW
BEGIN
    DECLARE reward INT;
    
    -- 如果观看状态从未完成变为已完成且未获得过积分
    IF OLD.watch_status = 0 AND NEW.watch_status = 1 AND NEW.is_rewarded = 0 THEN
        -- 获取课程的积分奖励
        SELECT points_reward INTO reward FROM project WHERE id = NEW.course_id;
        
        IF reward > 0 THEN
            -- 更新用户积分余额
            UPDATE user SET points_balance = points_balance + reward WHERE id = NEW.user_id;
            
            -- 创建积分交易记录
            INSERT INTO point_transaction (
                user_id, 
                transaction_type, 
                points_change, 
                balance_after, 
                description, 
                related_id
            )
            SELECT 
                NEW.user_id, 
                1, -- 获得积分
                reward, 
                (SELECT points_balance FROM user WHERE id = NEW.user_id), 
                CONCAT('完成课程《', project_name, '》获得积分'), 
                NEW.course_id
            FROM project WHERE id = NEW.course_id;
            
            -- 更新为已获得积分
            UPDATE course_watch_record SET is_rewarded = 1 WHERE id = NEW.id;
        END IF;
    END IF;
END //
DELIMITER ;

-- 创建或更新课程相关的视图
CREATE OR REPLACE VIEW v_courses AS
SELECT 
    p.id,
    p.project_name AS course_name,
    p.project_code AS course_code,
    p.负责人 AS instructor,
    p.start_date,
    p.end_date,
    p.status,
    p.description,
    p.creator_id,
    p.institution_id,
    p.category,
    p.video_url,
    p.cover_image_url,
    p.points_reward,
    p.duration,
    p.view_count,
    i.institution_name,
    p.create_time,
    p.update_time,
    CASE 
        WHEN p.category = 1 THEN '专业技能'
        WHEN p.category = 2 THEN '学术教育'
        WHEN p.category = 3 THEN '职业发展'
        WHEN p.category = 4 THEN '创新创业'
        WHEN p.category = 5 THEN '人文艺术'
        WHEN p.category = 6 THEN '科学技术'
        ELSE '未分类'
    END AS category_name
FROM 
    project p
LEFT JOIN 
    institution i ON p.institution_id = i.id;

-- 创建项目观看记录表
CREATE TABLE IF NOT EXISTS project_watch_record (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
  user_id BIGINT NOT NULL COMMENT '用户ID',
  project_id VARCHAR(36) NOT NULL COMMENT '项目ID',
  watch_status INT DEFAULT 0 COMMENT '观看状态：0-未完成，1-已完成',
  watch_progress INT DEFAULT 0 COMMENT '观看进度（百分比）',
  is_rewarded INT DEFAULT 0 COMMENT '是否已获得积分：0-未获得，1-已获得',
  last_watch_time DATETIME COMMENT '最后观看时间',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_user_project (user_id, project_id),
  INDEX idx_user_id (user_id),
  INDEX idx_project_id (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目观看记录表';

-- 创建触发器，当用户完成项目观看且未获得过积分时，自动给予积分奖励
DELIMITER //
CREATE TRIGGER reward_points_after_project_complete
AFTER UPDATE ON project_watch_record
FOR EACH ROW
BEGIN
    DECLARE project_points INT;
    
    -- 只有当观看状态从未完成变为已完成，且未获得过积分时才执行
    IF (OLD.watch_status = 0 AND NEW.watch_status = 1 AND NEW.is_rewarded = 0) THEN
        -- 获取项目奖励积分
        SELECT points_reward INTO project_points FROM project WHERE id = NEW.project_id;
        
        -- 如果有积分奖励，则更新用户积分并创建积分交易记录
        IF project_points > 0 THEN
            -- 更新用户积分
            UPDATE user 
            SET points_balance = points_balance + project_points
            WHERE id = NEW.user_id;
            
            -- 插入积分交易记录
            INSERT INTO point_transaction (user_id, transaction_type, points_change, description, related_id)
            SELECT 
                NEW.user_id, 
                1, -- 获得积分类型
                project_points, 
                CONCAT('完成项目《', project_name, '》获得积分'), 
                NEW.project_id
            FROM project 
            WHERE id = NEW.project_id;
            
            -- 标记为已获得积分
            UPDATE project_watch_record 
            SET is_rewarded = 1 
            WHERE id = NEW.id;
        END IF;
    END IF;
END //
DELIMITER ;

-- 添加索引优化查询性能
CREATE INDEX idx_project_institution_id ON project(institution_id);
CREATE INDEX idx_project_category ON project(category);
CREATE INDEX idx_project_watch_status ON project_watch_record(watch_status);
CREATE INDEX idx_project_user_watched ON project_watch_record(user_id, watch_status);

-- 14. 创建专家表 (expert)
DROP TABLE IF EXISTS expert;
CREATE TABLE expert (
    id BIGINT PRIMARY KEY COMMENT '专家ID, 与用户表ID一致',
    name VARCHAR(100) NOT NULL COMMENT '姓名',
    expertise VARCHAR(255) COMMENT '专业领域',
    contact VARCHAR(255) COMMENT '联系方式',
    status INT NOT NULL DEFAULT 1 COMMENT '状态: 1-启用, 0-禁用',
    description TEXT COMMENT '个人简介',
    creator_id BIGINT COMMENT '创建人ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专家表';

-- 机构表索引
CREATE INDEX idx_institution_code ON institution(institution_code);
CREATE INDEX idx_institution_type ON institution(institution_type);
CREATE INDEX idx_institution_level ON institution(institution_level);
CREATE INDEX idx_institution_status ON institution(status);
CREATE INDEX idx_institution_review_status ON institution(review_status);
CREATE INDEX idx_institution_region ON institution(province, city, district);
CREATE INDEX idx_institution_certification ON institution(certification_level);

-- 认证标准表索引
CREATE INDEX idx_certification_standard_code ON certification_standard(standard_code);
CREATE INDEX idx_certification_standard_category ON certification_standard(category);
CREATE INDEX idx_certification_standard_status ON certification_standard(status);
CREATE INDEX idx_certification_standard_review_status ON certification_standard(review_status);
CREATE INDEX idx_certification_standard_create_time ON certification_standard(create_time);

-- ========================================
-- 索引创建 (新增)
-- ========================================

-- 用户表索引
CREATE INDEX idx_user_username ON user(username);
CREATE INDEX idx_user_role ON user(role);
CREATE INDEX idx_user_institution_id ON user(institution_id);

-- 积分流水表索引
CREATE INDEX idx_point_transaction_user_id ON point_transaction(user_id);
CREATE INDEX idx_point_transaction_type ON point_transaction(transaction_type);
CREATE INDEX idx_point_transaction_time ON point_transaction(transaction_time);

-- 转换历史表索引
CREATE INDEX idx_conversion_history_user_id ON conversion_history(user_id);
CREATE INDEX idx_conversion_history_rule_id ON conversion_history(conversion_rule_id);
CREATE INDEX idx_conversion_history_time ON conversion_history(conversion_time);

-- 业务流程表索引
CREATE INDEX idx_business_process_code ON business_process(process_code);
CREATE INDEX idx_business_process_category ON business_process(category);
CREATE INDEX idx_business_process_status ON business_process(status);
CREATE INDEX idx_business_process_create_time ON business_process(create_time);

-- 平台活动表索引
CREATE INDEX idx_platform_activity_code ON platform_activity(activity_code);
CREATE INDEX idx_platform_activity_type ON platform_activity(activity_type);
CREATE INDEX idx_platform_activity_time ON platform_activity(start_time, end_time);
CREATE INDEX idx_platform_activity_status ON platform_activity(status);
CREATE INDEX idx_platform_activity_create_time ON platform_activity(create_time);

-- ========================================
-- 初始数据插入
-- ========================================


-- 插入积分规则初始数据
INSERT INTO point_rule (
    rule_name, rule_code, rule_description, point_type, point_value,
    applicable_object, validity_type, validity_days, status, creator_name, review_status
) VALUES 
('完成在线课程学习', 'ONLINE_COURSE_COMPLETE', '学员完成在线课程学习并通过考核可获得积分', 1, 50.00, 1, 1, NULL, 1, '系统管理员', 1);

-- 插入转换规则初始数据
DELETE FROM conversion_rule WHERE id > 0;
INSERT INTO conversion_rule (
    rule_name, rule_code, source_type, target_type, conversion_ratio,
    min_conversion_amount, max_conversion_amount, conversion_conditions,
    review_required, applicable_institution_id, applicable_institution_name,
    effective_start_time, effective_end_time, status, creator_name, review_status
) VALUES 
('积分转学分', 'POINT_TO_CREDIT', 1, 2, 10.0, 
10.0, 1000.0, '需完成至少一门课程学习', 
1, 1, '北京大学',
'2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '系统管理员', 1),
('学分转证书', 'CREDIT_TO_CERT', 2, 3, 1.0,
1.0, 100.0, '需通过相关考试',
1, 1, '北京大学',
'2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '系统管理员', 1);

-- 插入认证标准初始数据
DELETE FROM certification_standard WHERE id > 0;
INSERT INTO certification_standard (
    standard_name, standard_code, standard_description, category, issuing_organization,
    effective_start_time, effective_end_time, status, creator_name, review_status
) VALUES 
('在线课程完成认证', 'ONLINE_COURSE_CERT', '完成在线课程学习并通过考核的认证标准', 1, '国家开放大学', 
'2024-01-01 00:00:00', '2025-12-31 23:59:59', 1, '系统管理员', 1),

('职业技能等级证书', 'VOC_SKILL_CERT', '通过职业技能鉴定考试获得的等级证书标准', 4, '人力资源和社会保障部', 
'2024-03-01 00:00:00', '2026-02-28 23:59:59', 1, '系统管理员', 1);

-- 插入业务流程初始数据
DELETE FROM business_process WHERE id > 0;
INSERT INTO business_process (
    process_name, process_code, process_description, category, responsible_department, status, creator_name
) VALUES 
('在线课程积分获取流程', 'ONLINE_COURSE_POINT', '学员完成在线课程学习并自动获取积分的流程', 1, '教务处', 1, '系统管理员'),
('学分转换流程', 'CREDIT_CONVERSION', '学员申请学分转换并审核的流程', 2, '学分银行管理中心', 1, '系统管理员');

-- 插入平台活动初始数据
DELETE FROM platform_activity WHERE id > 0;
INSERT INTO platform_activity (
    activity_name, activity_code, activity_description, activity_type, start_time, end_time,
    location, organizer, contact_person, contact_phone, reward_points, status, creator_name
) VALUES 
('2024年度线上学习节', 'ONLINE_LEARNING_FEST', '平台用户参与线上课程学习的年度盛会', 1, '2024-07-01 09:00:00', '2024-07-31 23:59:59',
 '线上', '学分银行运营部', '王运营', '13912345678', 100.00, 1, '系统管理员'),

('学分银行线下交流会', 'OFFLINE_EXCHANGE', '邀请专家学者和机构代表进行学分银行发展交流', 2, '2024-08-15 14:00:00', '2024-08-15 17:00:00',
 '北京市海淀区会议中心', '学分银行管理中心', '李主任', '010-87654321', 50.00, 1, '系统管理员');




-- 插入项目初始数据
DELETE FROM project WHERE id > 0;
INSERT INTO project (
    id, project_name, project_code, 负责人, start_date, end_date, status, description, category, 
    video_url, cover_image_url, points_reward, duration, view_count
) VALUES
('PROJ001', '专业技能实战教程', 'XBANK_DEV', '张老师', '2024-01-01', '2024-12-31', 1, 
'专业技能实战教程，从入门到精通', 1, 
'https://www.w3schools.com/html/mov_bbb.mp4', 
'https://img.freepik.com/free-photo/close-up-hand-writing-notebook-top-view_23-2148888824.jpg', 
10, 45, 120),

('PROJ002', '学术研究方法指南', 'COURSE_SYS', '李老师', '2024-03-01', '2024-09-30', 1, 
'学术研究方法全面指南，提升学术能力', 2, 
'https://www.w3schools.com/html/mov_bbb.mp4', 
'https://img.freepik.com/free-photo/education-day-arrangement-table-with-books_23-2149241046.jpg', 
15, 60, 80),

('PROJ003', '职业发展规划', 'CAREER_DEV', '王教授', '2024-02-15', '2024-08-15', 1, 
'职业生涯规划与发展指导，助力职场进阶', 3, 
'https://www.w3schools.com/html/mov_bbb.mp4', 
'https://img.freepik.com/free-photo/business-planning-concept-with-wooden-blocks-papers_176474-7323.jpg', 
12, 50, 95),

('PROJ004', '创业指南与案例分析', 'STARTUP_GUIDE', '赵导师', '2024-04-01', '2024-10-31', 1, 
'创业实践指南与成功案例解析，激发创新精神', 4, 
'https://www.w3schools.com/html/mov_bbb.mp4', 
'https://img.freepik.com/free-photo/business-people-shaking-hands-together_53876-30616.jpg', 
20, 75, 65),

('PROJ005', '当代艺术赏析', 'ART_APPREC', '陈老师', '2024-03-15', '2024-09-15', 1, 
'当代艺术作品赏析与文化内涵解读', 5, 
'https://www.w3schools.com/html/mov_bbb.mp4', 
'https://img.freepik.com/free-photo/woman-watching-paintings-museum_23-2148851236.jpg', 
8, 40, 110),

('PROJ006', '前沿科技探索', 'TECH_EXPLORE', '刘教授', '2024-05-01', '2024-11-30', 1, 
'前沿科技发展与未来趋势探索', 6, 
'https://www.w3schools.com/html/mov_bbb.mp4', 
'https://img.freepik.com/free-photo/future-technology-human-experience_53876-97295.jpg', 
18, 65, 85);


-- ========================================
-- 验证数据插入
-- ========================================
-- 查看创建的表
SHOW TABLES;

-- 查看各表数据统计
SELECT 'point_rule' as table_name, COUNT(*) as record_count FROM point_rule
UNION ALL
SELECT 'conversion_rule' as table_name, COUNT(*) as record_count FROM conversion_rule  
UNION ALL
SELECT 'institution' as table_name, COUNT(*) as record_count FROM institution
UNION ALL
SELECT 'user' as table_name, COUNT(*) as record_count FROM user
UNION ALL
SELECT 'point_transaction' as table_name, COUNT(*) as record_count FROM point_transaction
UNION ALL
SELECT 'conversion_history' as table_name, COUNT(*) as record_count FROM conversion_history
UNION ALL
SELECT 'business_process' as table_name, COUNT(*) as record_count FROM business_process
UNION ALL
SELECT 'platform_activity' as table_name, COUNT(*) as record_count FROM platform_activity;

-- 显示创建完成信息
SELECT 
    '数据库创建完成！' as message,
    '数据库名称: internship_db' as database_info,
    '用户名: internship_user' as user_info,
    '密码: internship_pass' as password_info,
    '字符集: utf8mb4' as charset_info;

-- ========================================
-- 积分商城相关表
-- ========================================

-- 商品表
DROP TABLE IF EXISTS product;
CREATE TABLE product (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  name VARCHAR(100) NOT NULL COMMENT '商品名称',
  description TEXT COMMENT '商品描述',
  points DOUBLE NOT NULL COMMENT '所需积分',
  image_url VARCHAR(255) DEFAULT NULL COMMENT '商品图片URL',
  category VARCHAR(50) DEFAULT NULL COMMENT '商品分类',
  stock INT NOT NULL DEFAULT 0 COMMENT '库存数量',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-上架，0-下架',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_status (status),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分商城商品表';

-- 订单表
DROP TABLE IF EXISTS product_order;
CREATE TABLE product_order (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  user_id BIGINT NOT NULL COMMENT '用户ID',
  product_id BIGINT NOT NULL COMMENT '商品ID',
  points_used DOUBLE NOT NULL COMMENT '消耗积分',
  order_status TINYINT NOT NULL DEFAULT 1 COMMENT '订单状态：1-待发货，2-已发货，3-已完成，4-已取消',
  shipping_address VARCHAR(255) NOT NULL COMMENT '收货地址',
  contact_name VARCHAR(50) NOT NULL COMMENT '联系人姓名',
  contact_phone VARCHAR(20) NOT NULL COMMENT '联系电话',
  transaction_id BIGINT DEFAULT NULL COMMENT '交易记录ID',
  remark VARCHAR(255) DEFAULT NULL COMMENT '备注',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id),
  INDEX idx_order_status (order_status),
  INDEX idx_transaction_id (transaction_id),
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (product_id) REFERENCES product(id),
  FOREIGN KEY (transaction_id) REFERENCES point_transaction(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分商城订单表';

-- 添加商品示例数据
INSERT INTO product (name, description, points, image_url, category, stock, status) VALUES
('高级学习笔记本', '优质纸张，方便记录学习笔记', 500, 'https://img.freepik.com/free-psd/notebook-mockup_1310-1458.jpg', '学习用品', 100, 1),
('Python编程入门课程', '零基础入门Python编程的在线课程', 2000, 'https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg', '在线课程', 50, 1),
('便携式电子词典', '随时随地查询单词，提升学习效率', 1500, 'https://img.freepik.com/free-vector/electronic-dictionary-abstract-concept-illustration_335657-3875.jpg', '学习工具', 30, 1),
('职业规划咨询课程', '一对一职业发展指导课程', 3000, 'https://img.freepik.com/free-photo/business-planning-concept-with-wooden-blocks-papers_176474-7323.jpg', '咨询服务', 20, 1),
('智能学习平板', '支持手写笔记的学习平板', 5000, 'https://img.freepik.com/free-psd/digital-tablet-mockup_1310-706.jpg', '电子设备', 10, 1),
('英语口语课程', '实用英语口语训练课程', 2500, 'https://img.freepik.com/free-photo/english-british-england-language-education-concept_53876-124286.jpg', '在线课程', 40, 1);

