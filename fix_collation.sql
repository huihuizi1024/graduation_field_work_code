-- 修复字符集冲突问题
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = utf8mb4_unicode_ci;

-- 使用数据库
USE internship_db;

-- 修改数据库默认字符集和排序规则
ALTER DATABASE internship_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 查询并显示所有表的字符集和排序规则
SELECT 
    TABLE_NAME, 
    TABLE_COLLATION, 
    CCSA.character_set_name 
FROM 
    information_schema.TABLES AS T,
    information_schema.COLLATION_CHARACTER_SET_APPLICABILITY AS CCSA
WHERE 
    CCSA.collation_name = T.table_collation
    AND T.table_schema = 'internship_db';

-- 修复所有表的字符集和排序规则
ALTER TABLE project CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE project_watch_record CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE point_transaction CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE user CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE product CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE product_order CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE transaction CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE institution CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE expert CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE platform_activity CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE business_process CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE certification_standard CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE conversion_rule CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE point_rule CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 检查并修复可能存在的字符集差异的列
-- 修复project_id列字符集一致性
ALTER TABLE project_watch_record MODIFY project_id VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 清理可能存在的无效记录（仅在确认后取消注释）
-- DELETE FROM project_watch_record WHERE project_id NOT IN (SELECT id FROM project);

-- 显示修改后的表信息
SHOW TABLE STATUS WHERE Name = 'project_watch_record';
SHOW TABLE STATUS WHERE Name = 'project';

-- 显示项目表的列信息
SHOW FULL COLUMNS FROM project;
SHOW FULL COLUMNS FROM project_watch_record; 