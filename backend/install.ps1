# Backend Installation Script for Windows PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "Removing existing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
}

# Check if package-lock.json exists
if (Test-Path "package-lock.json") {
    Write-Host "Removing package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Installing dependencies with --legacy-peer-deps..." -ForegroundColor Green
npm install --legacy-peer-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Installation failed. Trying with --force..." -ForegroundColor Yellow
    npm install --legacy-peer-deps --force
}

Write-Host ""
Write-Host "Generating Prisma Client..." -ForegroundColor Green
npx prisma@5.7.1 generate

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create .env file (use: node setup-env.js)" -ForegroundColor White
Write-Host "2. Update DATABASE_URL in .env" -ForegroundColor White
Write-Host "3. Run: npx prisma@5.7.1 migrate dev" -ForegroundColor White
Write-Host "4. Run: npm run prisma:seed" -ForegroundColor White
Write-Host "5. Run: npm run dev" -ForegroundColor White
Write-Host ""
