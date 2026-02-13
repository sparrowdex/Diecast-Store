import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
// 1. NEW IMPORT: Import Clerk
import { ClerkProvider } from '@clerk/nextjs';
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Diecast Store", 
  description: "Curated Diecast Exhibition",
};

export default function RootLayout({ children }) {
  return (
    // 2. Wrap the entire HTML structure with ClerkProvider
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        >
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract the route config
             * from your `ourFileRouter` and paste it into the html.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <CartProvider>
            {children}
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}