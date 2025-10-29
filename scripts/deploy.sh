#!/bin/bash

# 自动化部署脚本
# 使用方法: ./deploy.sh

echo "🚀 开始部署博客..."

# 检查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  检测到未提交的更改，正在提交..."
    git add .
    git commit -m "Add new post - $(date '+%Y-%m-%d %H:%M:%S')"
else
    echo "✅ 没有未提交的更改"
fi

# 构建项目
echo "📦 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误"
    exit 1
fi

# 推送到远程仓库
echo "📤 推送到远程仓库..."
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ 推送失败，请检查网络连接"
    exit 1
fi

echo "✅ 部署成功！"
echo "📝 你的新文章应该已经在服务器上可用了"
echo ""
echo "部署摘要:"
echo "- 代码已推送到远程仓库"
echo "- 项目已构建完成"
echo "- 服务器会自动更新（如果配置了CI/CD）"