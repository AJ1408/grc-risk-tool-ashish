@echo off
echo ========================================
echo   GRC Risk Assessment Dashboard
echo   Backend Server Starter
echo ========================================
echo.

cd /d "%~dp0backend"

echo Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

echo.
echo Installing/Updating dependencies...
pip install -r requirements.txt

echo.
echo ========================================
echo   Starting FastAPI Backend Server
echo   URL: http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py
