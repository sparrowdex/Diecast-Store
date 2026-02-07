"use client";
import { SignInButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminWelcomePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Glossy Grid Pattern with Faded Sides */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
        }}
      />

      {/* Glossy Running Line Animation (The "Scanner") */}
      <motion.div 
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-red-600/20 to-transparent z-10 pointer-events-none"
      />

      <div className="relative z-20 text-center space-y-12 px-4">
        <div className="space-y-4">
          <h2 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.6em] animate-pulse">
            {isLoaded && isSignedIn && !isAdmin ? "UNAUTHORIZED_ACCESS_DETECTED" : "System_Entry_Required"}
          </h2>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tighter text-white leading-none">
            WELCOME TO THE <br />
            <span className="text-red-600">ADMIN_SYSTEM</span>
          </h1>
          {isLoaded && isSignedIn && !isAdmin && (
            <p className="text-red-500 font-mono text-[10px] uppercase mt-6 max-w-xs mx-auto border border-red-500/20 p-4 bg-red-500/5">
              Error: User_Not_In_Sudoers_File. This incident will be reported.
            </p>
          )}
        </div>

        {!isSignedIn ? (
          <SignInButton mode="modal" forceRedirectUrl="/admin">
            <button className="group relative px-12 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all duration-500 overflow-hidden border border-white/10 backdrop-blur-sm">
              <span className="relative z-10">Initialize_Session</span>
              <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </SignInButton>
        ) : (
          <div className="space-y-6">
            <div className="text-gray-400 font-mono text-[10px] uppercase tracking-widest">
              Session_Active: {user.primaryEmailAddress?.emailAddress}
            </div>
            {isAdmin && (
              <Link href="/admin" className="inline-block text-white font-black text-xs uppercase tracking-[0.3em] border-b-2 border-red-600 pb-1 hover:text-red-600 transition-all">
                Enter_System_Core
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Bottom Telemetry Strip */}
      <div className="absolute bottom-10 left-10 right-10 hidden md:flex justify-between items-center font-mono text-[8px] text-white/20 uppercase tracking-widest">
        <span>Auth_Protocol: Clerk_v5</span>
        <span className="animate-pulse">--- Waiting_For_Uplink ---</span>
        <span>Status: Restricted_Access</span>
      </div>
    </div>
  );
}
