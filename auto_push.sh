#!/bin/bash
# Автоматаар бүх кодыг GitHub руу push хийх (SSH)

# set -e устгасан - алдаа гарвал үргэлжлүүлэх

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

# Remote нэмэх/шинэчлэх (HTTPS - Personal Access Token ашиглах)
echo "🔗 Remote repository тохируулж байна..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/jamiyansurenn/-.git

# Бүх файл нэмэх
echo "📦 Бүх файл нэмж байна..."
git add .

# Commit хийх
echo "💾 Commit хийж байна..."
if ! git diff --staged --quiet || ! git diff --quiet; then
    # Staged эсвэл unstaged өөрчлөлт байгаа бол commit хийх
    git commit -m "Initial commit: Full stack corporate website with i18n support (MN/EN/中文)" 2>/dev/null || \
    git commit -m "Update: Full stack corporate website" 2>/dev/null || \
    git commit --allow-empty -m "Initial commit: Full stack corporate website" 2>/dev/null || true
else
    # Commit байхгүй бол empty commit хийх
    if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
        echo "ℹ️  Эхний commit хийж байна..."
        git commit --allow-empty -m "Initial commit: Full stack corporate website with i18n support (MN/EN/中文)"
    else
        echo "ℹ️  Өөрчлөлт байхгүй"
    fi
fi

# Main branch
echo "🌿 Main branch тохируулж байна..."
git branch -M main 2>/dev/null || true

# Push хийх
echo ""
echo "🚀 GitHub руу push хийж байна..."
echo "================================"
echo "⚠️  Username: jamiyansurenn"
echo "⚠️  Password: Personal Access Token оруулах шаардлагатай!"
echo ""
git push -u origin main 2>&1 || {
    echo ""
    echo "❌ Push хийхэд алдаа гарлаа!"
    echo "💡 Personal Access Token үүсгэж, password-ийн оронд ашиглана уу!"
    echo "   GitHub → Settings → Developer settings → Personal access tokens"
    exit 1
}

echo ""
echo "✅ Амжилттай! Бүх код GitHub дээр байна! 🎉"
echo "📍 Repository: https://github.com/jamiyansurenn/-"
echo ""
