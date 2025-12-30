import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Import the Cart Provider (Make sure you created the file in src/context/)
import { CartProvider } from "@/context/CartContext"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gallery_01", // I updated this to match your branding
  description: "Curated Diecast Exhibition",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 2. Wrap the entire app so the Cart is accessible everywhere */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}