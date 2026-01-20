"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  // Handle both possible parameter names
  const displayId = searchParams.get("payment_id") || searchParams.get("orderId");

  useEffect(() => {
    // Trigger a high-end confetti blast on load
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 selection:bg-black selection:text-white">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-12 inline-block">
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none text-black">
            Exhibit_Acquired
          </h1>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.5em] mt-4">
            Transaction_Successful // Vault_Updated
          </p>
        </div>

        <div className="border-y border-black/5 py-8 mb-12 flex flex-col md:flex-row justify-around gap-8">
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Reference_ID</p>
            <p className="text-sm font-mono font-bold text-black">{displayId || "N/A"}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Status</p>
            <p className="text-sm font-black italic uppercase text-green-600">Confirmed_In_Vault</p>
          </div>
        </div>

        <Link 
          href="/" 
          className="inline-block bg-black text-white px-12 py-5 font-black text-xs uppercase tracking-[0.3em] hover:bg-red-600 transition-all hover:-skew-x-6"
        >
          Return_to_Gallery
        </Link>
      </div>
    </div>
  );
}