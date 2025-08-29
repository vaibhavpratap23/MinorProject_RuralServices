@echo off
echo ========================================
echo    Rural Services - Startup Script
echo ========================================
echo.

echo Starting all services...
echo.

echo [1/4] Starting Backend (Spring Boot)...
set "POWERSHELL=powershell -NoProfile -ExecutionPolicy Bypass"
%POWERSHELL% -File "%~dp0run.ps1"
goto :eof

echo [2/4] Waiting for backend to start...
timeout /t 20 /nobreak >nul

echo [3/4] Starting Frontend (React)...
echo    Port: 5173
start "Frontend" cmd /k "cd frontend && npm run dev"

echo [4/4] Starting Admin Panel...
echo    Port: 5174
start "Admin" cmd /k "cd admin && npm run dev"

echo.
echo ========================================
echo    All services started!
echo ========================================
echo.
echo Access URLs:
echo    Backend API:    http://localhost:8081
echo    H2 Console:     http://localhost:8081/h2-console
echo    Frontend:       http://localhost:5173
echo    Admin Panel:    http://localhost:5174
echo.
echo Press any key to close this window...
pause >nul
