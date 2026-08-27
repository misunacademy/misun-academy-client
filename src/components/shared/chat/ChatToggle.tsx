"use client";

import React from "react";
import Image from "next/image";

interface ChatToggleProps {
  onToggle: () => void;
  showNotification: boolean;
  isOpen: boolean;
}

export default function ChatToggle({
  onToggle,
  showNotification,
  isOpen,
}: ChatToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fab-btn relative group outline-none cursor-pointer"
      aria-label="Sun Assistant চালু করুন"
    >
      <div className="absolute -inset-1 rounded-full fab-pulse-glow pointer-events-none" />

      {showNotification && !isOpen && (
        <span className="absolute -top-1 -right-1 z-20 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-5 w-5 bg-primary text-[9px] font-bold text-white items-center justify-center">
            1
          </span>
        </span>
      )}

      <div className="w-16 h-16 rounded-full bg-[#111b2e] border-2 border-primary shadow-[0_0_8px_hsl(var(--primary)/0.2)] flex items-center justify-center overflow-hidden relative z-10 group-hover:scale-105 transition-transform duration-300">
        <Image
          src="/images/chat-bubble-icon-white.png"
          alt="Sun Assistant চালু করুন"
          fill
          sizes="64px"
          priority
          className="object-cover p-1 rounded-full"
        />
      </div>
    </button>
  );
}
