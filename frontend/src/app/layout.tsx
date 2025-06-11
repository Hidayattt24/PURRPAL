import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

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
