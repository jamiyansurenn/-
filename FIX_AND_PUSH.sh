#!/bin/bash
# Git identity тохируулж, commit болон push хийх

echo "🔧 Git identity тохируулж байна..."
git config --global user.email "jamiyansurenn@users.noreply.github.com"
git config --global user.name "jamiyansurenn"

echo ""
echo "💾 Commit хийж байна..."
git commit -m "Initial commit: Full stack corporate website with i18n support (MN/EN/中文)"

echo ""
echo "🚀 GitHub руу push хийж байна..."
echo "⚠️  Username: jamiyansurenn"
echo "⚠️  Password: Personal Access Token оруулах шаардлагатай!"
echo ""
git push -u origin main

echo ""
echo "✅ Бэлэн! Код GitHub дээр байна! 🎉"
