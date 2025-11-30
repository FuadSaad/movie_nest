# Environment Setup Guide

This project uses environment variables to store sensitive configuration data like API keys and database connection strings.

## Quick Setup

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and add your credentials:**
   ```env
   TMDB_API_KEY=your_actual_tmdb_api_key
   MONGO_URI=your_actual_mongodb_connection_string
   MONGO_DB=movie_reco_db
   MONGO_FAVORITES_COLLECTION=favorites
   ```

## Getting Your Credentials

### TMDB API Key
1. Go to [TMDB website](https://www.themoviedb.org/)
2. Create a free account
3. Navigate to Settings → API
4. Request an API key
5. Copy your API key and paste it in `.env`

### MongoDB Connection String
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string (looks like `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your actual password
7. Paste the complete string in `.env`

## Important Security Notes

⚠️ **NEVER commit the `.env` file to GitHub!**

- The `.env` file contains sensitive credentials
- It's already added to `.gitignore` to prevent accidental commits
- Only commit `.env.example` (which has placeholder values)
- Share `.env.example` with other developers, not `.env`

## Verifying Setup

After setting up your `.env` file:

1. Start the PHP server:
   ```bash
   php -S localhost:8000 -t public
   ```

2. Open http://localhost:8000/public/ in your browser

3. Check that:
   - Trending movies load (verifies TMDB API key works)
   - You can favorite movies (verifies MongoDB connection works)

## Troubleshooting

**"Fatal error: .env file not found"**
- Make sure you copied `.env.example` to `.env`
- Check that `.env` is in the project root directory

**"TMDB API returns 401 error"**
- Your TMDB API key is invalid or missing
- Check that `TMDB_API_KEY` in `.env` matches your actual key

**"MongoDB connection failed"**
- Your MongoDB connection string is invalid
- Make sure you replaced `<password>` with your actual password
- Verify your IP address is whitelisted in MongoDB Atlas

## For Deployment

When deploying to production:

1. Create a `.env` file on your server (don't upload from local)
2. Use production credentials (different from development)
3. Consider using proper environment variable management (not `.env` files) for production
4. Never expose your `.env` file via web server
