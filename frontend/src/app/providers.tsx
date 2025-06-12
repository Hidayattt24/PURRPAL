"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={true}
      >
        <Toaster 
          position="top-right" 
          expand={false} 
          richColors 
          closeButton
          theme="light"
        />
        {children}
      </ThemeProvider>
    </>
  );
} 