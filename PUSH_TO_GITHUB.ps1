# GitHub Push Script - Git Bash эсвэл шинэ PowerShell дээр ажиллуулна

Write-Host "🚀 GitHub Push Script" -ForegroundColor Green
Write-Host ""

# PATH шинэчлэх
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Git байгаа эсэхийг шалгах
$gitPath = "C:\Program Files\Git\cmd\git.exe"
if (Test-Path $gitPath) {
    Write-Host "✅ Git олдлоо: $gitPath" -ForegroundColor Green
} else {
    Write-Host "❌ Git олдсонгүй. PowerShell-ийг дахин нээнэ үү!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📁 Project folder руу очиж байна..." -ForegroundColor Cyan
Set-Location "C:\Users\hitech\Desktop\copy mon"

Write-Host ""
Write-Host "🔧 Git initialize хийж байна..." -ForegroundColor Cyan
& $gitPath init

Write-Host ""
Write-Host "📦 Бүх файл нэмж байна..." -ForegroundColor Cyan
& $gitPath add .

Write-Host ""
Write-Host "💾 Commit хийж байна..." -ForegroundColor Cyan
& $gitPath commit -m "Initial commit: Full stack corporate website with i18n support (MN/EN/中文)"

Write-Host ""
Write-Host "🌿 Main branch үүсгэж байна..." -ForegroundColor Cyan
& $gitPath branch -M main

Write-Host ""
Write-Host "🔗 Remote repository нэмж байна..." -ForegroundColor Cyan
# Remove existing remote if exists
& $gitPath remote remove origin 2>$null
& $gitPath remote add origin https://github.com/jamiyansurenn/-.git

Write-Host ""
Write-Host "🚀 GitHub руу push хийж байна..." -ForegroundColor Cyan
Write-Host "⚠️  Username: jamiyansurenn" -ForegroundColor Yellow
Write-Host "⚠️  Password: Personal Access Token оруулах шаардлагатай!" -ForegroundColor Yellow
Write-Host ""
& $gitPath push -u origin main

Write-Host ""
Write-Host "✅ Бэлэн! Код GitHub дээр байна! 🎉" -ForegroundColor Green
