@echo off
title LostFound PNL - Stop Server
echo ========================================
echo   LostFound PNL - Stopping Servers...
echo ========================================
echo.

echo [1/2] Menghentikan proses php artisan serve...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
    echo     Port 8000 dibebaskan. (PID: %%a)
)

echo [2/2] Menghentikan proses npm / node (Vite)...
taskkill /F /IM "node.exe" /T >nul 2>&1
if %errorlevel% equ 0 (
    echo     Proses Node.js berhasil dihentikan.
) else (
    echo     Tidak ada proses Node.js yang berjalan.
)

echo.
echo ========================================
echo   Semua server telah dihentikan!
echo ========================================
echo.
pause
