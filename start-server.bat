@echo off
title LostFound PNL - Start Server
echo ========================================
echo   LostFound PNL - Starting Servers...
echo ========================================
echo.

echo [1/2] Starting Laravel Backend (php artisan serve)...
start "Laravel Server - LostFound PNL" cmd /k "cd /d "%~dp0" && php artisan serve"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend Dev Server (npm run dev)...
start "Vite Dev Server - LostFound PNL" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo ========================================
echo   Servers are running!
echo   Laravel  : http://127.0.0.1:8000
echo   Vite     : http://localhost:5173
echo ========================================
echo.
echo Buka browser ke: http://127.0.0.1:8000
echo.
pause
