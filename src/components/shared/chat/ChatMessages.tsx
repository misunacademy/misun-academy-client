"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import type { Message } from "./constants";
import { QUICK_ACTIONS } from "./constants";

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  onQuickAction: (prompt: string) => void;
}

export default function ChatMessages({
  messages,
  isTyping,
  onQuickAction,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-[#0b1326]/50">
      {messages.length === 1 && (
        <div className="flex flex-col items-center py-3 px-2">
          <p className="text-[12px] text-sage/50 text-center leading-relaxed">
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
                onClick={() => onQuickAction(action.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-navy/70 border border-white/10 text-[12px] text-sage hover:text-primary hover:border-primary/30 transition-all duration-200"
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
                alt="Sun"
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
                  : "bg-surface-navy/90 text-[#dae2fd] border border-white/5 rounded-tl-none"
              }`}
            >
              {msg.sender === "bot" ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-white">
                        {children}
                      </strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-4 mb-2 space-y-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-4 mb-2 space-y-1">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-[14px] leading-relaxed">
                        {children}
                      </li>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-semibold text-white mt-3 mb-1">
                        {children}
                      </h3>
                    ),
                    hr: () => (
                      <div className="my-3 border-t border-white/10" />
                    ),
                    code: ({ children }) => (
                      <code className="bg-white/5 px-1.5 py-0.5 rounded text-sm">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {msg.text.replace(/\n/g, "  \n")}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
            <span className="text-[9px] text-sage/40 px-1">
              {msg.time}
            </span>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex gap-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-full border border-primary/20 relative overflow-hidden flex-shrink-0">
            <Image
              src="/images/chat-bubble-icon-white.png"
              alt="Sun"
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div className="bg-surface-navy/90 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 opacity-80">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
