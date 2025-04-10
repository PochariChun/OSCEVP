#!/bin/bash

# 数据库配置
DB_NAME="virtual_patient_db"
DB_USER="user"
DB_PASSWORD="840128"  # 建议在生产环境中使用更安全的密码

echo "开始初始化数据库..."

# 检查PostgreSQL服务是否运行
if ! systemctl is-active --quiet postgresql; then
    echo "PostgreSQL服务未运行，正在启动..."
    sudo systemctl start postgresql
fi

# 创建数据库和用户
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "数据库 $DB_NAME 已存在"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "用户 $DB_USER 已存在"
sudo -u postgres psql -c "ALTER ROLE $DB_USER SET client_encoding TO 'utf8';"
sudo -u postgres psql -c "ALTER ROLE $DB_USER SET default_transaction_isolation TO 'read committed';"
sudo -u postgres psql -c "ALTER ROLE $DB_USER SET timezone TO 'UTC';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "数据库初始化完成！"
echo "数据库名称: $DB_NAME"
echo "用户名: $DB_USER"
echo "密码: $DB_PASSWORD"
echo "请在项目的settings.py文件中更新数据库配置" 