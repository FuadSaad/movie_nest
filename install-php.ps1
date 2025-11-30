# Movie Recommender - Automatic PHP Setup Script
# This script downloads PHP 8.2, extracts it, and configures it

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Movie Recommender - Automatic PHP Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$phpVersion = "8.2.29"
$phpUrl = "https://windows.php.net/downloads/releases/php-$phpVersion-Win32-vs16-x64.zip"
$downloadPath = "$env:TEMP\php-$phpVersion.zip"
$installPath = "C:\php"

Write-Host "[1/6] Downloading PHP $phpVersion..." -ForegroundColor Yellow
Write-Host "URL: $phpUrl" -ForegroundColor Gray

try {
    # Download PHP
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $phpUrl -OutFile $downloadPath -UseBasicParsing
    Write-Host "[OK] Downloaded successfully!" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to download PHP" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "[2/6] Creating installation directory..." -ForegroundColor Yellow

if (Test-Path $installPath) {
    Write-Host "[!] C:\php already exists. Backing up..." -ForegroundColor Yellow
    $backupPath = "C:\php_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Move-Item -Path $installPath -Destination $backupPath -Force
    Write-Host "[OK] Backed up to $backupPath" -ForegroundColor Green
}

New-Item -ItemType Directory -Path $installPath -Force | Out-Null
Write-Host "[OK] Created $installPath" -ForegroundColor Green

Write-Host ""
Write-Host "[3/6] Extracting PHP..." -ForegroundColor Yellow

try {
    Expand-Archive -Path $downloadPath -DestinationPath $installPath -Force
    Write-Host "[OK] PHP extracted successfully!" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to extract PHP" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "[4/6] Configuring php.ini..." -ForegroundColor Yellow

$phpIniDev = Join-Path $installPath "php.ini-development"
$phpIni = Join-Path $installPath "php.ini"

if (Test-Path $phpIniDev) {
    Copy-Item -Path $phpIniDev -Destination $phpIni -Force
    
    # Enable extensions
    $content = Get-Content $phpIni
    $content = $content -replace ';extension=curl', 'extension=curl'
    $content = $content -replace ';extension=mbstring', 'extension=mbstring'
    $content = $content -replace ';extension=openssl', 'extension=openssl'
    $content = $content -replace ';extension_dir = "ext"', 'extension_dir = "ext"'
    
    Set-Content -Path $phpIni -Value $content
    Write-Host "[OK] php.ini configured with essential extensions" -ForegroundColor Green
} else {
    Write-Host "[!] php.ini-development not found, skipping configuration" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[5/6] Adding PHP to system PATH..." -ForegroundColor Yellow

$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$installPath*") {
    $newPath = "$currentPath;$installPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    # Update current session PATH
    $env:Path = "$env:Path;$installPath"
    Write-Host "[OK] PHP added to PATH" -ForegroundColor Green
} else {
    Write-Host "[OK] PHP already in PATH" -ForegroundColor Green
}

Write-Host ""
Write-Host "[6/6] Cleaning up..." -ForegroundColor Yellow
Remove-Item -Path $downloadPath -Force
Write-Host "[OK] Temporary files removed" -ForegroundColor Green

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "PHP Installation Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verify installation
Write-Host "Verifying installation..." -ForegroundColor Yellow
& "$installPath\php.exe" -v

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Close and reopen PowerShell/Terminal" -ForegroundColor White
Write-Host "2. Install Composer: https://getcomposer.org/Composer-Setup.exe" -ForegroundColor White
Write-Host "3. Download MongoDB extension from:" -ForegroundColor White
Write-Host "   https://pecl.php.net/package/mongodb" -ForegroundColor Gray
Write-Host "   Choose: PHP 8.2 Thread Safe (TS) x64" -ForegroundColor Gray
Write-Host "   Extract php_mongodb.dll to C:\php\ext\" -ForegroundColor Gray
Write-Host "   Add to php.ini: extension=mongodb" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Then run:" -ForegroundColor White
Write-Host "   cd e:\Project\Web\movie_recommendation" -ForegroundColor Gray
Write-Host "   composer install" -ForegroundColor Gray
Write-Host "   php -S localhost:8000" -ForegroundColor Gray
Write-Host ""

Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
