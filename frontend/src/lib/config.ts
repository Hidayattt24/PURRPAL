// src/lib/config.ts

/**
 * Configuration utility for managing environment variables
 * Provides fallbacks and debugging for API URLs and other config
 */

interface AppConfig {
  apiUrl: string;
  googleMapsApiKey?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

/**
 * Get the API URL with proper fallbacks
 */
export const getApiUrl = (): string => {
  // Primary: Build-time environment variable
  let apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // Fallback for development
  if (!apiUrl) {
    apiUrl = 'http://localhost:5000/api';
    console.warn('⚠️ NEXT_PUBLIC_API_URL not set, using localhost fallback');
  }
  
  // Remove trailing slash if present
  apiUrl = apiUrl.replace(/\/$/, '');
  
  // Validate URL format
  try {
    new URL(apiUrl);
  } catch (error) {
    console.error('❌ Invalid API URL format:', apiUrl);
    throw new Error(`Invalid API URL configuration: ${apiUrl}`);
  }
  
  return apiUrl;
};

/**
 * Validate that required environment variables are set
 */
const validateConfig = (): void => {
  const requiredVars = [
    'NEXT_PUBLIC_API_URL'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    
    // In production, this should be more strict
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 Production deployment with missing environment variables!');
    }
  }
};

/**
 * Debug configuration - logs current config state
 */
export const debugConfig = (): void => {
  console.log('=== CONFIGURATION DEBUG ===');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('API URL:', getApiUrl());
  console.log('Google Maps API Key:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? '✅ SET' : '❌ NOT SET');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ SET' : '❌ NOT SET');
  console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET');
  
  // Check if we're in browser and log current domain
  if (typeof window !== 'undefined') {
    console.log('Current domain:', window.location.origin);
    console.log('Full URL:', window.location.href);
  }
  console.log('==========================');
};

/**
 * Test API connectivity
 */
export const testApiConnectivity = async (): Promise<boolean> => {
  try {
    const apiUrl = getApiUrl();
    const baseUrl = apiUrl.replace('/api', '');
    
    // Try to reach the base URL or health endpoint
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Short timeout for connectivity test
      signal: AbortSignal.timeout(5000),
    });
    
    console.log('🔌 API connectivity test:', response.status === 200 ? '✅ SUCCESS' : '⚠️ ISSUES');
    return response.status === 200;
  } catch (error) {
    console.log('🔌 API connectivity test: ❌ FAILED');
    console.error('Connectivity test error:', error);
    return false;
  }
};

/**
 * Main configuration object
 */
export const config: AppConfig = {
  apiUrl: getApiUrl(),
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Validate configuration on import
validateConfig();

// Auto-debug in development
if (config.isDevelopment) {
  debugConfig();
}

/**
 * API client with automatic base URL
 */
export const apiClient = {
  /**
   * Make an authenticated API request
   */
  fetch: async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const url = `${config.apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Get token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }
    
    const finalOptions: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };
    
    console.log('🌐 API Request:', {
      method: finalOptions.method || 'GET',
      url,
      hasAuth: !!token,
    });
    
    return fetch(url, finalOptions);
  },
  
  /**
   * POST request helper
   */
  post: async (endpoint: string, data: any, options: RequestInit = {}): Promise<Response> => {
    return apiClient.fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  },
  
  /**
   * GET request helper
   */
  get: async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    return apiClient.fetch(endpoint, {
      method: 'GET',
      ...options,
    });
  },
  
  /**
   * PUT request helper
   */
  put: async (endpoint: string, data: any, options: RequestInit = {}): Promise<Response> => {
    return apiClient.fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  },
  
  /**
   * DELETE request helper
   */
  delete: async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    return apiClient.fetch(endpoint, {
      method: 'DELETE',
      ...options,
    });
  },
};

export default config;