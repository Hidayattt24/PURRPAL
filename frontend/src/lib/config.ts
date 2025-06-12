// frontend/src/lib/config.ts

/**
 * Configuration utility for managing environment variables
 * Supports both build-time and runtime environment variables
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
 * Get environment variable with runtime fallback
 */
const getEnvVar = (name: string): string | undefined => {
  // Try build-time environment variable first
  const buildTimeValue = process.env[name];
  if (buildTimeValue) {
    console.log(`🏗️ Using build-time ${name}`);
    return buildTimeValue;
  }
  
  // Try runtime environment variable (injected by start.sh)
  if (typeof window !== 'undefined') {
    const runtimeEnv = (window as any).__ENV__;
    if (runtimeEnv && runtimeEnv[name]) {
      console.log(`🔄 Using runtime ${name}`);
      return runtimeEnv[name];
    }
  }
  
  return undefined;
};

/**
 * Get the API URL with proper fallbacks
 */
export const getApiUrl = (): string => {
  let apiUrl = getEnvVar('NEXT_PUBLIC_API_URL');
  
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
  const requiredVars = ['NEXT_PUBLIC_API_URL'];
  const missing: string[] = [];
  
  requiredVars.forEach(varName => {
    if (!getEnvVar(varName)) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    
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
  console.log('Google Maps API Key:', getEnvVar('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY') ? '✅ SET' : '❌ NOT SET');
  console.log('Supabase URL:', getEnvVar('NEXT_PUBLIC_SUPABASE_URL') ? '✅ SET' : '❌ NOT SET');
  console.log('Supabase Anon Key:', getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') ? '✅ SET' : '❌ NOT SET');
  
  // Check runtime environment availability
  if (typeof window !== 'undefined') {
    const hasRuntimeEnv = !!(window as any).__ENV__;
    console.log('Runtime environment available:', hasRuntimeEnv ? '✅ YES' : '❌ NO');
    console.log('Current domain:', window.location.origin);
    console.log('Full URL:', window.location.href);
    
    if (hasRuntimeEnv) {
      const runtimeEnv = (window as any).__ENV__;
      console.log('Runtime environment keys:', Object.keys(runtimeEnv));
    }
  } else {
    console.log('Running in server-side context');
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
    
    console.log('🔌 Testing API connectivity to:', baseUrl);
    
    // Try to reach the base URL or health endpoint
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Short timeout for connectivity test
      signal: AbortSignal.timeout(5000),
    });
    
    const isSuccess = response.status === 200;
    console.log('🔌 API connectivity test:', isSuccess ? '✅ SUCCESS' : '⚠️ ISSUES', `(${response.status})`);
    return isSuccess;
  } catch (error) {
    console.log('🔌 API connectivity test: ❌ FAILED');
    console.error('Connectivity test error:', error);
    return false;
  }
};

/**
 * Wait for runtime environment to be available
 */
export const waitForRuntimeEnv = (maxWaitMs: number = 5000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    const startTime = Date.now();
    
    const checkEnv = () => {
      if ((window as any).__ENV__) {
        console.log('🎯 Runtime environment loaded successfully');
        resolve(true);
        return;
      }
      
      const elapsed = Date.now() - startTime;
      if (elapsed >= maxWaitMs) {
        console.warn('⏱️ Timeout waiting for runtime environment');
        resolve(false);
        return;
      }
      
      setTimeout(checkEnv, 100);
    };
    
    checkEnv();
  });
};

/**
 * Main configuration object with getters for dynamic values
 */
export const config: AppConfig = {
  get apiUrl() { return getApiUrl(); },
  get googleMapsApiKey() { return getEnvVar('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'); },
  get supabaseUrl() { return getEnvVar('NEXT_PUBLIC_SUPABASE_URL'); },
  get supabaseAnonKey() { return getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'); },
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Validate configuration on import (server-side only)
if (typeof window === 'undefined') {
  validateConfig();
}

// Auto-debug in development (client-side only)
if (typeof window !== 'undefined' && config.isDevelopment) {
  // Wait a bit for runtime env to load, then debug
  setTimeout(() => {
    debugConfig();
  }, 1000);
}

/**
 * API client with automatic base URL and auth handling
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