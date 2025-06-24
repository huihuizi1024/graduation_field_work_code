-- 修复编码问题的SQL脚本
-- 设置客户端字符集
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 使用数据库
USE internship_db;

-- 删除现有的机构数据
DELETE FROM institution;

-- 重新插入机构数据，确保使用正确的UTF-8编码
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

-- 验证插入的数据
SELECT id, institution_name, institution_code, contact_person FROM institution; 