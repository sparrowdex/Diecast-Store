'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function SubPageNavbar({ 
  title = "Catalog Ref.01", 
  links = [
    { name: 'Home', href: '/' },
    { name: 'Collection', href: '/access' },
    { name: 'Journal', href: '/journal' },
  ] 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12 items-center">
          <div className="flex items-center">
            <span className="text-sm font-black italic tracking-tighter uppercase">
              {title}
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8">
              {links.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden p-2 opacity-50 hover:opacity-100 transition-opacity"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Now using absolute to overlap content */}
      <div 
        className={`absolute top-full left-0 w-full bg-white border-b border-black/5 overflow-hidden transition-all duration-300 ease-in-out md:hidden shadow-xl
          ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 py-6 space-y-1">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)} 
              className="block px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black hover:bg-zinc-50 hover:translate-x-2 transition-all duration-200 border-l-2 border-transparent hover:border-black"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}