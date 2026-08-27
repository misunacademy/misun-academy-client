import { BookOpen, HelpCircle, CreditCard } from "lucide-react";
import type { ComponentType } from "react";

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

export interface ChatApiResponse {
  reply: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface QuickAction {
  label: string;
  icon: ComponentType<{ className?: string }>;
  prompt: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
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
