@echo off
echo ========================================
echo   Certificate Generator Startup
echo ========================================
echo.
echo Configured for: chhatbarabhishek1@outlook.com
echo.

REM Kill any existing process on port 3000
echo [1/4] Checking for existing processes on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    if not "%%a"=="0" (
        echo        Killing process %%a...
        taskkill /PID %%a /F >nul 2>&1
    )
)
echo        ✅ Port 3000 is available

REM Install dependencies if needed
echo [2/4] Checking dependencies...
if not exist "node_modules" (
    echo        Installing dependencies...
    npm install
) else (
    echo        ✅ Dependencies already installed
)

REM Check if .env file exists, if not copy from example
echo [3/4] Checking configuration...
if not exist ".env" (
    echo        Creating .env file from template...
    copy .env.example .env >nul
    echo.
    echo ⚠️  IMPORTANT: Update your Outlook password in .env file!
    echo    Open .env file and replace 'your_outlook_password_here' with your actual password
    echo.
    echo Press any key after updating the password...
    pause
) else (
    echo        ✅ Configuration file exists
)

REM Start the server
echo [4/4] Starting Certificate Generator Server...
echo.
npm start
