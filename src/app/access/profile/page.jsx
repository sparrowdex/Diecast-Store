'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { ShieldCheck, User, Zap, Camera, Terminal } from 'lucide-react';

const TerminalLoader = ({ isDark }) => {
  const lines = [
    "CHECKING_HARDWARE_INTEGRITY",
    "MOUNTING_ENCRYPTED_VAULT",
    "SYNCING_COLLECTOR_ID",
    "INITIALIZING_INTERFACE"
  ];

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 font-geist-mono ${isDark ? 'bg-[#050505] text-white' : 'bg-zinc-100 text-black'}`}>
      <div className="w-full max-w-xs space-y-4">
        <div className="flex items-center gap-2 mb-2 opacity-40">
           <Terminal size={14} />
           <span className="text-[10px] uppercase tracking-[0.3em]">System_Boot</span>
        </div>
        {lines.map((text, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.4 }}
            className="flex items-center gap-3"
          >
            <div className={`h-1 w-1 rounded-full animate-pulse ${isDark ? 'bg-yellow-500' : 'bg-orange-600'}`} />
            <span className="text-[10px] tracking-widest uppercase opacity-60 italic">{text}...</span>
          </motion.div>
        ))}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className={`h-[2px] w-full origin-left mt-4 ${isDark ? 'bg-yellow-500' : 'bg-orange-600'}`} 
        />
      </div>
    </div>
  );
};

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/user/dashboard-data')
      .then(res => res.json())
      .then(data => {
        setProfile(data.profile);
        setLoading(false);
      })
      .catch(err => console.error("Data fetch failed", err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      if (res.ok) router.refresh();
    } catch (error) {
      console.error("Failed to save profile", error);
    } finally {
      setSaving(false);
    }
  };

  const isDark = profile?.theme === 'dark';

  if (loading) return <TerminalLoader isDark={true} />;

  const accentColor = isDark ? 'text-yellow-500' : 'text-orange-600';

  return (
    <div className={`min-h-screen p-4 md:p-12 transition-colors duration-500 font-geist overflow-x-hidden ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-zinc-100 text-black'}`}>
      
      <header className="mb-12 relative">
        <div className={`absolute -left-4 top-0 h-full w-1 ${isDark ? 'bg-yellow-500' : 'bg-orange-600'}`} />
        <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase leading-none break-words">
          Profile_Configuration
        </h2>
        <p className="font-geist-mono text-[9px] sm:text-[10px] opacity-40 mt-2 tracking-[0.2em]">
          // CUSTOMIZE_YOUR_DIGITAL_CREDENTIALS
        </p>
      </header>

      <form onSubmit={handleSave} className="max-w-3xl space-y-10">
        
        {/* IDENTITY SECTION */}
        <section className={`relative p-6 border-l-4 ${isDark ? 'bg-zinc-900/50 border-yellow-500' : 'bg-white border-orange-600 shadow-sm'}`}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className={`h-28 w-28 rounded-none border-2 p-1 transition-all group-hover:rotate-3 ${isDark ? 'border-yellow-500/50' : 'border-orange-600/50'}`}>
                <div className="h-full w-full overflow-hidden relative">
                    {user?.imageUrl && (
                        <Image src={user.imageUrl} alt="Avatar" fill className="object-cover" />
                    )}
                </div>
              </div>
              <div className={`absolute -bottom-2 -right-2 p-2 ${isDark ? 'bg-yellow-500 text-black' : 'bg-orange-600 text-white'}`}>
                <Camera size={14} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <label className="block font-geist-mono text-[10px] font-black uppercase tracking-widest opacity-40 italic">System_Identity_Image</label>
              <p className="text-xs opacity-60 max-w-sm">Your biometric visual is synced with your primary secure account.</p>
              <button 
                type="button"
                onClick={() => router.push('/access/settings')}
                className={`mt-4 px-6 py-2 text-[10px] font-black uppercase italic border-2 transition-all ${isDark ? 'border-white/10 hover:bg-yellow-500 hover:text-black' : 'border-black/10 hover:bg-orange-600 hover:text-white'}`}
              >
                Modify_Cloud_Identity
              </button>
            </div>
          </div>
        </section>

        {/* INPUT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="flex items-center gap-2 font-geist-mono text-[10px] font-black uppercase opacity-40 tracking-widest">
                <User size={12} className={accentColor} /> Collector_Alias
            </label>
            <input 
              value={profile.collectorName || ''}
              onChange={e => setProfile({...profile, collectorName: e.target.value})}
              className={`w-full bg-transparent border-b-2 p-3 font-black italic text-xl focus:outline-none ${isDark ? 'border-white/10 focus:border-yellow-500' : 'border-black/10 focus:border-orange-600'}`}
              placeholder="UNASSIGNED"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 font-geist-mono text-[10px] font-black uppercase opacity-40 tracking-widest">
                <ShieldCheck size={12} className={accentColor} /> Verified_Stamp
            </label>
            <div className="relative">
                <select 
                value={profile.stamp || 'VERIFIED'}
                onChange={e => setProfile({...profile, stamp: e.target.value})}
                className={`w-full bg-transparent border-b-2 p-3 font-black italic text-sm focus:outline-none appearance-none cursor-pointer uppercase ${isDark ? 'border-white/10 bg-zinc-900' : 'border-black/10 bg-white'}`}
                >
                <option value="VERIFIED">VERIFIED</option>
                <option value="ELITE">ELITE_ARCHIVE</option>
                <option value="PROTOTYPE">PROTOTYPE_UNIT</option>
                <option value="LEGACY">LEGACY_HOLDER</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">▼</div>
            </div>
          </div>
        </div>

        {/* MISSION STATEMENT */}
        <div className="space-y-3">
          <label className="font-geist-mono text-[10px] font-black uppercase opacity-40 tracking-widest block">Manifesto_Biography</label>
          <div className="relative group">
            <textarea 
                maxLength={160}
                rows={3}
                value={profile.bio || ''}
                onChange={e => setProfile({...profile, bio: e.target.value})}
                className={`w-full bg-transparent border-2 p-5 font-geist-mono text-xs focus:outline-none resize-none ${isDark ? 'border-white/5 focus:border-yellow-500/50 bg-white/[0.02]' : 'border-black/5 focus:border-orange-600/50 bg-black/[0.02]'}`}
                placeholder="Declare your collection mission..."
            />
            <div className={`absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 ${isDark ? 'border-white/10' : 'border-black/10'}`} />
          </div>
        </div>

        {/* THEME TOGGLE */}
        <div className="pt-6 border-t border-current/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <label className="font-geist-mono text-[10px] font-black uppercase opacity-40 tracking-widest block">Interface_Livery</label>
            <p className="text-[10px] opacity-60 uppercase font-bold">Select vault visual profile</p>
          </div>
          <div className="flex gap-1 bg-current/5 p-1">
            {['light', 'dark'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setProfile({...profile, theme: t})}
                className={`px-8 py-2 font-black text-[10px] uppercase italic transition-all ${profile.theme === t ? (isDark ? 'bg-yellow-500 text-black' : 'bg-orange-600 text-white') : 'opacity-40'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* COMMIT BUTTON: Optimized Height for Mobile */}
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          disabled={saving}
          className={`w-full py-4 sm:py-5 font-black italic uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[10px] sm:text-xs transition-all relative overflow-hidden group ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
        >
          <div className={`absolute left-0 top-0 h-full w-1 transition-all group-hover:w-full group-hover:opacity-10 ${isDark ? 'bg-yellow-500' : 'bg-orange-600'}`} />
          <span className="relative z-10">{saving ? 'SYNCING...' : 'COMMIT_CHANGES_TO_VAULT'}</span>
        </motion.button>
      </form>
    </div>
  );
}