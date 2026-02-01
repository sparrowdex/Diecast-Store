'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, LayoutDashboard } from 'lucide-react';

export default function AccessMobileNav({ isDark, links }) {
  const [isOpen, setIsOpen] = useState(false);
  const themeClasses = isDark ? "bg-zinc-900 border-yellow-500 text-white" : "bg-white border-orange-600 text-black";

  return (
    <div className="lg:hidden sticky top-0 z-50 -mx-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center p-4 border-b-2 shadow-xl transition-all ${themeClasses}`}
      >
        <div className="flex items-center gap-3">
            <LayoutDashboard size={14} className={isDark ? 'text-yellow-500' : 'text-orange-600'} />
            <span className="font-black italic uppercase tracking-tighter text-xs">VAULT_ACCESS</span>
        </div>
        <div className="flex items-center gap-2 font-geist-mono text-[9px] opacity-60">
            [ MENU ] <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 w-full border-b-4 shadow-2xl flex flex-col divide-y divide-current/10 ${themeClasses}`}>
          {links.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="p-6 text-[10px] font-black uppercase tracking-[0.3em] italic hover:pl-8 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}