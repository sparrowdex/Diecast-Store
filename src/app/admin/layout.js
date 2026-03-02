"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { 
  CubeIcon, PhotoIcon, ClipboardDocumentListIcon, 
  ArrowLeftOnRectangleIcon, StarIcon, PencilSquareIcon, 
  Bars3Icon 
} from "@heroicons/react/24/outline";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isWelcomePage = pathname === "/admin/welcome";

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: CubeIcon },
    { name: "Inventory", href: "/admin/inventory", icon: PhotoIcon },
    { name: "Featured", href: "/admin/featured", icon: StarIcon },
    { name: "Journal", href: "/admin/journal", icon: PencilSquareIcon },
    { name: "Orders", href: "/admin/orders", icon: ClipboardDocumentListIcon },
  ];

  if (isWelcomePage) {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-screen border-r border-white/10 flex flex-col bg-[#111] z-50 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Header Section with Integrated Toggle */}
        <div className="h-24 flex items-center px-6 gap-4">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="text-gray-400 hover:text-white transition-colors shrink-0"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          {!isCollapsed && (
            <div className="transition-opacity duration-300 overflow-hidden">
              <h1 className="text-xl font-black italic tracking-tighter whitespace-nowrap">GALLERY_OS</h1>
              <p className="text-[9px] font-mono text-gray-500 uppercase mt-1">Curator_Access_Lvl_1</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-md transition-all group
                  ${isActive ? "bg-white text-black" : "text-gray-400 hover:bg-white/5 hover:text-white"}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-black" : "text-gray-400 group-hover:text-white"}`} />
                {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-3 border-t border-white/10">
          <button 
            onClick={() => signOut({ redirectUrl: '/' })}
            className={`flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 w-full rounded-md transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 shrink-0" />
            {!isCollapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isCollapsed ? "pl-20" : "pl-64"
        }`}
      >
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  );
}