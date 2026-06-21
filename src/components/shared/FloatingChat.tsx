"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Paperclip, Smile, SendHorizontal } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "bot",
      text: "Hello! How can I help you with your technical setup today?",
      time: "10:24 AM",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat list
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Show a notification badge after 3 seconds if the chat is not open
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowNotification(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const getBotResponse = (userInput: string): string => {
    const text = userInput.toLowerCase();
    if (text.includes("api") || text.includes("key") || text.includes("token") || text.includes("403")) {
      return "A 403 error typically means your API integration key is unauthorized, lacks scope, or has expired. Please check your credentials in your dashboard API settings or generate a new key.";
    }
    if (text.includes("course") || text.includes("class") || text.includes("learn") || text.includes("graphics")) {
      return "We offer premium courses in Web Development, UI/UX Design, Graphics, and other digital skills. Let me know if you would like me to link you to our course catalog!";
    }
    if (text.includes("price") || text.includes("cost") || text.includes("payment") || text.includes("bkash") || text.includes("nagad")) {
      return "You can pay using bKash, Nagad, Rocket, or major credit/debit cards. The checkout page will list all options. Do you have a specific billing question?";
    }
    if (text.includes("support") || text.includes("help") || text.includes("admin")) {
      return "If you need human assistance, I can open a support ticket for you. Please type your email address and describe your issue so our technical support engineers can reach out!";
    }
    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      return "Hello there! Let me know if you are experiencing any technical issues or need help navigating the platform.";
    }
    return "Thank you for reaching out! A tech support representative is reviewing your query and will respond shortly. Is there anything else you'd like to add?";
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessageText = inputValue.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // User Message
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: userMessageText,
      time: timeNow,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Bot Typing and Response Simulation
    setTimeout(() => {
      const responseText = getBotResponse(userMessageText);
      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "bot",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowNotification(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 w-[350px] sm:w-[400px]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full h-[550px] sm:h-[600px] flex flex-col rounded-2xl bg-[#0b1326]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_25px_rgba(34,197,94,0.15)] overflow-hidden"
          >
            {/* Header */}
            <header className="flex justify-between items-center px-4 py-3 w-full bg-[#171f33]/70 backdrop-blur-xl border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border border-[#4be277]/20 relative overflow-hidden">
                    <Image
                      src="/images/chat-avatar.png"
                      alt="Tech Support Agent Avatar"
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4be277] border-2 border-[#0b1326] rounded-full shadow-[0_0_8px_rgba(75,226,119,0.8)]"></div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide">Tech Support</h3>
                  <p className="text-[11px] text-[#4be277] font-medium">Online</p>
                </div>
              </div>
              <button
                onClick={handleToggle}
                className="text-[#bccbb9] hover:text-[#4be277] hover:bg-white/5 p-1.5 rounded-full transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Message Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-[#0b1326]/50">
              <div className="flex flex-col items-center py-2">
                <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] uppercase tracking-widest text-[#bccbb9]/50 font-semibold">
                  Today
                </span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                  }`}
                >
                  <div className={`flex flex-col space-y-1 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-[14px] leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#4be277] text-[#002109] font-medium rounded-tr-none shadow-[0_0_10px_rgba(75,226,119,0.25)]"
                          : "bg-[#171f33]/90 text-[#dae2fd] border border-white/5 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-[#bccbb9]/40 px-1">{msg.time}</span>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="bg-[#171f33]/90 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 opacity-80">
                    <span className="w-1.5 h-1.5 bg-[#4be277] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#4be277] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#4be277] rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Field */}
            <form
              onSubmit={handleSend}
              className="p-4 bg-[#171f33]/30 border-t border-white/5 flex gap-2 items-center"
            >
              <div className="flex-grow bg-[#171f33]/70 backdrop-blur-xl border border-white/5 rounded-xl flex items-center gap-2 px-3 py-1 focus-within:ring-1 focus-within:ring-[#4be277]/40 focus-within:shadow-[0_0_12px_rgba(75,226,119,0.1)] transition-all duration-300">
                <button
                  type="button"
                  className="p-1.5 text-[#bccbb9] hover:text-[#4be277] transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="bg-transparent border-none focus:ring-0 flex-grow text-[#dae2fd] text-[14px] py-2.5 outline-none placeholder-[#bccbb9]/40"
                />
                <button
                  type="button"
                  className="p-1.5 text-[#bccbb9] hover:text-[#4be277] transition-colors"
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-[#4be277] text-[#002109] flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:scale-105 active:scale-95 transition-all duration-200"
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
        className="relative group focus:outline-none"
        aria-label="Toggle chat support"
      >
        {/* Glow behind the icon */}
        <div className="absolute -inset-1.5 bg-[#4be277]/20 blur-lg group-hover:bg-[#4be277]/35 rounded-full transition-all duration-300"></div>

        {/* Notification badge */}
        {showNotification && !isOpen && (
          <span className="absolute top-1.5 right-1.5 z-20 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4be277] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#4be277] text-[9px] font-bold text-[#002109] items-center justify-center">
              1
            </span>
          </span>
        )}

        {/* 3D Chat Bubble Image with float/hover effects */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 relative z-10 hover:scale-110 active:scale-95 transition-all duration-300 ease-out cursor-pointer hover:-rotate-3 animate-pulse">
          <Image
            src="/images/chat-bubble-icon.png"
            alt="Chat Support Indicator Icon"
            fill
            sizes="(max-width: 640px) 64px, 80px"
            priority
            className="object-contain"
          />
        </div>
      </button>

      {/* Simple style overrides for custom scrollbar */}
      <style jsx global>{`
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
          background: rgba(75, 226, 119, 0.3);
        }
      `}</style>
    </div>
  );
}
