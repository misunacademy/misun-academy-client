"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  X,
  SendHorizontal,
  BookOpen,
  HelpCircle,
  CreditCard,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

interface ChatApiResponse {
  reply: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

const QUICK_ACTIONS = [
  {
    label: "কোর্স সমূহ",
    icon: BookOpen,
    prompt: "আপনাদের কি কি কোর্স আছে?",
  },
  {
    label: "পেমেন্ট",
    icon: CreditCard,
    prompt: "পেমেন্ট কিভাবে করব? SSLCommerz সম্পর্কে বলুন।",
  },
  {
    label: "সাহায্য",
    icon: HelpCircle,
    prompt: "আমার সাহায্য প্রয়োজন",
  },
];

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "bot",
      text: "স্বাগতম! আমি Aura, Misun Academy-এর আপনার AI সহায়ক। কিভাবে আপনাকে সাহায্য করতে পারি?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowNotification(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const timeNow = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const userMsg: Message = {
        id: `msg-${Date.now()}`,
        sender: "user",
        text: text.trim(),
        time: timeNow,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);

      try {
        const conversation = [
          ...messages.slice(1).map((m) => ({
            role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
            content: m.text,
          })),
          { role: "user" as const, content: text.trim() },
        ];

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/chat`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ messages: conversation }),
          }
        );

        if (!res.ok) throw new Error("API request failed");

        const json = await res.json();
        const data: ChatApiResponse = json.data;

        const botMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          sender: "bot",
          text:
            data.reply ||
            "দুঃখিত, এই মুহূর্তে উত্তর দিতে পারছি না। পরে আবার চেষ্টা করুন।",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch {
        const fallbackMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          sender: "bot",
          text: "দুঃখিত, একটি প্রযুক্তিগত সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [messages]
  );

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt);
    setTimeout(() => sendMessage(prompt), 100);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowNotification(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 w-[370px] sm:w-[400px]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full h-[580px] sm:h-[620px] flex flex-col rounded-2xl bg-[#0b1326]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_hsl(var(--primary)/0.12)] overflow-hidden"
          >
            {/* Header */}
            <header className="flex justify-between items-center px-4 py-3 w-full bg-[#171f33]/70 backdrop-blur-xl border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border border-primary/20 relative overflow-hidden">
                    <Image
                      src="/images/chat-bubble-icon-white.png"
                      alt="Aura Assistant Avatar"
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary border-2 border-[#0b1326] rounded-full shadow-[0_0_8px_hsl(var(--primary)/0.8)]"></div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    Aura Assistant
                  </h3>
                  <p className="text-[11px] text-primary font-medium">
                    অনলাইন
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggle}
                className="text-[#bccbb9] hover:text-primary hover:bg-white/5 p-1.5 rounded-full transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Message Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-[#0b1326]/50">
              {messages.length === 1 && (
                <div className="flex flex-col items-center py-3 px-2">
                  <p className="text-[12px] text-[#bccbb9]/50 text-center leading-relaxed">
                    নিচের যেকোনো অপশনে ক্লিক করে দ্রুত উত্তর পান
                  </p>
                </div>
              )}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 justify-center pb-2">
                  {QUICK_ACTIONS.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        onClick={() => handleQuickAction(action.prompt)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171f33]/70 border border-white/10 text-[12px] text-[#bccbb9] hover:text-primary hover:border-primary/30 transition-all duration-200"
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[88%] ${
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full border border-primary/20 relative overflow-hidden flex-shrink-0 mt-0.5">
                      <Image
                       src="/images/chat-bubble-icon-white.png"
                        alt="Aura"
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div
                    className={`flex flex-col space-y-1 ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`p-3.5 rounded-2xl text-[14px] leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground font-medium rounded-tr-none shadow-[0_0_10px_hsl(var(--primary)/0.25)]"
                          : "bg-[#171f33]/90 text-[#dae2fd] border border-white/5 rounded-tl-none"
                      }`}
                    >
                      {msg.sender === "bot" ? (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-[14px] leading-relaxed">{children}</li>,
                            h3: ({ children }) => <h3 className="text-sm font-semibold text-white mt-3 mb-1">{children}</h3>,
                            hr: () => <div className="my-3 border-t border-white/10" />,
                            code: ({ children }) => <code className="bg-white/5 px-1.5 py-0.5 rounded text-sm">{children}</code>,
                          }}
                        >
                          {msg.text.replace(/\n/g, "  \n")}
                        </ReactMarkdown>
                      ) : (
                        msg.text
                      )}
                    </div>
                    <span className="text-[9px] text-[#bccbb9]/40 px-1">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full border border-primary/20 relative overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/chat-avatar.png"
                      alt="Aura"
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-[#171f33]/90 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 opacity-80">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Field */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-[#171f33]/30 border-t border-white/5 flex gap-2 items-center"
            >
              <div className="flex-grow bg-[#171f33]/70 backdrop-blur-xl border border-white/5 rounded-xl flex items-center gap-2 px-3 py-1 focus-within:ring-1 focus-within:ring-primary/40 focus-within:shadow-[0_0_12px_hsl(var(--primary)/0.1)] transition-all duration-300">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="বাংলায় আপনার প্রশ্ন লিখুন..."
                  className="bg-transparent border-none focus:ring-0 flex-grow text-[#dae2fd] text-[14px] py-2.5 outline-none placeholder-[#bccbb9]/40"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Icon Toggle Button */}
      <button
        onClick={handleToggle}
        className="fab-btn relative group outline-none cursor-pointer"
        aria-label="Aura Assistant চালু করুন"
      >
        {/* Outer glow ring — expands outward on pulse */}
        <div className="absolute -inset-1 rounded-full fab-pulse-glow pointer-events-none"></div>

        {/* Notification badge */}
        {showNotification && !isOpen && (
          <span className="absolute -top-1 -right-1 z-20 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-primary text-[9px] font-bold text-white items-center justify-center">
              1
            </span>
          </span>
        )}

        {/* Dark navy circle with green border ring */}
        <div className="w-16 h-16 rounded-full bg-[#111b2e] border-2 border-primary shadow-[0_0_8px_hsl(var(--primary)/0.2)] flex items-center justify-center overflow-hidden relative z-10 group-hover:scale-105 transition-transform duration-300">
          <Image
            src="/images/chat-bubble-icon-white.png"
            alt="Aura Assistant চালু করুন"
            fill
            sizes="64px"
            priority
            className="object-cover p-1 rounded-full"
          />
        </div>
      </button>

      {/* Styles */}
      <style jsx global>{`
        .fab-btn {
          animation: fabFloat 3s ease-in-out infinite;
        }
        @keyframes fabFloat {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .fab-btn:hover {
          animation-play-state: paused;
        }
        .fab-pulse-glow {
          animation: fabPulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          border-radius: 9999px;
        }
        @keyframes fabPulseGlow {
          0%,
          100% {
            box-shadow: 0 0 0 0 hsl(var(--primary) / 0.35);
          }
          50% {
            box-shadow: 0 0 0 10px hsl(var(--primary) / 0);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.3);
        }
      `}</style>
    </div>
  );
}
