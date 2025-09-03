// API Configuration
// This file centralizes API configuration and makes it easy to switch between environments

export const API_CONFIG = {
  // Development (localhost)
  development: {
    baseUrl: 'http://localhost:8000/api',
    healthUrl: 'http://localhost:8000',
  },
  
  // Production (replace with your actual Vercel URL)
  production: {
    baseUrl: 'https://agriculture-crop-doctor-git-main-vinayaks-projects-adeb1c9e.vercel.app/api', // Your backend Vercel URL
    healthUrl: 'https://agriculture-crop-doctor-git-main-vinayaks-projects-adeb1c9e.vercel.app',   // Your backend Vercel URL
  },
  
  // Get current environment
  getCurrentEnv: () => {
    // Check if we're in development (localhost) or production
    if (typeof window !== 'undefined') {
      return window.location.hostname === 'localhost' ? 'development' : 'production';
    }
    return 'development';
  },
  
  // Get API URLs based on current environment
  getUrls: () => {
    const env = API_CONFIG.getCurrentEnv();
    return API_CONFIG[env];
  }
};

// Export the current API URLs
export const { baseUrl: API_BASE_URL, healthUrl: API_HEALTH_URL } = API_CONFIG.getUrls();
