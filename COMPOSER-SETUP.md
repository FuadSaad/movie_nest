# Composer Setup Guide for XAMPP

You're on the right track! Here's how to complete the Composer installation:

## Current Step: Choose PHP Location

![Composer Setup](C:/Users/fuadi/.gemini/antigravity/brain/0c4f8d17-19ad-4a4c-8af2-6f84715ab3c3/uploaded_image_1764348679143.png)

The installer is asking for your PHP location. Since you have XAMPP, you need to point it to XAMPP's PHP.

## Step-by-Step Instructions

### 1. Find Your XAMPP PHP Path

Click the **"Browse..."** button and navigate to one of these locations:

**Common XAMPP locations:**
- `C:\xampp\php\php.exe`
- `D:\xampp\php\php.exe`
- `C:\Program Files\xampp\php\php.exe`

### 2. Select php.exe

1. Click **"Browse..."**
2. Navigate to your XAMPP folder (e.g., `C:\xampp`)
3. Open the `php` folder
4. Select `php.exe`
5. Click **"Open"**

### 3. Continue Installation

1. Click **"Next"**
2. Follow the remaining prompts (just click Next on most screens)
3. Click **"Install"**
4. Wait for installation to complete
5. Click **"Finish"**

### 4. Verify Composer Installation

After installation completes, open a **new** PowerShell window and type:

```powershell
composer --version
```

You should see something like: `Composer version 2.x.x`

## Quick Command to Find XAMPP

If you can't find XAMPP, run this in PowerShell:

```powershell
# Search for php.exe
Get-ChildItem -Path C:\,D:\,E:\ -Filter "php.exe" -Recurse -ErrorAction SilentlyContinue -Depth 3 | Where-Object { $_.FullName -like "*xampp*" } | Select-Object -First 1 FullName
```

This will show you the exact path to XAMPP's PHP.

## After Composer is Installed

Once Composer installation is complete:

```powershell
# 1. Navigate to your project
cd e:\Project\Web\movie_recommendation

# 2. Install dependencies
composer install

# 3. You should see it download the MongoDB library
```

## What Happens Next

After `composer install`:
- A `vendor/` folder will be created
- MongoDB PHP library will be installed
- Your backend will be ready to connect to MongoDB

## Then Start Your App

1. Open XAMPP Control Panel
2. Start **Apache**
3. Copy your project to `C:\xampp\htdocs\` (or wherever your XAMPP is)
4. Open: `http://localhost/movie_recommendation/public/`

## Need Help Finding XAMPP?

Tell me if you can't find XAMPP, and I'll help you locate it!
