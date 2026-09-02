@echo off
echo ==========================================
echo Starting Cricket App...
echo ==========================================

:: Change directory to the folder where this batch file is located
cd /d "%~dp0"

:: Start the Backend in a new terminal window
echo [1/2] Starting Python/Flask Backend on port 5000...
start "Cricket App Backend" cmd /k "cd backend && python app.py"

:: Start the Frontend in a new terminal window
echo [2/2] Starting Next.js Frontend on port 3000...
start "Cricket App Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo Both servers have been launched!
echo.
echo Backend URL:  http://127.0.0.1:5000
echo Frontend URL: http://localhost:3000
echo ==========================================
echo.
echo You can minimize the started terminal windows.
echo To stop the servers, just close those windows.
echo.
pause
