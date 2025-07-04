-- 为user表添加avatar_url字段
USE internship_db;

-- 检查avatar_url字段是否已存在，如果不存在则添加
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'user' 
     AND table_schema = 'internship_db' 
     AND column_name = 'avatar_url') > 0,
    "SELECT 'avatar_url字段已存在' as result;",
    "ALTER TABLE user ADD COLUMN avatar_url VARCHAR(500) DEFAULT NULL COMMENT '用户头像URL';"
));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 显示表结构确认
DESCRIBE user; 