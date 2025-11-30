# Installing MongoDB PHP Extension on Windows

## Quick Install (Automated)

1. **Open PowerShell as Administrator**
2. **Navigate to project directory**:
   ```powershell
   cd "e:\Project\Web\movie_recommendation"
   ```
3. **Run the installer script**:
   ```powershell
   .\install-mongodb-extension.ps1
   ```

---

## Manual Installation (If Script Fails)

### Step 1: Check Your PHP Configuration
```powershell
php -v
php -i | findstr /C:"Thread Safety" /C:"Architecture"
```

Note down:
- **PHP Version** (e.g., 8.1, 8.2, 8.3)
- **Thread Safety**: `enabled` (TS) or `disabled` (NTS)
- **Architecture**: `x64` or `x86`

### Step 2: Download MongoDB Extension

1. Visit: https://pecl.php.net/package/mongodb/1.20.0/windows
2. Download the file matching your configuration:
   - Example: `php_mongodb-1.20.0-8.2-nts-vs16-x64.zip` for PHP 8.2 NTS x64

### Step 3: Install the DLL

1. **Extract the ZIP file**
2. **Copy `php_mongodb.dll`** to your PHP extensions directory:
   ```powershell
   # Find your extension directory
   php -r "echo ini_get('extension_dir');"
   ```
3. **Paste the DLL** into that directory

### Step 4: Enable the Extension

1. **Find your php.ini**:
   ```powershell
   php --ini
   ```
2. **Open php.ini** in a text editor
3. **Add this line** (usually in the extensions section):
   ```ini
   extension=mongodb
   ```
4. **Save the file**

### Step 5: Verify Installation

```powershell
php -m | findstr mongodb
```

If you see `mongodb` in the output, it's installed!

---

## Alternative: Using Composer (MongoDB Library Only)

If you cannot install the extension, use MongoDB's pure PHP library:

```powershell
cd e:\Project\Web\movie_recommendation
composer require mongodb/mongodb
```

This won't be as fast but doesn't require the PHP extension.

---

## Troubleshooting

### "DLL not found" or "Unable to load dynamic library"
- Make sure the DLL matches your **exact** PHP version and thread safety
- Restart your terminal/web server after installing

### "Wrong architecture" error
- Download the correct x86 or x64 version

### Still stuck?
Run this to see detailed PHP info:
```powershell
php -i > phpinfo.txt
notepad phpinfo.txt
```
Look for "extension_dir" and "Thread Safety" to ensure you have the right DLL.
