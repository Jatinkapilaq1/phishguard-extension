@echo off
echo ========================================
echo    PhishGuard AI - Quick Start
echo ========================================
echo.
echo Opening files for you...
echo.

REM Open the icon generator
start "" "generate-icons.html"

REM Open Chrome extensions page
start "" "chrome://extensions/"

REM Open the test page
start "" "test-page.html"

echo.
echo Files opened:
echo 1. generate-icons.html - Generate extension icons
echo 2. Chrome Extensions - Load your extension
echo 3. test-page.html - Test the extension
echo.
echo Follow the steps in DEPLOYMENT.md for full instructions.
echo.
pause