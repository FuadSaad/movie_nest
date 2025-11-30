# 🚀 XAMPP Setup for Movie Recommender

Great! You have XAMPP. Let's get your app running in minutes!

## Quick Setup Steps

### Step 1: Find Your XAMPP Installation

Common locations:
- `C:\xampp\`
- `D:\xampp\`
- `C:\Program Files\xampp\`

Check where XAMPP is installed on your system.

### Step 2: Option A - Use Your Current Project Location (Recommended)

Since your project is already at `e:\Project\Web\movie_recommendation\`, we can configure Apache to serve it from there.

**Create a Virtual Host:**

1. Open `C:\xampp\apache\conf\extra\httpd-vhosts.conf` (or wherever your XAMPP is)

2. Add this at the end:

```apache
<VirtualHost *:80>
    DocumentRoot "e:/Project/Web/movie_recommendation/public"
    ServerName movie-reco.local
    
    <Directory "e:/Project/Web/movie_recommendation/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    Alias /api "e:/Project/Web/movie_recommendation/api"
    <Directory "e:/Project/Web/movie_recommendation/api">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

3. Edit `C:\Windows\System32\drivers\etc\hosts` (as Administrator) and add:
```
127.0.0.1   movie-reco.local
```

4. Restart Apache from XAMPP Control Panel

5. Open: `http://movie-reco.local`

### Step 2: Option B - Copy to htdocs (Simpler)

```powershell
# Copy your entire project to XAMPP
xcopy /E /I e:\Project\Web\movie_recommendation C:\xampp\htdocs\movie_recommendation

# Or wherever your XAMPP htdocs is located
```

Then access: `http://localhost/movie_recommendation/public/`

### Step 3: Install Composer Dependencies

1. **Install Composer** (if not already):
   - Download: https://getcomposer.org/Composer-Setup.exe
   - Run installer (it will find XAMPP's PHP)

2. **Install MongoDB library**:
```powershell
cd e:\Project\Web\movie_recommendation
# Or: cd C:\xampp\htdocs\movie_recommendation (if you copied it)

composer install
```

### Step 4: Install MongoDB Extension for PHP

1. **Check your PHP version** in XAMPP:
   - Open XAMPP Control Panel
   - Click "Shell"
   - Type: `php -v`

2. **Download MongoDB extension**:
   - Go to: https://pecl.php.net/package/mongodb
   - Download the version matching your PHP version (Thread Safe, x64 or x86 depending on your XAMPP)

3. **Install the extension**:
   - Extract `php_mongodb.dll` from the ZIP
   - Copy to: `C:\xampp\php\ext\` (or your XAMPP path)
   - Edit `C:\xampp\php\php.ini`
   - Add this line: `extension=mongodb`

4. **Restart Apache** from XAMPP Control Panel

### Step 5: Start Your App

1. Open XAMPP Control Panel
2. Start **Apache** (click Start button)
3. Open your browser:
   - Virtual Host: `http://movie-reco.local`
   - OR htdocs: `http://localhost/movie_recommendation/public/`

## Troubleshooting

### "Failed to load trending movies"
- Check TMDB API key in `api/config.php` ✅ (Already set!)
- Apache must be running

### "MongoDB connection failed"
- Install MongoDB extension (see Step 4)
- Check MongoDB password in `api/config.php` ✅ (Already set!)  
- Ensure IP is whitelisted in MongoDB Atlas

### 404 errors on API calls
- Check virtual host configuration
- Verify `/api` path is accessible
- Restart Apache

## Your Configuration Status

✅ TMDB API key: Configured
✅ MongoDB password: Configured
✅ Frontend files: Ready
✅ Backend files: Ready
⏳ Composer dependencies: Need `composer install`
⏳ MongoDB extension: May need installation
⏳ Apache: Need to start

## Need Help?

Tell me:
1. Where is your XAMPP installed? (e.g., `C:\xampp`, `D:\xampp`)
2. Do you want to use Option A (virtual host) or Option B (copy to htdocs)?

I can create the exact commands for your setup!
