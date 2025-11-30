# Movie Recommender - Setup Guide

## Quick Setup Checklist

Follow these steps to get your movie recommendation website running:

### ✅ Step 1: Install Composer (if not installed)

Composer is needed to install the MongoDB PHP library.

**Download and install:**
- Visit: https://getcomposer.org/download/
- Download Composer-Setup.exe (for Windows)
- Run the installer and follow the wizard
- Restart your terminal/PowerShell after installation

**Verify installation:**
```powershell
composer --version
```

### ✅ Step 2: Install PHP MongoDB Extension (if not installed)

The MongoDB extension must be installed via PECL or manually.

**Option A: Via PECL (recommended)**
```powershell
pecl install mongodb
```

**Option B: Manual installation**
1. Download the DLL from: https://pecl.php.net/package/mongodb
2. Choose the version matching your PHP version and architecture
3. Extract `php_mongodb.dll` to your PHP extensions directory (e.g., `C:\php\ext\`)
4. Edit `php.ini` and add: `extension=mongodb`
5. Restart your web server

**Verify installation:**
```powershell
php -m | Select-String mongodb
```

### ✅ Step 3: Install Project Dependencies

Navigate to the project directory and install MongoDB library:

```powershell
cd e:\Project\Web\movie_recommendation
composer install
```

This will create a `vendor/` folder with the MongoDB PHP library.

### ✅ Step 4: Configure API Keys and Database

Edit `api/config.php` and update:

1. **TMDB API Key** - Replace `YOUR_TMDB_API_KEY_HERE` with your actual key from:
   https://developers.themoviedb.org/

2. **MongoDB Password** - Replace `<db_password>` in the connection string with your actual MongoDB Atlas password:
   ```php
   define('MONGO_URI', 'mongodb+srv://fuad:YOUR_PASSWORD@fuad.hnrcxlu.mongodb.net/?appName=fuad');
   ```

### ✅ Step 5: Configure Web Server

**Option A: PHP Built-in Server (Quick Test)**

From the project root:
```powershell
php -S localhost:8000
```

Then manually update `public/app.js` line 3:
```javascript
const API_BASE = 'http://localhost:8000/api';
```

Access at: `http://localhost:8000/public/`

**Option B: Apache/XAMPP/WAMP (Recommended)**

1. Place project in `htdocs/` or web root
2. Access at: `http://localhost/movie_recommendation/public/`
3. API will be at: `http://localhost/movie_recommendation/api/`

The `.htaccess` file will handle routing automatically.

### ✅ Step 6: Test the Application

1. Open your browser to the configured URL
2. You should see trending movies load automatically
3. Try searching for a movie
4. Click "Details" on any movie to see the modal
5. Add movies to favorites
6. Check that custom recommendations update

### 🔧 Troubleshooting

**"Failed to load trending movies"**
- Check TMDB API key in `api/config.php`
- Test endpoint directly: `http://localhost/api/tmdb_proxy.php?mode=trending&type=movie&time_window=week`

**"MongoDB connection failed"**
- Verify MongoDB extension: `php -m | Select-String mongodb`
- Check password in connection string
- Whitelist your IP in MongoDB Atlas (or use `0.0.0.0/0` for testing)

**404 errors on API calls**
- Verify `api/` folder is accessible via browser
- Check `API_BASE` path in `public/app.js`
- Ensure `.htaccess` is working (if using Apache)

**Composer not found**
- Install Composer from https://getcomposer.org/
- Restart terminal after installation
- Verify with: `composer --version`

### 📁 Project Structure

```
movie_recommendation/
├── public/              ← Frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── api/                ← Backend (PHP endpoints)
│   ├── config.php      ← UPDATE THIS with API keys
│   ├── utils.php
│   ├── tmdb_proxy.php
│   ├── tmdb_search.php
│   └── favorites.php
├── vendor/             ← Composer dependencies (created after install)
├── composer.json
├── .htaccess
└── README.md
```

### 🚀 Next Steps After Setup

1. Get a TMDB API key: https://developers.themoviedb.org/
2. Update MongoDB password in `api/config.php`
3. Run `composer install`
4. Start your web server
5. Enjoy your movie recommender!

### 🎯 What You Can Do

- Browse trending movies weekly
- Search for any movie by title
- View detailed movie information
- Read user reviews
- Save favorite movies (stored in MongoDB)
- Get personalized recommendations based on favorites
- Discover similar movies
