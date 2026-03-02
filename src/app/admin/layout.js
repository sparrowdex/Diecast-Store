"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { 
  CubeIcon, PhotoIcon, ClipboardDocumentListIcon, 
  ArrowLeftOnRectangleIcon, StarIcon, PencilSquareIcon, 
  Bars3Icon 
} from "@heroicons/react/24/outline";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  
  // We'll default to true (collapsed) so mobile starts clean. 
  const [isCollapsed, setIsCollapsed] = useState(true);
  const isWelcomePage = pathname === "/admin/welcome";

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: CubeIcon },
    { name: "Inventory", href: "/admin/inventory", icon: PhotoIcon },
    { name: "Featured", href: "/admin/featured", icon: StarIcon },
    { name: "Journal", href: "/admin/journal", icon: PencilSquareIcon },
    { name: "Orders", href: "/admin/orders", icon: ClipboardDocumentListIcon },
  ];

  // Auto-close sidebar on mobile when navigating
  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  if (isWelcomePage) {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      
      {/* MOBILE TOP BAR (Hidden on Desktop) */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-[#111] border-b border-white/10 flex items-center px-4 z-40">
        <button 
          onClick={() => setIsCollapsed(false)} 
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-black italic tracking-tighter ml-4">GALLERY_OS</h1>
      </div>

      {/* MOBILE OVERLAY (Darkens background when sidebar is open) */}
      {!isCollapsed && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 z-40 transition-opacity" 
          onClick={() => setIsCollapsed(true)} 
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`fixed left-0 top-0 h-screen border-r border-white/10 flex flex-col bg-[#111] z-50 transition-all duration-300 ease-in-out 
          ${isCollapsed 
            ? "max-md:-translate-x-full md:w-20" // Mobile: Hidden completely | Desktop: Icons only
            : "max-md:translate-x-0 w-64"         // Mobile & Desktop: Fully expanded
          }
        `}
      >
        {/* Header Section with Integrated Toggle */}
        <div className="h-16 md:h-24 flex items-center px-6 gap-4">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="text-gray-400 hover:text-white transition-colors shrink-0"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          {/* We hide the title text if collapsed (desktop) OR if we're on mobile (since the top bar has it) */}
          <div className={`transition-opacity duration-300 overflow-hidden ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            <h1 className="text-xl font-black italic tracking-tighter whitespace-nowrap">GALLERY_OS</h1>
            <p className="text-[9px] font-mono text-gray-500 uppercase mt-1">Curator_Access_Lvl_1</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 mt-4 md:mt-0">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-md transition-all group
                  ${isActive ? "bg-white text-black" : "text-gray-400 hover:bg-white/5 hover:text-white"}
                  ${isCollapsed ? 'md:justify-center' : ''}
                `}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-black" : "text-gray-400 group-hover:text-white"}`} />
                <span className={`whitespace-nowrap ${isCollapsed ? 'md:hidden' : ''}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-3 border-t border-white/10">
          <button 
            onClick={() => signOut({ redirectUrl: '/' })}
            className={`flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 w-full rounded-md transition-colors ${
              isCollapsed ? 'md:justify-center' : ''
            }`}
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap ${isCollapsed ? 'md:hidden' : ''}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out pt-16 md:pt-0
          ${isCollapsed ? "md:pl-20" : "md:pl-64"}
        `}
      >
        <div className="p-4 md:p-8">
            {children}
        </div>
      </main>
    </div>
  );
}