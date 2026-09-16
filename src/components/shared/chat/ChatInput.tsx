"use client";

import React from "react";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: (e?: React.FormEvent) => void;
}

export default function ChatInput({
  inputValue,
  onInputChange,
  onSend,
}: ChatInputProps) {
  return (
    <form
      onSubmit={onSend}
      className="p-3 bg-surface-navy/30 border-t border-white/5 flex gap-2 items-center"
    >
      <div className="flex-grow bg-surface-navy/70 backdrop-blur-xl border border-white/5 rounded-xl flex items-center gap-2 px-3 py-1 focus-within:ring-1 focus-within:ring-primary/40 focus-within:shadow-[0_0_12px_hsl(var(--primary)/0.1)] transition-all duration-300">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="বাংলায় আপনার প্রশ্ন লিখুন..."
          className="bg-transparent border-none focus:ring-0 flex-grow text-[#dae2fd] text-[14px] py-2.5 outline-none placeholder-sage/40"
        />
      </div>
      <button
        type="submit"
        disabled={!inputValue.trim()}
        className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_15px_hsl(var(--primary)/0.4)] hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <SendHorizontal className="w-5 h-5 stroke-[2.5]" />
      </button>
    </form>
  );
}
