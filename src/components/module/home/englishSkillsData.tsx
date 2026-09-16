import { MessageSquare, Globe, BookOpen } from "lucide-react";
import type { ReactNode } from "react";

export interface FeatureCard {
    icon: ReactNode;
    title: string;
    description: string;
}

export const featureCards: FeatureCard[] = [
    {
        icon: <MessageSquare className="h-5 w-5" />,
        title: "ফ্লুয়েন্ট স্পিকিং",
        description: "বাস্তব জীবনের কথোপকথন ও ইন্টারভিউতে আত্মবিশ্বাসের সাথে ইংরেজিতে কথা বলতে শিখুন।",
    },
    {
        icon: <Globe className="h-5 w-5" />,
        title: "আইইএলটিএস (IELTS)",
        description: "উচ্চতর শিক্ষা ও ক্যারিয়ারের জন্য প্রয়োজনীয় স্কোর অর্জন করতে আমাদের এক্সপার্ট গাইডলাইন অনুসরণ করুন।",
    },
    {
        icon: <BookOpen className="h-5 w-5" />,
        title: "অ্যাডভান্সড গ্রামার",
        description: "সঠিক উচ্চারণ, শব্দভাণ্ডার এবং কর্পোরেট লেভেল গ্রামার দক্ষতা অর্জন করুন সহজে।",
    },
];
