import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
// 1. NEW IMPORT: Import Clerk
import { ClerkProvider } from '@clerk/nextjs';

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
          <CartProvider>
            {children}
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}