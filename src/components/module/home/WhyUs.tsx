import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Headphones,
  Video,
  Target,
  BookOpen,
  Star,
  ArrowRight,
  Users,
  Clock,
  Laptop,
  Search,
  UserCircle,
  Zap,
  PencilRuler,
  Gift,
  FileBadge,
  Rocket
} from "lucide-react";
import Link from "next/link";

const WhyChooseSection = () => {
  const features = [
    {
      icon: Headphones,
      title: "প্রতিদিন ৩ বার সাপোর্ট সেশন",
      description: "প্রতিদিন তিনটি নির্ধারিত সাপোর্ট সেশনের মাধ্যমে আপনি যেকোনো সমস্যা দ্রুত সমাধান করতে পারবেন এবং শেখার গতি বাড়াতে পারবেন।",
      highlight: "সাপোর্ট"
    },
    {
      icon: Video,
      title: "লাইভ ক্লাস",
      description: "Zoom এ ইন্টার‌্যাকটিভ ৩৫টি মেইন ক্লাস এবং ৩০টিরও বেশি সাপোর্ট ক্লাসের মাধ্যমে নিশ্চিত শেখা।",
      highlight: "ইন্টার‌্যাকটিভ শেখা"
    },
    {
      icon: Target,
      title: "মার্কেটপ্লেস ভিত্তিক প্রজেক্ট",
      description: "বাস্তব মার্কেটপ্লেস প্রজেক্টে কাজ করার অভিজ্ঞতা অর্জন করুন, যা আপনাকে পোর্টফোলিও তৈরিতে সহায়তা করবে এবং চাকরি পেতে সহায়ক হবে।",
      highlight: "বাস্তব প্রজেক্ট"
    },
    {
      icon: BookOpen,
      title: "গাইডলাইন সেশন",
      description: "শিল্পের মানদণ্ড, সেরা অনুশীলন এবং ক্যারিয়ার ডেভেলপমেন্ট নিয়ে প্রাতিষ্ঠানিক গাইডলাইন সেশন।",
      highlight: "বিশেষজ্ঞ দিকনির্দেশনা"
    },
    {
      icon: Laptop,
      title: "৯০+ প্রবলেম সলভিং ক্লাস",
      description: "অতিরিক্ত ৯০টিরও বেশি প্রবলেম সলভিং ক্লাসে অংশগ্রহণ করে স্কিল করুন আরও শানিত।",
      highlight: "হ্যান্ডস-অন প্র্যাকটিস"
    },
    {
      icon: Search,
      title: "ক্লাইন্ট হান্টিং সিক্রেট ট্রিক্স",
      description: "লোকাল ও আন্তর্জাতিক ক্লায়েন্ট পাওয়ার কার্যকরী টেকনিক ও স্ট্র্যাটেজি শিখবেন হাতে-কলমে।",
      highlight: "কাজ পাওয়ার গ্যারান্টি"
    },
    {
      icon: UserCircle,
      title: "পার্সোনাল পোর্টফোলিও বিল্ডিং",
      description: "ব্যক্তিগত ব্র্যান্ডিংয়ের জন্য পার্সোনাল পোর্টফোলিও তৈরি করা হবে লাইভ ক্লাসের মাধ্যমে।",
      highlight: "প্রফেশনাল পরিচিতি"
    },
    {
      icon: Zap,
      title: "AI হেল্পার মাস্টারক্লাস",
      description: "ডিজাইনে এআই টুলস কীভাবে ব্যবহার করবেন, তা নিয়ে থাকবে এক্সক্লুসিভ মাস্টারক্লাস।",
      highlight: "AI Powered Workflow"
    },
    {
      icon: PencilRuler,
      title: "ট্রেন্ডি ডিজাইন শেখানো হবে",
      description: "বর্তমান মার্কেটের ট্রেন্ডি ডিজাইন শেখানো হবে যাতে আপনি সবাই থেকে এগিয়ে থাকেন।",
      highlight: "টপ-লেভেল স্কিল"
    },
    {
      icon: Gift,
      title: "সেরা শিক্ষার্থীর জন্য স্পেশাল গিফট",
      description: "ব্যাচের সেরা পারফর্মার পাবেন MISUN Academy থেকে একটি বিশেষ উপহার।",
      highlight: "অভিনন্দন উপহার"
    },
    {
      icon: FileBadge,
      title: "সার্টিফিকেট প্রদান",
      description: "কোর্স শেষে একটি অফিসিয়াল সার্টিফিকেট প্রদান করা হবে সফল শিক্ষার্থীদের।",
      highlight: "অফিশিয়াল স্বীকৃতি"
    },
    {
      icon: Rocket,
      title: "৪টি প্রজেক্ট ভিত্তিক পরীক্ষা",
      description: "নিজের স্কিল যাচাইয়ের জন্য থাকছে চারটি রিয়েল প্রজেক্ট বেইজড পরীক্ষা।",
      highlight: "পরীক্ষার মাধ্যমে যাচাই"
    },
    {
      icon: Star,
      title: "৫০০+ প্রিমিয়াম ডিজাইন রিসোর্স",
      description: "ডিজাইন উন্নয়নে সহায়ক ৫০০+ প্রিমিয়াম রিসোর্স ফ্রি তে পাচ্ছেন।",
      highlight: "রিসোর্স বুস্ট"
    }
  ];


  const stats = [
    { icon: Users, value: "৭০০+", label: "শিক্ষার্থী ভর্তি হয়েছেন" },
    { icon: Star, value: "৪.৯", label: "কোর্স রেটিং" },
    { icon: Clock, value: "৪ মাস", label: "মেয়াদ" }
  ];

  return (
    <section className="bg-gradient-hero mb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 font-bangla rounded-full text-sm font-medium mb-4 animate-glow">
            <Star className="w-4 h-4" />
            প্রিমিয়াম গ্রাফিক্স ডিজাইন কোর্স
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-bangla mb-6  text-secondary">
            কেন <span className="text-primary">Misun Academy?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed font-bangla">
            আপনার সৃজনশীল চিন্তাকে প্রফেশনাল দক্ষতায় রূপান্তর করুন আমাদের সম্পূর্ণ গ্রাফিক্স ডিজাইন কোর্সের মাধ্যমে।
            ইন্ডাস্ট্রি এক্সপার্টদের কাছ থেকে শিখুন এবং এমন একটি পোর্টফোলিও তৈরি করুন যা ক্লায়েন্টদের দৃষ্টি আকর্ষণ করে।
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:bg-primary/10 bg-inherit border-primary/20 shadow-card hover:shadow-hover transition-all duration-300 transform hover:scale-105 animate-scale-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="flex flex-col md:flex-row items-center justify-center gap-3 p-6">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center font-bangla">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group cursor-pointer bg-gray-50 border-primary/10 shadow-card hover:shadow-hover hover:bg-primary transition-all duration-500 transform hover:scale-105 hover:border-primary/30 animate-scale-up font-bangla"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="p-4 bg-gradient-primary rounded-xl group-hover:animate-glow-pulse">
                      <feature.icon className="w-10 h-10 text-primary group-hover:text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-white transition-colors">
                        {feature.title}
                      </h3>
                      <span className="text-xs bg-course-accent text-primary group-hover:text-white px-2 py-1 rounded-full font-medium">
                        {feature.highlight}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed group-hover:text-white transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center font-bangla">
          <Card className="bg-gradient-card border-primary/20 shadow-hover max-w-2xl mx-auto animate-fade-up">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                আপনার ডিজাইন যাত্রা শুরু করতে প্রস্তুত?
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                শত শত সফল শিক্ষার্থীদের মত আপনিও আপনার ক্যারিয়ার পরিবর্তন করুন আমাদের
                পূর্ণাঙ্গ গ্রাফিক্স ডিজাইন প্রোগ্রামে অংশগ্রহণ করে। পান লাইফটাইম অ্যাক্সেস এবং ইন্ডাস্ট্রি সার্টিফিকেট।
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href={"/checkout"}>
                  <Button variant="default" size="lg" className="group">
                    এখনই ভর্তি হন
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href={"/courses"}>
                  <Button variant="outline" size="lg">
                    কারিকুলাম দেখুন
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
