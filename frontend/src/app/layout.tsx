import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Purrpal",
  description: "Share your stories with Purrpal",
  icons: {
    icon: [
      {
        url: "/icon/favicon.svg",
        type: "any",
      },
      {
        url: "/icon/favicon.svg",
        sizes: "any",
      },
    ],
    apple: {
      url: "/icon/favicon.svg",
      type: "image/svg+xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Load runtime environment configuration before any other scripts */}
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
      </head>
      <body className={inter.className}>
        <Providers>
          <Toaster 
            position="top-right" 
            expand={false} 
            richColors 
            closeButton
            theme="light"
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}