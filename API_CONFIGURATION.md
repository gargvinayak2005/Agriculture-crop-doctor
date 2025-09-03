# API Configuration Guide

This guide explains how to configure your frontend to work with your deployed backend on Vercel.

## Quick Fix

If you've deployed your backend to Vercel, you need to update the API URLs in your frontend.

### Option 1: Update the Configuration File (Recommended)

1. Open `src/config/api.ts`
2. Replace `your-app-name` with your actual Vercel app name:

```typescript
production: {
  baseUrl: 'https://your-actual-app-name.vercel.app/api',
  healthUrl: 'https://your-actual-app-name.vercel.app',
},
```

### Option 2: Use Environment Variables

1. Create a `.env.local` file in your project root
2. Add your Vercel URL:

```env
VITE_API_BASE_URL=https://your-actual-app-name.vercel.app/api
VITE_API_HEALTH_URL=https://your-actual-app-name.vercel.app
```

## How It Works

The application automatically detects whether it's running in development or production:

- **Development**: Uses `http://localhost:8000` (when running locally)
- **Production**: Uses your Vercel URL (when deployed)

## Testing Your Configuration

1. **Test locally**: Run `npm run dev` and check if authentication works
2. **Test production**: Deploy your frontend and verify it connects to your Vercel backend

## Finding Your Vercel URL

1. Go to your Vercel dashboard
2. Find your backend project
3. Copy the deployment URL (it looks like `https://your-app-name.vercel.app`)

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend has CORS configured for your frontend domain
2. **404 Errors**: Verify your API routes are correctly deployed on Vercel
3. **Network Errors**: Check that your Vercel URL is correct and the backend is running

### Quick Test

Open your browser and go to:
```
https://your-app-name.vercel.app/api/auth/register
```

You should see a response (even if it's an error about missing data, that means the endpoint is working).

## Environment Variables (Advanced)

If you want to use environment variables instead of the config file:

1. Create `.env.local` for development
2. Set environment variables in your deployment platform for production
3. The app will automatically use the appropriate URLs

## Support

If you're still having issues:
1. Check the browser console for error messages
2. Verify your Vercel deployment is successful
3. Test your API endpoints directly in the browser
