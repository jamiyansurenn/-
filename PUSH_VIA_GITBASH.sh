#!/bin/bash
# Git Bash дээр ажиллуулах script

echo "🚀 GitHub Push Script"
echo ""

cd "/c/Users/hitech/Desktop/copy mon"

echo "🔧 Git initialize хийж байна..."
git init

echo ""
echo "📦 Бүх файл нэмж байна..."
git add .

echo ""
echo "💾 Commit хийж байна..."
git commit -m "Initial commit: Full stack corporate website with i18n support (MN/EN/中文)"

echo ""
echo "🌿 Main branch үүсгэж байна..."
git branch -M main

echo ""
echo "🔗 Remote repository нэмж байна..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/jamiyansurenn/-.git

echo ""
echo "🚀 GitHub руу push хийж байна..."
echo "⚠️  Username: jamiyansurenn"
echo "⚠️  Password: Personal Access Token оруулах шаардлагатай!"
echo ""
git push -u origin main

echo ""
echo "✅ Бэлэн! Код GitHub дээр байна! 🎉"
