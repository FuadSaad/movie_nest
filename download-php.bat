@echo off
echo ============================================
echo Movie Recommender - PHP Download Helper
echo ============================================
echo.
echo You have PHP SOURCE CODE, but you need COMPILED BINARIES.
echo.
echo Opening download page in your browser...
echo.
echo DOWNLOAD THIS:
echo   PHP 8.2 VS16 x64 Thread Safe (ZIP)
echo   Size: ~30MB
echo.
echo After downloading:
echo   1. Extract to C:\php
echo   2. Run this script again
echo.
pause
start https://windows.php.net/download/

echo.
echo After extracting PHP to C:\php, would you like to add it to PATH?
set /p ADD_PATH="Add C:\php to system PATH? (y/n): "

if /i "%ADD_PATH%"=="y" (
    echo.
    echo Adding C:\php to PATH...
    setx PATH "%PATH%;C:\php"
    echo.
    echo Done! Please restart your terminal and run:
    echo   php -v
    echo.
)

pause
