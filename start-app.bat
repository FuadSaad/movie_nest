@echo off
echo ============================================
echo Movie Recommender - Final Setup
echo ============================================
echo.

echo [Step 1/4] Checking PHP installation...
where php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] PHP found!
    php -v
) else (
    echo [!] PHP not found in PATH
    echo.
    echo Please restart your terminal/PowerShell and try again.
    echo After installing PHP and Composer, you MUST restart the terminal.
    echo.
    pause
    exit /b 1
)

echo.
echo [Step 2/4] Checking Composer installation...
where composer >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Composer found!
    composer --version
) else (
    echo [!] Composer not found in PATH
    echo.
    echo Please restart your terminal/PowerShell and try again.
    echo.
    pause
    exit /b 1
)

echo.
echo [Step 3/4] Installing MongoDB library...
if exist vendor (
    echo [OK] Dependencies already installed
) else (
    echo Installing MongoDB PHP library...
    composer install
    if %ERRORLEVEL% NEQ 0 (
        echo [!] Composer install failed
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed!
)

echo.
echo [Step 4/4] Checking MongoDB extension...
php -m | findstr /C:"mongodb" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB extension is loaded
) else (
    echo [!] MongoDB extension is NOT installed
    echo.
    echo MongoDB extension is needed for favorites feature.
    echo.
    echo To install:
    echo 1. Download from: https://pecl.php.net/package/mongodb
    echo 2. Choose version matching your PHP
    echo 3. Extract php_mongodb.dll to C:\php\ext\
    echo 4. Edit C:\php\php.ini and add: extension=mongodb
    echo.
    echo App will work without it, but favorites won't save.
)

echo.
echo ============================================
echo Setup Complete! Ready to Start
echo ============================================
echo.
echo To start your movie app:
echo   php -S localhost:8000
echo.
echo Then open in browser:
echo   http://localhost:8000/public/
echo.
echo Press any key to start the server now...
pause >nul

echo.
echo Starting server on http://localhost:8000
echo Press Ctrl+C to stop
echo.
php -S localhost:8000
