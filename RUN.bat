@echo off
TITLE Legal Luminaire - Complete System Startup
COLOR 0A

echo ========================================================
echo        LEGAL LUMINAIRE - SYSTEM STARTUP SCRIPT
echo ========================================================
echo.

echo [1/2] Starting Backend API Server (Port 8000)...
start "Legal Luminaire - API Backend" cmd /c "cd artifacts\api-server && set NODE_ENV=development&& pnpm run build && pnpm run start"

echo [2/2] Starting Frontend App (Port 5173)...
start "Legal Luminaire - Web Frontend" cmd /c "cd artifacts\legal-luminaire && pnpm run dev"

echo.
echo ========================================================
echo Services are launching in separate command windows.
echo - Web UI:  http://localhost:5173
echo - API Base: http://localhost:8000
echo ========================================================
echo.
pause
