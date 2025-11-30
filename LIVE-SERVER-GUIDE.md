# 🚀 Launch Your Movie App with Live Server!

Great choice installing Live Server! Here's how to use it:

## Step 1: Start Live Server

**In VS Code:**
1. Open `public/index.html` in the editor
2. Right-click anywhere in the file
3. Select "**Open with Live Server**"
4. Your browser will automatically open!

**Or use the keyboard shortcut:**
- Press `Alt+L` then `Alt+O`

## Step 2: What You'll See

✅ **Working Features (No PHP needed):**
- Beautiful dark-themed interface
- Three main sections (Trending, Recommendations, Favorites)
- Search functionality
- Responsive design

❌ **Not Working (Needs PHP Backend):**
- Trending movies loading (shows error message)
- Movie search
- Add/remove favorites
- Movie details and reviews
- Custom recommendations

## Why API Calls Don't Work

Live Server only serves **static files** (HTML, CSS, JS). Your app needs a **PHP server** to:
- Call the TMDB API from the backend
- Store favorites in MongoDB
- Handle API requests securely

## Next Step: Get Full Functionality

To see movies and use all features, you have 2 options:

### Option A: Use My Auto-Install Script (Easy)
I already created `install-php.ps1` for you!

```powershell
# Run this in PowerShell (as Administrator)
cd e:\Project\Web\movie_recommendation
powershell -ExecutionPolicy Bypass -File install-php.ps1
```

This will:
- Download PHP 8.2.29 automatically
- Extract to C:\php
- Configure php.ini
- Add PHP to your PATH

Then:
```powershell
# Install Composer from: https://getcomposer.org/Composer-Setup.exe
# After installing Composer:
composer install

# Start the server:
php -S localhost:8000

# Open: http://localhost:8000/public/
```

### Option B: Install XAMPP (All-in-One)
- Download: https://www.apachefriends.org/
- Install XAMPP
- Copy project to `C:\xampp\htdocs\`
- Start Apache from XAMPP Control Panel
- Open: `http://localhost/movie_recommendation/public/`

## Current UI Preview

Here's what your app looks like right now:

![Current Interface](C:/Users/fuadi/.gemini/antigravity/brain/0c4f8d17-19ad-4a4c-8af2-6f84715ab3c3/live_server_view_1764348327785.png)

The UI is **fully built and styled**, just waiting for the backend to make it functional!

## What's Already Configured

✅ TMDB API key: Set
✅ MongoDB password: Set  
✅ All frontend files: Ready
✅ All backend files: Ready
✅ Database schema: Ready

**You're 99% there!** Just need PHP running to see it all work.

---

## Quick Demo

Want to see it working? Run my PHP install script:

```powershell
# Option 1: Run my script (easiest)
.\install-php.ps1

# OR Option 2: Manual PHP setup
# Download from: https://windows.php.net/downloads/releases/php-8.2.29-Win32-vs16-x64.zip
# Extract to C:\php
# Add C:\php to PATH
# Run: php -S localhost:8000
```

Let me know if you want to proceed with the automated PHP installation!
