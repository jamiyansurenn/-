#!/bin/bash
# Автоматаар бүх кодыг GitHub руу push хийх (SSH)

set -e  # Алдаа гарвал зогсох

echo "🚀 Автомат GitHub Push Script"
echo "================================"
echo ""

cd "/c/Users/hitech/Desktop/copy mon"

# Git identity тохируулах
echo "🔧 Git identity тохируулж байна..."
git config --global user.email "jamiyansurenn@users.noreply.github.com" 2>/dev/null || true
git config --global user.name "jamiyansurenn" 2>/dev/null || true

# Git initialize (хэрэв хийгээгүй бол)
if [ ! -d ".git" ]; then
    echo "🔧 Git initialize хийж байна..."
    git init
fi

# Remote нэмэх/шинэчлэх (SSH)
echo "🔗 Remote repository тохируулж байна..."
git remote remove origin 2>/dev/null || true
git remote add origin git@github.com:jamiyansurenn/-.git

# Бүх файл нэмэх
echo "📦 Бүх файл нэмж байна..."
git add .

# Commit хийх (хэрэв өөрчлөлт байгаа бол)
echo "💾 Commit хийж байна..."
if git diff --staged --quiet; then
    echo "ℹ️  Өөрчлөлт байхгүй, commit хийх шаардлагагүй"
else
    git commit -m "Initial commit: Full stack corporate website with i18n support (MN/EN/中文)" || \
    git commit -m "Update: Full stack corporate website" || true
fi

# Main branch
echo "🌿 Main branch тохируулж байна..."
git branch -M main 2>/dev/null || true

# Push хийх
echo ""
echo "🚀 GitHub руу push хийж байна..."
echo "================================"
git push -u origin main --force 2>&1 || git push -u origin main 2>&1

echo ""
echo "✅ Амжилттай! Бүх код GitHub дээр байна! 🎉"
echo "📍 Repository: https://github.com/jamiyansurenn/-"
echo ""
