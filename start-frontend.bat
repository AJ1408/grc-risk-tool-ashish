@echo off
echo ========================================
echo   GRC Risk Assessment Dashboard
echo   Frontend Starter
echo ========================================
echo.

cd /d "%~dp0frontend"

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Installing/Updating dependencies...
echo This may take a few minutes on first run...
call npm install

echo.
echo ========================================
echo   Starting React Development Server
echo   URL: http://localhost:3000
echo ========================================
echo.
echo Browser will open automatically
echo Press Ctrl+C to stop the server
echo.

call npm start
