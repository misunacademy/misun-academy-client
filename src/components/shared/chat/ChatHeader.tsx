"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ChatHeaderProps {
  onToggle: () => void;
}

export default function ChatHeader({ onToggle }: ChatHeaderProps) {
  return (
    <header className="flex justify-between items-center px-4 py-3 w-full bg-surface-navy/70 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border border-primary/20 relative overflow-hidden">
            <Image
              src="/images/chat-bubble-icon-white.png"
              alt="Sun Assistant Avatar"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary border-2 border-[#0b1326] rounded-full shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Sun Assistant
          </h3>
          <p className="text-[11px] text-primary font-medium">অনলাইন</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className="text-sage hover:text-primary hover:bg-white/5 p-1.5 rounded-full transition-all duration-200"
      >
        <X className="w-5 h-5" />
      </button>
    </header>
  );
}
