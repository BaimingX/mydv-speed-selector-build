@echo off
setlocal

cd /d "%~dp0"
title myDV Cookie Login

echo myDV Cookie Login Helper
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found in PATH.
  echo Install Node.js, then double-click this file again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo node_modules is missing.
  echo Run npm install in this folder first, or use the packaged build output.
  echo.
  pause
  exit /b 1
)

node extract-douyin-cookie.mjs
set "EXIT_CODE=%ERRORLEVEL%"

echo.
if not "%EXIT_CODE%"=="0" (
  echo Login helper exited with code %EXIT_CODE%.
) else (
  echo Login helper finished.
)

echo.
pause
exit /b %EXIT_CODE%
