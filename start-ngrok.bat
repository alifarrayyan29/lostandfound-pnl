@echo off
title LostFound PNL - Start Ngrok Server
echo ========================================
echo   LostFound PNL - Starting Ngrok Tunnel
echo ========================================
echo.

where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] ngrok belum terpasang atau belum masuk ke PATH!
    echo Silakan download ngrok dari https://ngrok.com/download
    echo dan pastikan authtoken sudah diatur (ngrok config add-authtoken ^<token^>).
    echo.
    pause
    exit /b 1
)

echo [1/2] Menjalankan Laravel Backend (php artisan serve)...
start "Laravel Server - LostFound PNL" cmd /k "cd /d "%~dp0" && php artisan serve"

timeout /t 2 /nobreak >nul

echo [2/2] Menjalankan Ngrok Tunnel (port 8000)...
start "Ngrok Tunnel - LostFound PNL" cmd /k "ngrok http 8000"

echo.
echo ========================================
echo   Server & Ngrok Berhasil Dijalankan!
echo   Lihat jendela Ngrok untuk menyalin URL publik (https://...ngrok-free.app)
echo ========================================
echo.
pause

