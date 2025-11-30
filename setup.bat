@echo off
REM Movie Recommender - Quick Setup Script
REM This script helps you configure the application

echo ============================================
echo Movie Recommender - Configuration Helper
echo ============================================
echo.

REM Check if Composer is installed
echo [1/5] Checking Composer installation...
where composer >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Composer is installed
    composer --version
) else (
    echo [!] Composer is NOT installed
    echo     Download from: https://getcomposer.org/
    echo     Install and restart this script
    pause
    exit /b 1
)
echo.

REM Check if MongoDB extension is loaded
echo [2/5] Checking PHP MongoDB extension...
php -m | findstr /C:"mongodb" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB extension is loaded
) else (
    echo [!] MongoDB extension is NOT installed
    echo     Install with: pecl install mongodb
    echo     Then add to php.ini: extension=mongodb
    pause
    exit /b 1
)
echo.

REM Install Composer dependencies
echo [3/5] Installing Composer dependencies...
if exist vendor (
    echo [OK] Vendor folder exists
) else (
    echo Installing MongoDB library...
    composer install
    if %ERRORLEVEL% NEQ 0 (
        echo [!] Composer install failed
        pause
        exit /b 1
    )
)
echo.

REM Check configuration
echo [4/5] Checking configuration...
findstr /C:"YOUR_TMDB_API_KEY_HERE" api\config.php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [!] TMDB API key not configured
    echo     Edit api\config.php and add your TMDB API key
    echo     Get one at: https://developers.themoviedb.org/
) else (
    echo [OK] TMDB API key appears to be set
)

findstr /C:"<db_password>" api\config.php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [!] MongoDB password not configured
    echo     Edit api\config.php and replace ^<db_password^> with your actual password
) else (
    echo [OK] MongoDB password appears to be set
)
echo.

REM Start server option
echo [5/5] Setup complete!
echo.
echo ============================================
echo Next Steps:
echo ============================================
echo 1. Edit api\config.php with your:
echo    - TMDB API key
echo    - MongoDB password
echo.
echo 2. Start the development server:
echo    php -S localhost:8000
echo.
echo 3. Open in browser:
echo    http://localhost:8000/public/
echo.
echo Or use Apache/XAMPP and access via:
echo    http://localhost/movie_recommendation/public/
echo ============================================
echo.

set /p START="Start PHP development server now? (y/n): "
if /i "%START%"=="y" (
    echo.
    echo Starting server on http://localhost:8000
    echo Press Ctrl+C to stop
    echo.
    php -S localhost:8000
)
