import { Wrench, GitBranch, UserCheck } from "lucide-react"

export interface FeatureCardData {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export const featureCards: FeatureCardData[] = [
    {
        icon: <Wrench className="h-5 w-5" />,
        title: "ইন্ডাস্ট্রি স্ট্যান্ডার্ড টুলস",
        description: "বিশ্বের সেরা ডিজাইন স্টুডিওগুলো যেসব সফটওয়্যার ব্যবহার করে, সেগুলোই শিখুন।",
    },
    {
        icon: <GitBranch className="h-5 w-5" />,
        title: "হ্যান্ডস-অন প্রজেক্ট",
        description: "বাস্তব জীবনের ডিজাইন চ্যালেঞ্জ ও প্রজেক্ট দিয়ে আপনার পোর্টফোলিও গড়ে তুলুন।",
    },
    {
        icon: <UserCheck className="h-5 w-5" />,
        title: "এক্সপার্ট মেন্টরশিপ",
        description: "অভিজ্ঞ ডিজাইনার ও ইন্ডাস্ট্রি প্রফেশনালদের গাইডলাইন নিন সরাসরি।",
    },
];
