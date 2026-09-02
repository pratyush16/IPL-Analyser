@echo off
echo ==========================================
echo       Starting IPL Cricket App...
echo ==========================================
echo.

cd /d "%~dp0"

:: 1. Check & install Frontend dependencies if missing
if not exist "frontend\node_modules\" (
    echo [Setup] Installing Frontend dependencies (npm install)...
    cd frontend
    call npm install
    cd "%~dp0"
    echo [Setup] Frontend dependencies installed!
    echo.
)

:: 2. Check & install Backend dependencies
echo [Setup] Checking Python packages...
cd backend
python -m pip install -r requirements.txt >nul 2>&1
cd "%~dp0"
echo [Setup] Python dependencies checked!
echo.

:: 3. Launch Backend Server
echo [1/2] Launching Flask Backend on port 5000...
start "Cricket App Backend" cmd /k "cd /d "%~dp0backend" && python app.py"

:: 4. Launch Frontend Dev Server
echo [2/2] Launching Next.js Frontend on port 3000...
start "Cricket App Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ==========================================
echo Both servers launched successfully!
echo.
echo Backend API:  http://127.0.0.1:5000
echo Frontend App: http://localhost:3000
echo ==========================================
echo.
echo Leave the terminal windows open in the background.
pause
