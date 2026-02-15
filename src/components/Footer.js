"use client"
import Link from 'next/link';

// Updated Link Component
const SpeedLink = ({ href, children }) => {
  return (
    <Link href={href} className="group relative block w-fit overflow-hidden py-1">
      {/* The Text */}
      <span className="relative z-10 font-mono text-sm font-bold uppercase italic tracking-widest text-gray-300 transition-colors duration-300 group-hover:text-white">
        {children}
      </span>
      
      {/* The Shine Element */}
      <div className="shine-effect" />
    </Link>
  );
};

const Footer = () => {
    return (
        <footer className="footer-container">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/30 z-[-1]" />

            {/* LAYOUT CHANGES:
               1. Removed 'justify-between': This stops pushing content to the far edges.
               2. Added 'md:gap-x-32': This creates a fixed space between columns. 
                  (You can change '32' to '24' to bring them closer, or '40' to spread them more).
               3. Kept 'justify-start': Ensures everything builds from the left side.
            */}
            <div className="mx-auto flex h-full max-w-7xl flex-col justify-start px-8 py-16 md:flex-row md:items-start md:gap-x-32 md:py-24">
                
                {/* Brand Section */}
                <div className="mb-10 max-w-sm md:mb-0">
                    <h4 className="mb-4 font-black text-3xl uppercase italic tracking-tighter text-white">
                        Diecast_Store
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed font-mono">
                        Precision engineered models for the dedicated collector. 
                        Authentic scale, unmatched detail.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="mb-10 md:mb-0">
                    <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                        Coordinates
                    </h4>
                    <div className="flex flex-col gap-2">
                        <SpeedLink href="/terms-of-service">Terms of Service</SpeedLink>
                        <SpeedLink href="/privacy-policy">Privacy Policy</SpeedLink>
                        <SpeedLink href="/refund-policy">Refund Policy</SpeedLink>
                    </div>
                </div>

                {/* UPDATED: Contact Center Section */}
                <div className="min-w-[250px]">
                    <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                        Contact Center
                    </h4>
                    <div className="flex flex-col gap-4 font-mono text-xs tracking-tight">

                        {/* Email Row */}
                        <a href="mailto:support@diecaststore.com" className="group relative flex flex-col gap-1 text-gray-400 hover:text-white transition-all">
                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Server_Inquiry</span>
                            <div className="flex items-center gap-2">
                                <span className="tech-bracket">[</span>
                                <span className="relative overflow-hidden">
                                    support@diecaststore.com
                                    <div className="shine-effect" />
                                </span>
                                <span className="tech-bracket">]</span>
                            </div>
                        </a>

                        {/* Phone Row */}
                        <a href="tel:123-456-7890" className="group relative flex flex-col gap-1 text-gray-400 hover:text-white transition-all">
                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Direct_Line</span>
                            <div className="flex items-center gap-2">
                                <span className="tech-bracket">[</span>
                                <span className="relative overflow-hidden">
                                    123-456-7890
                                    <div className="shine-effect" />
                                </span>
                                <span className="tech-bracket">]</span>
                            </div>
                        </a>

                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;