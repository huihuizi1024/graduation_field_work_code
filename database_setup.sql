-- ========================================
-- 终身学习学分银行平台积分管理系统
-- MySQL 8.0 数据库创建脚本
-- 作者: huihuizi1024
-- 日期: 2025.6.22
-- 版本: 1.2.0
-- ========================================

-- 1. 创建数据库
DROP DATABASE IF EXISTS internship_db;
CREATE DATABASE internship_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

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
    review_time DATETIME COMMENT '审核时间',
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
    review_time DATETIME COMMENT '审核时间',
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
    status INT NOT NULL DEFAULT 1 COMMENT '状态：1-正常，2-暂停，3-注销',
    creator_id BIGINT COMMENT '创建人ID',
    creator_name VARCHAR(100) COMMENT '创建人姓名',
    reviewer_id BIGINT COMMENT '审核人ID',
    reviewer_name VARCHAR(100) COMMENT '审核人姓名',
    review_status INT DEFAULT 0 COMMENT '审核状态：0-待审核，1-审核通过，2-审核拒绝',
    review_time DATETIME COMMENT '审核时间',
    review_comment TEXT COMMENT '审核意见',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='机构表';

-- ========================================
-- 索引创建
-- ========================================

-- 积分规则表索引
CREATE INDEX idx_point_rule_code ON point_rule(rule_code);
CREATE INDEX idx_point_rule_type ON point_rule(point_type);
CREATE INDEX idx_point_rule_status ON point_rule(status);
CREATE INDEX idx_point_rule_review_status ON point_rule(review_status);
CREATE INDEX idx_point_rule_create_time ON point_rule(create_time);
CREATE INDEX idx_point_rule_name ON point_rule(rule_name);

-- 转换规则表索引
CREATE INDEX idx_conversion_rule_code ON conversion_rule(rule_code);
CREATE INDEX idx_conversion_source_type ON conversion_rule(source_type);
CREATE INDEX idx_conversion_target_type ON conversion_rule(target_type);
CREATE INDEX idx_conversion_status ON conversion_rule(status);
CREATE INDEX idx_conversion_review_status ON conversion_rule(review_status);
CREATE INDEX idx_conversion_institution_id ON conversion_rule(applicable_institution_id);
CREATE INDEX idx_conversion_effective_time ON conversion_rule(effective_start_time, effective_end_time);

-- 机构表索引
CREATE INDEX idx_institution_code ON institution(institution_code);
CREATE INDEX idx_institution_type ON institution(institution_type);
CREATE INDEX idx_institution_level ON institution(institution_level);
CREATE INDEX idx_institution_status ON institution(status);
CREATE INDEX idx_institution_review_status ON institution(review_status);
CREATE INDEX idx_institution_region ON institution(province, city, district);
CREATE INDEX idx_institution_certification ON institution(certification_level);

-- ========================================
-- 初始数据插入
-- ========================================

-- 插入机构初始数据
INSERT INTO institution (
    institution_name, institution_code, institution_type, institution_level,
    social_credit_code, legal_representative, contact_person, contact_phone, contact_email,
    province, city, district, institution_description, business_scope,
    certification_level, status, creator_name, review_status
) VALUES 
('北京大学', 'PKU', 1, 1, '12100000400000624X', '龚旗煌', '张老师', '010-62752114', 'contact@pku.edu.cn',
 '北京市', '北京市', '海淀区', '中国近现代第一所国立综合性大学', '高等教育、科学研究', 1, 1, '系统管理员', 1),

('清华大学', 'THU', 1, 1, '12100000400000086T', '王希勤', '李老师', '010-62793001', 'contact@tsinghua.edu.cn',
 '北京市', '北京市', '海淀区', '中国著名高等学府，中国高层次人才培养和科学技术研究的重要基地', '高等教育、科学研究', 1, 1, '系统管理员', 1),

('中国人民大学', 'RUC', 1, 1, '12100000400000098K', '林尚立', '王老师', '010-62511340', 'contact@ruc.edu.cn',
 '北京市', '北京市', '海淀区', '中国共产党创办的第一所新型正规大学', '高等教育、人文社会科学研究', 1, 1, '系统管理员', 1),

('职业技能培训中心', 'VSTC', 3, 3, '91110108MA01ABCD12', '赵主任', '刘老师', '010-12345678', 'contact@vstc.edu.cn',
 '北京市', '北京市', '朝阳区', '专业的职业技能培训机构', '职业技能培训、技能鉴定', 3, 1, '系统管理员', 1);

-- 插入积分规则初始数据
INSERT INTO point_rule (
    rule_name, rule_code, rule_description, point_type, point_value,
    applicable_object, validity_type, validity_days, status, creator_name, review_status
) VALUES 
('完成在线课程学习', 'ONLINE_COURSE_COMPLETE', '学员完成在线课程学习并通过考核可获得积分', 1, 50.00, 1, 1, NULL, 1, '系统管理员', 1),

('参与学术讲座', 'ACADEMIC_LECTURE', '参与学术讲座或研讨会可获得积分', 2, 20.00, 1, 3, 365, 1, '系统管理员', 1),

('发表学术论文', 'PUBLISH_PAPER', '在期刊或会议上发表学术论文可获得积分', 3, 200.00, 2, 1, NULL, 1, '系统管理员', 1),

('参与社区服务', 'COMMUNITY_SERVICE', '参与社区志愿服务活动可获得积分', 2, 30.00, 1, 3, 180, 1, '系统管理员', 1),

('技能认证考试', 'SKILL_CERTIFICATION', '通过技能认证考试可获得积分', 1, 100.00, 1, 1, NULL, 1, '系统管理员', 1);

-- 插入转换规则初始数据
INSERT INTO conversion_rule (
    rule_name, rule_code, source_type, target_type, conversion_ratio,
    min_conversion_amount, max_conversion_amount, conversion_conditions,
    review_required, status, creator_name, review_status, effective_start_time, effective_end_time
) VALUES 
('积分转学分规则', 'POINT_TO_CREDIT', 1, 2, 10.0000, 100.00, 1000.00, 
 '学习积分可按10:1的比例转换为学分，需要完成相应的学习任务验证', 1, 1, '系统管理员', 1, 
 '2025-01-01 00:00:00', '2025-12-31 23:59:59'),

('学分转积分规则', 'CREDIT_TO_POINT', 2, 1, 0.1000, 1.00, 50.00,
 '学分可按1:10的比例转换为积分，适用于需要积分补充的情况', 0, 1, '系统管理员', 1,
 '2025-01-01 00:00:00', '2025-12-31 23:59:59'),

('证书转积分规则', 'CERT_TO_POINT', 3, 1, 1.0000, 1.00, 10.00,
 '获得的职业证书可按证书等级转换为相应积分', 1, 1, '系统管理员', 1,
 '2025-01-01 00:00:00', '2025-12-31 23:59:59'),

('积分转证书规则', 'POINT_TO_CERT', 1, 3, 500.0000, 500.00, 2000.00,
 '达到一定积分可申请相应等级的能力证书', 1, 1, '系统管理员', 1,
 '2025-01-01 00:00:00', '2025-12-31 23:59:59');

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
SELECT 'institution' as table_name, COUNT(*) as record_count FROM institution;

-- 显示创建完成信息
SELECT 
    '数据库创建完成！' as message,
    '数据库名称: internship_db' as database_info,
    '用户名: internship_user' as user_info,
    '密码: internship_pass' as password_info,
    '字符集: utf8mb4' as charset_info; 