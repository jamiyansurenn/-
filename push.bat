@echo off
chcp 65001 >nul
echo ========================================
echo  Автомат GitHub Push
echo ========================================
echo.

REM Git Bash-ийг ажиллуулах
"C:\Program Files\Git\git-bash.exe" auto_push.sh

pause
