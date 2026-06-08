#!/bin/bash
# ========================================
# 像素英语世界 - 一键部署到 GitHub Pages
# ========================================

set -e

echo "🎮 像素英语世界 - GitHub Pages 部署脚本"
echo "========================================"
echo ""

# 检查是否安装 git
if ! command -v git &> /dev/null; then
    echo "❌ 请先安装 Git: https://git-scm.com/"
    exit 1
fi

# 检查是否在git仓库中
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    git checkout -b main
else
    echo "✅ Git 仓库已存在"
fi

# 添加文件
echo "📝 添加文件到暂存区..."
git add .

# 提交
read -p "请输入提交信息（默认: 更新）: " commit_msg
commit_msg=${commit_msg:-"更新"}
git commit -m "$commit_msg" || echo "⚠️  没有新的更改需要提交"

# 检查远程仓库
if ! git remote | grep -q "origin"; then
    echo ""
    echo "🔗 请输入你的 GitHub 仓库地址:"
    echo "例如: https://github.com/你的用户名/pixel-english-world.git"
    read -p "仓库地址: " repo_url
    
    if [ -n "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo "✅ 远程仓库已添加"
    else
        echo "❌ 未输入仓库地址，跳过推送"
        echo ""
        echo "💡 稍后可以手动添加:"
        echo "   git remote add origin 你的仓库地址"
        echo "   git push -u origin main"
        exit 0
    fi
fi

# 推送
echo ""
echo "🚀 推送到 GitHub..."
if git push -u origin main 2>&1; then
    echo ""
    echo "🎉 推送成功！"
    echo ""
    echo "📋 接下来的步骤："
    echo "1. 打开你的 GitHub 仓库页面"
    echo "2. 进入 Settings → Pages"
    echo "3. Source 选择 Deploy from a branch"
    echo "4. Branch 选择 main / root"
    echo "5. 点击 Save，等待几分钟"
    echo ""
    echo "🌐 部署完成后访问: https://你的用户名.github.io/仓库名/"
else
    echo ""
    echo "❌ 推送失败，请检查仓库地址和权限"
    exit 1
fi

echo ""
echo "✨ 部署完成！祝学习愉快！"