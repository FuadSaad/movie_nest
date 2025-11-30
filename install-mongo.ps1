# Install MongoDB Extension for PHP 8.2
# This script downloads the correct DLL and configures php.ini

$phpDir = "C:\php"
$extDir = "$phpDir\ext"
$iniFile = "$phpDir\php.ini"
$url = "https://downloads.php.net/~windows/pecl/releases/mongodb/1.21.0/php_mongodb-1.21.0-8.2-ts-vs16-x64.zip"
$zipFile = "$env:TEMP\mongodb_ext.zip"

Write-Host "Downloading MongoDB extension..." -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri $url -OutFile $zipFile -UseBasicParsing
    Write-Host "Download complete!" -ForegroundColor Green
} catch {
    Write-Host "Failed to download extension: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Extracting php_mongodb.dll..." -ForegroundColor Cyan
try {
    # Extract only the DLL
    Expand-Archive -Path $zipFile -DestinationPath "$env:TEMP\mongodb_ext" -Force
    Copy-Item "$env:TEMP\mongodb_ext\php_mongodb.dll" -Destination $extDir -Force
    Write-Host "Extension installed to $extDir" -ForegroundColor Green
} catch {
    Write-Host "Failed to extract/copy extension: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Configuring php.ini..." -ForegroundColor Cyan
$content = Get-Content $iniFile
if ($content -notcontains "extension=mongodb") {
    Add-Content -Path $iniFile -Value "`nextension=mongodb"
    Write-Host "Added extension=mongodb to php.ini" -ForegroundColor Green
} else {
    Write-Host "Extension already configured in php.ini" -ForegroundColor Yellow
}

# Clean up
Remove-Item $zipFile -Force
Remove-Item "$env:TEMP\mongodb_ext" -Recurse -Force

Write-Host "Verifying installation..." -ForegroundColor Cyan
& "$phpDir\php.exe" -m | Select-String "mongodb"

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: MongoDB extension installed and loaded!" -ForegroundColor Green
} else {
    Write-Host "WARNING: Extension installed but not loaded. Check php.ini" -ForegroundColor Yellow
}
