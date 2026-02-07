'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image'; //
import React, { useState } from 'react';
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, 
  List, ListOrdered, Activity, Gauge, Image as ImageIcon,
  ChevronLeft
} from 'lucide-react';

// --- Telemetry Gauge Component ---
const Speedometer = ({ current, max = 2000 }) => {
  const percentage = Math.min((current / max) * 100, 100);
  const strokeDasharray = 251.2;
  const offset = strokeDasharray - (percentage / 100) * strokeDasharray;

  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="40" cy="40" r="36" className="stroke-white/10" strokeWidth="6" fill="transparent" />
        <circle
          cx="40" cy="40" r="36"
          stroke={percentage > 90 ? '#ef4444' : '#FF8700'}
          strokeWidth="6" fill="transparent"
          strokeDasharray={strokeDasharray}
          style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.5s ease' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[10px] text-white/40 uppercase font-geist-mono">Chars</span>
        <span className={`text-sm font-bold font-geist-mono ${percentage > 90 ? 'text-red-500' : 'text-white'}`}>
          {current}
        </span>
      </div>
    </div>
  );
};

// - type="button" added to prevent form auto-submission
const MenuButton = ({ onClick, isActive, disabled, children, title }) => (
  <button
    type="button" 
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 transition-all duration-200 rounded-md border font-geist
      ${isActive 
        ? 'bg-[#FF8700] text-black border-[#FF8700] shadow-[0_0_15px_rgba(255,135,0,0.5)]' 
        : 'bg-transparent text-white border-white/10 hover:border-[#FF8700]/50 hover:text-[#FF8700]'}
      ${disabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {children}
  </button>
);

const RichTextEditor = ({ content, onUpdate }) => {
  const [stats, setStats] = useState({ chars: 0, words: 0, readTime: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg border border-white/10 max-w-[92%] md:max-w-full h-auto my-6 md:my-12 mx-auto block shadow-2xl transition-all duration-500',
        },
      }),
    ],
    content: content || '',
    immediatelyRender: false, // - Fixes SSR hydration error
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const newStats = {
        chars: text.length,
        words: text.trim().split(/\s+/).filter(Boolean).length,
        readTime: Math.ceil(text.trim().split(/\s+/).length / 200)
      };
      setStats(newStats);
      onUpdate(editor.getHTML(), newStats);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-base md:prose-lg prose-invert max-w-none min-h-[400px] p-6 md:p-16 focus:outline-none bg-[#0a0a0a] text-white/90 font-geist selection:bg-[#FF8700]/40 leading-relaxed md:leading-loose',
      },
    }
  });

  // Function to manually add an image via URL
  const addImage = () => {
    const url = window.prompt('Enter Image URL:');
    if (url) {
      // Basic validation to prevent XSS via malicious protocols
      if (url.toLowerCase().startsWith('javascript:')) {
        alert('Invalid URL protocol detected.');
        return;
      }
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0a0a0a]">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF8700] via-white to-[#FF8700] opacity-80" />
      
      <div className="flex items-center justify-between px-6 py-3 bg-[#111] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-geist-mono uppercase tracking-[0.2em] text-white/60">Session: Live_Edit</span>
        </div>
        <Activity size={16} className="text-[#FF8700]" />
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="flex-1 border-r border-white/5">
          {/* Menu Bar */}
          <div className="flex flex-wrap gap-1 p-3 bg-[#111]/50 border-b border-white/5 items-center">
            <MenuButton onClick={() => editor?.chain().focus().toggleBold().run()} isActive={editor?.isActive('bold')} title="Bold"><Bold size={18} /></MenuButton>
            <MenuButton onClick={() => editor?.chain().focus().toggleItalic().run()} isActive={editor?.isActive('italic')} title="Italic"><Italic size={18} /></MenuButton>
            <MenuButton onClick={() => editor?.chain().focus().toggleStrike().run()} isActive={editor?.isActive('strike')} title="Strike"><Strikethrough size={18} /></MenuButton>
            
            <div className="w-px h-6 bg-white/10 mx-2" />
            
            <MenuButton onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor?.isActive('heading', { level: 1 })} title="H1"><Heading1 size={18} /></MenuButton>
            <MenuButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor?.isActive('heading', { level: 2 })} title="H2"><Heading2 size={18} /></MenuButton>
            
            <div className="w-px h-6 bg-white/10 mx-2" />
            
            <MenuButton onClick={() => editor?.chain().focus().toggleBulletList().run()} isActive={editor?.isActive('bulletList')} title="Bullet List"><List size={18} /></MenuButton>
            
            <div className="w-px h-6 bg-white/10 mx-2" />

            {/* - Add Image Button */}
            <MenuButton onClick={addImage} title="Add Image from URL">
              <ImageIcon size={18} />
            </MenuButton>
          </div>

          <EditorContent editor={editor} />
        </div>

        {/* Telemetry Sidebar */}
        <div className="w-full md:w-48 bg-[#0d0d0d] p-6 flex flex-col items-center gap-8 border-l border-white/5">
          <Speedometer current={stats.chars} max={2000} />
          
          <div className="w-full space-y-6 font-geist-mono">
            <div className="border-l-2 border-[#FF8700] pl-3">
              <p className="text-[10px] text-white/40 uppercase tracking-tighter">Word Count</p>
              <p className="text-xl font-bold text-white">{stats.words.toString().padStart(3, '0')}</p>
            </div>

            <div className="border-l-2 border-white/20 pl-3">
              <p className="text-[10px] text-white/40 uppercase tracking-tighter">Est. Lap Time</p>
              <p className="text-xl font-bold text-white">{stats.readTime}m</p>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-[#FF8700] mb-2">
                <Gauge size={14} />
                <span className="text-[10px] uppercase">Engine Status</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`h-1 rounded-full ${stats.chars > (i * 250) ? 'bg-[#FF8700]' : 'bg-white/5'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-6 py-2 bg-[#111] border-t border-white/5 font-geist-mono text-[9px] text-white/30 uppercase italic">
        <span>DRS: Enabled</span>
        <span className="animate-pulse text-white/10">--- Manifest Stream Protocol 0.8 ---</span>
        <span>Temp: Optimal</span>
      </div>
    </div>
  );
};

export default RichTextEditor;