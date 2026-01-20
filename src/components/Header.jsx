"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUser, SignOutButton, SignInButton } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded, user } = useUser();

  useEffect(() => {
    console.log("NAVBAR RENDER -> Loaded:", isLoaded, "Signed In:", isSignedIn);
    console.log("Header Auth State -> Loaded:", isLoaded, "Signed In:", isSignedIn);
  }, [isLoaded, isSignedIn]);

  const IS_LOGGED_IN = isSignedIn; 

  return (
    <header className="w-full border-b border-black/5 bg-white sticky top-0 z-[50]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-black uppercase italic tracking-tighter">
          Diecast_Store
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {/* User Section */}
          {!isLoaded ? (
            <div className="w-12 h-4 bg-black/5 animate-pulse" />
          ) : (
            <div className="flex items-center relative z-[60]">
              {IS_LOGGED_IN ? (
                <div className="group relative py-2">
                  <Link 
                    href="/access" 
                    className="text-sm font-black uppercase italic tracking-tighter border-b-2 border-black hover:text-red-600 hover:border-red-600 transition-all text-black"
                  >
                    ACCESS
                  </Link>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 w-48 pt-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50">
                    <div className="bg-white border border-black shadow-2xl p-2 flex flex-col">
                      <DropdownLink href="/access">Dashboard</DropdownLink>
                      <DropdownLink href="/access/collection">My Collection</DropdownLink>
                      <DropdownLink href="/access/orders">Order History</DropdownLink>
                      <DropdownLink href="/access/settings">Settings</DropdownLink>
                      <div className="h-px bg-black/5 my-2" />
                      <SignOutButton>
                        <button className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors">
                          Logout_Session
                        </button>
                      </SignOutButton>
                    </div>
                  </div>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="text-sm font-black uppercase italic tracking-tighter hover:text-red-600 transition-colors text-black border-2 border-black px-4 py-1 bg-white">
                    LOGIN
                  </button>
                </SignInButton>
              )}
            </div>
          )}

          <Link href="/catalog" className="text-[10px] font-bold uppercase tracking-widest hover:text-red-600 transition-colors">
            Catalog
          </Link>
          <Link href="/journal" className="text-[10px] font-bold uppercase tracking-widest hover:text-red-600 transition-colors">
            Journal
          </Link>

          {/* Cart Trigger (Placeholder) */}
          <button className="bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
            Vault_0
          </button>
        </nav>
      </div>
    </header>
  );
}

function DropdownLink({ href, children }) {
  return (
    <Link 
      href={href} 
      className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all"
    >
      {children}
    </Link>
  );
}