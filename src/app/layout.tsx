import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
