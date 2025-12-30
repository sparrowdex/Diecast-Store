"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CubeIcon, PhotoIcon, ClipboardDocumentListIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: CubeIcon },
    { name: "Inventory", href: "/admin/inventory", icon: PhotoIcon },
    { name: "Orders", href: "/admin/orders", icon: ClipboardDocumentListIcon },
  ];

  return (
    <div className="min-h-screen bg-[#111] text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col fixed h-full">
        <div className="p-8">
          <h1 className="text-xl font-black italic tracking-tighter">GALLERY_OS</h1>
          <p className="text-[9px] font-mono text-gray-500 uppercase mt-1">Curator_Access_Lvl_1</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-md transition-colors
                  ${isActive ? "bg-white text-black" : "text-gray-400 hover:bg-white/5 hover:text-white"}
                `}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-white/5 w-full rounded-md">
            <ArrowLeftOnRectangleIcon className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 bg-[#0a0a0a] min-h-screen">
        {children}
      </main>
    </div>
  );
}