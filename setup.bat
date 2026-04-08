@echo off
echo 🚀 Installing everything...

REM Install Node.js packages
echo Installing npm packages...
npm init -y
npm install express mongoose dotenv cors

echo.
echo ✅ All set! Run this next:
echo.
echo node app.js
echo.
echo Then open: http://localhost:3000
pause
