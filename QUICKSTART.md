# Quick Start Guide - Movie Recommender

Your configuration is **COMPLETE**! ✅ TMDB API key and MongoDB are configured.

Now you just need to run the app. Here are your options:

---

## Option 1: VS Code Live Server (Easiest - 2 minutes)

If you have VS Code, this is the fastest way:

1. **Install Live Server Extension** (if not already installed):
   - In VS Code, click Extensions (Ctrl+Shift+X)
   - Search for "Live Server" by Ritwick Dey
   - Click Install

2. **Start the App**:
   - Right-click `public/index.html` in VS Code
   - Select "Open with Live Server"
   - Your browser will open automatically!

**Limitation**: Favorites won't work (no MongoDB support), but you can:
- ✅ Browse trending movies
- ✅ Search movies
- ✅ View movie details and reviews
- ❌ Save favorites (needs PHP)

---

## Option 2: Download Proper PHP (Recommended for Full Features)

You downloaded PHP **source code**. You need the **compiled binaries**.

### Step-by-Step:

1. **Download PHP 8.2+ Windows Binaries**:
   - Go to: https://windows.php.net/download/
   - Download: **PHP 8.2 VS16 x64 Thread Safe** (ZIP file)
   - It should be ~30MB (not the source code which is smaller)

2. **Extract to C:\php**:
   ```powershell
   # Extract the ZIP to C:\php
   # You should see files like: php.exe, php.ini-development, ext\ folder
   ```

3. **Add PHP to PATH**:
   - Open System Environment Variables
   - Edit PATH variable
   - Add new entry: `C:\php`
   - Click OK and restart PowerShell

4. **Configure php.ini**:
   ```powershell
   cd C:\php
   copy php.ini-development php.ini
   ```
   
   Edit `C:\php\php.ini` and uncomment these lines (remove semicolon):
   ```ini
   extension=curl
   extension=mbstring
   extension=openssl
   extension=pdo_mysql
   ```

5. **Install Composer**:
   - Download: https://getcomposer.org/Composer-Setup.exe
   - Run installer (it will find PHP automatically)
   - Restart terminal

6. **Install MongoDB Extension**:
   - Download: https://pecl.php.net/package/mongodb
   - Choose version matching PHP 8.2 x64 Thread Safe
   - Extract `php_mongodb.dll` to `C:\php\ext\`
   - Add to `php.ini`: `extension=mongodb`

7. **Install Dependencies**:
   ```powershell
   cd e:\Project\Web\movie_recommendation
   composer install
   ```

8. **Run the App**:
   ```powershell
   php -S localhost:8000
   # Open: http://localhost:8000/public/
   ```

---

## Option 3: Use XAMPP (All-in-One Solution)

Download XAMPP from: https://www.apachefriends.org/

1. Install XAMPP (includes PHP, Apache, MySQL)
2. Copy your project to: `C:\xampp\htdocs\movie_recommendation\`
3. Start Apache from XAMPP Control Panel
4. Open: `http://localhost/movie_recommendation/public/`
5. Install Composer and MongoDB extension as described above

---

## Quick Test (No Installation Needed)

Want to just see if the frontend works? Open this file in your browser:

```
file:///e:/Project/Web/movie_recommendation/public/setup-instructions.html
```

This shows a beautiful setup guide page I created for you.

---

## Which Option Do You Prefer?

**Fastest**: Option 1 (VS Code Live Server) - works in 2 minutes but no favorites
**Complete**: Option 2 (PHP Binaries) - 15 minutes, all features work
**Easiest**: Option 3 (XAMPP) - 10 minutes, all features work

Let me know which you'd like to pursue!
