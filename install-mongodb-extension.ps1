# Install MongoDB PHP Extension
# Run this in PowerShell as Administrator

Write-Host "MongoDB PHP Extension Installer" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if PHP is installed
$phpPath = where.exe php 2>$null
if (-not $phpPath) {
    Write-Host "ERROR: PHP not found in PATH!" -ForegroundColor Red
    Write-Host "Please install PHP first or add it to your PATH" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found PHP at: $phpPath" -ForegroundColor Green

# Get PHP version
$phpVersion = php -r "echo PHP_VERSION;"
$phpMajorMinor = php -r "echo PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION;"
Write-Host "PHP Version: $phpVersion" -ForegroundColor Green

# Get Thread Safety info
$phpTS = php -r "echo PHP_ZTS ? 'TS' : 'NTS';"
Write-Host "Thread Safety: $phpTS" -ForegroundColor Green

# Get architecture
$phpArch = php -r "echo PHP_INT_SIZE == 8 ? 'x64' : 'x86';"
Write-Host "Architecture: $phpArch" -ForegroundColor Green

# Get PHP extensions directory
$extDir = php -r "echo ini_get('extension_dir');"
Write-Host "Extension directory: $extDir" -ForegroundColor Green
Write-Host ""

# Construct download URL
$mongoVersion = "1.20.0"
$dllName = "php_mongodb-$mongoVersion-$phpMajorMinor-$phpTS-vc15-$phpArch.dll"
$downloadUrl = "https://windows.php.net/downloads/pecl/releases/mongodb/$mongoVersion/$dllName"

Write-Host "Downloading MongoDB extension..." -ForegroundColor Yellow
Write-Host "URL: $downloadUrl" -ForegroundColor Gray

try {
    $dllPath = Join-Path $extDir "php_mongodb.dll"
    
    # Download the DLL
    Invoke-WebRequest -Uri $downloadUrl -OutFile $dllPath -UseBasicParsing
    Write-Host "Downloaded successfully to: $dllPath" -ForegroundColor Green
    
} catch {
    Write-Host "ERROR: Failed to download from official source" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "MANUAL INSTALLATION REQUIRED:" -ForegroundColor Yellow
    Write-Host "1. Visit: https://pecl.php.net/package/mongodb" -ForegroundColor White
    Write-Host "2. Download the DLL for your PHP version ($phpMajorMinor, $phpTS, $phpArch)" -ForegroundColor White
    Write-Host "3. Extract and copy php_mongodb.dll to: $extDir" -ForegroundColor White
    Write-Host "4. Run this script again or manually edit php.ini" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "Updating php.ini..." -ForegroundColor Yellow

# Find php.ini
$phpIni = php -r "echo php_ini_loaded_file();"
Write-Host "PHP ini file: $phpIni" -ForegroundColor Green

# Check if extension is already enabled
$iniContent = Get-Content $phpIni -Raw
if ($iniContent -match 'extension\s*=\s*mongodb') {
    Write-Host "MongoDB extension already configured in php.ini" -ForegroundColor Yellow
} else {
    # Add extension to php.ini
    Add-Content -Path $phpIni -Value "`nextension=mongodb"
    Write-Host "Added 'extension=mongodb' to php.ini" -ForegroundColor Green
}

Write-Host ""
Write-Host "Verifying installation..." -ForegroundColor Yellow

# Verify the extension is loaded
$result = php -r "echo extension_loaded('mongodb') ? 'YES' : 'NO';"
if ($result -eq "YES") {
    Write-Host "SUCCESS! MongoDB extension is installed and loaded" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now use MongoDB features in your PHP application!" -ForegroundColor Cyan
} else {
    Write-Host "WARNING: Extension installed but not loaded" -ForegroundColor Yellow
    Write-Host "Try restarting your web server or terminal" -ForegroundColor Yellow
}
