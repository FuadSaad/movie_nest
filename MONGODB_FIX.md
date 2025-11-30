# MongoDB TLS/SSL Fix - Movie Recommendation

## Issue
MongoDB Atlas connection was failing with TLS handshake errors:
```
Failed to add favorite: No suitable servers found
TLS handshake failed: error:0A000438:SSL routines::tlsv1 alert internal error
```

## Solution Applied
Updated `api/utils.php` with proper MongoDB client options:

1. **TLS Configuration**:
   - Enabled `tls => true`
   - Added `tlsAllowInvalidCertificates => true` (dev only)
   - Added `tlsAllowInvalidHostnames => true` (dev only)

2. **Timeout Settings**:
   - `serverSelectionTimeoutMS => 5000`
   - `connectTimeoutMS => 10000`

3. **Retry Logic**:
   - `retryWrites => true`
   - `retryReads => true`

4. **Error Handling**:
   - Added specific catch blocks for ConnectionTimeoutException
   - Added error logging for debugging
   - Connection test before returning collection

## Testing
To verify the fix:
1. Open the movie recommendation app in browser
2. Try adding a movie to favorites
3. Check browser console and network tab for errors
4. Verify favorites are persisting in MongoDB Atlas

## Notes
- The `tlsAllowInvalidCertificates` and `tlsAllowInvalidHostnames` options are for development only
- For production, remove these options and ensure proper SSL certificates
- Check MongoDB Atlas network access rules if issues persist
