"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Message, ChatApiResponse } from "./chat/constants";
import { chatStyles } from "./chat/styles";
import ChatHeader from "./chat/ChatHeader";
import ChatMessages from "./chat/ChatMessages";
import ChatInput from "./chat/ChatInput";
import ChatToggle from "./chat/ChatToggle";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMessages([
        {
          id: "init-1",
          sender: "bot",
          text: "স্বাগতম! আমি Sun, Misun Academy-এর আপনার AI সহায়ক। কিভাবে আপনাকে সাহায্য করতে পারি?",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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

      // Server accepts user turns only (assistant history is untrusted
      // client input — a jailbreak vector). Send recent genuine user turns;
      // the service is stateless per request otherwise.
      const userTurns = messagesRef.current
        .filter((m) => m.sender === "user")
        .slice(-10)
        .map((m) => ({ role: "user" as const, content: m.text }));
      const conversation = [
        ...userTurns,
        { role: "user" as const, content: text.trim() },
      ];

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);

      try {
        const csrfMatch =
          typeof document !== 'undefined'
            ? document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)
            : null;
        const csrfToken = csrfMatch ? decodeURIComponent(csrfMatch[1]) : null;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
            },
            credentials: "include",
            body: JSON.stringify({ messages: conversation }),
          },
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
    [],
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
            <ChatHeader onToggle={handleToggle} />
            <ChatMessages
              messages={messages}
              isTyping={isTyping}
              onQuickAction={handleQuickAction}
            />
            <ChatInput
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSend={handleSend}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ChatToggle
        onToggle={handleToggle}
        showNotification={showNotification}
        isOpen={isOpen}
      />

      <style jsx global>{chatStyles}</style>
    </div>
  );
}
