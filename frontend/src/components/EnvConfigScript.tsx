"use client";

import Script from 'next/script';

export function EnvConfigScript() {
  return (
    <Script 
      src="/env-config.js" 
      strategy="beforeInteractive"
      onLoad={() => {
        console.log('🔧 Runtime environment configuration loaded successfully');
        
        // Dispatch event to notify components that env is ready
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('runtimeEnvLoaded'));
        }
      }}
      onError={(e) => {
        console.error('❌ Failed to load runtime environment configuration:', e);
        
        // Fallback: create empty env object to prevent errors
        if (typeof window !== 'undefined') {
          (window as any).__ENV__ = {
            NEXT_PUBLIC_API_URL: 'http://localhost:5000/api',
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: '',
            NEXT_PUBLIC_SUPABASE_URL: '',
            NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
          };
          console.warn('🔄 Using fallback environment configuration');
          window.dispatchEvent(new Event('runtimeEnvLoaded'));
        }
      }}
    />
  );
} 