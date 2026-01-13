'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Users, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Debbroto, Mithun, Nurnobi } from "@/assets/images";

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(true);

  const teamMembers = [
    {
      name: "Mithun Sarkar",
      role: "FOUNDER & CEO",
      company: "MISUN Academy",
      image: Mithun,
      description: "Visionary leader driving digital education innovation",
      expertise: ["Leadership", "Digital Strategy", "Business Development"],
      experience: "5+ years"
    },
    {
      name: "Debbroto Biswas",
      role: "Senior Design Executive",
      company: "MISUN Academy",
      image: Debbroto,
      description: "Expert in data science and strategic development",
      expertise: ["Data Science", "Design", "Analytics"],
      experience: "2+ years"
    },
    {
      name: "Nurnobi Hossen Shagor",
      role: "Design Executive",
      company: "MISUN Academy",
      image: Nurnobi,
      description: "Specialized in digital skills and modern technology",
      expertise: ["UI/UX Design", "Digital Skills", "Technology"],
      experience: "1+ years"
    }
  ];

  return (
    <div className="pt-8 md:pt-16 font-bangla bg-background overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center bg-gradient-hero"
      // style={{
      //   backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url("")`,
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      //   backgroundAttachment: 'fixed'
      // }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float blur-xl"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-primary/10 rounded-full animate-float blur-2xl" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-primary/30 rounded-full animate-float blur-lg" style={{ animationDelay: '2s' }}></div>

        <div className={`relative container mx-auto text-center px-4 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="max-w-4xl mx-auto">
            {/* <div className="flex items-center justify-center mb-8">
              <Sparkles className="h-8 w-8 text-primary mr-4 animate-pulse" />
              <span className="text-primary font-semibold text-lg tracking-wide">MISUN ACADEMY</span>
              <Sparkles className="h-8 w-8 text-primary ml-4 animate-pulse" />
            </div> */}

            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-slide-up font-bangla">
              আমাদের সম্পর্কে
            </h1>

            <p className="text-xl md:text-2xl text-foreground/90 mb-8 leading-relaxed font-bangla max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              ভবিষ্যৎ প্রজন্মের জন্য ডিজিটাল শিক্ষার নতুন দিগন্ত
            </p>

            {/* <div className={`animate-slide-up`} style={{ animationDelay: '0.4s' }}>
              <Button
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 rounded-full"
              >
                আমাদের যাত্রা শুরু করুন
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div> */}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-primary/70" />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-6">
              <Users className="h-12 w-12 text-primary mr-4" />
              <span className="text-primary font-semibold text-lg">OUR TEAM</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 bg-primary bg-clip-text text-transparent">
              Meet Our Visionary Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-bangla">
              ডিজিটাল শিক্ষার রূপান্তরের পেছনে MISUN Academy&apos;র প্রতিভাবান টিমের সদস্যরা
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="bg-primary/10 backdrop-blur-xl border-primary/10 hover:shadow-glow transition-all duration-500 hover:scale-105 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="relative mb-8">
                    <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-primary/30 group-hover:border-primary/60 group-hover:bg-primary transition-all duration-300 relative">
                      <Image
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                    </div>

                    {/* Floating badges */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="h-4 w-4 text-primary-foreground" />
                    </div>

                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary/60 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/60">
                        <span className="text-white font-semibold text-sm">{member.experience}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-semibold mb-1 text-lg">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground mb-6">
                    {member.company}
                  </p>


                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-8 bg-primary bg-clip-text text-transparent font-bangla">
              আমাদের গল্প
            </h2>
          </div>

          <Card className="bg-gradient-card backdrop-blur-xl border-primary/20 overflow-hidden">
            <CardContent className="p-12">
              <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed font-bangla">
                <p className="text-lg md:text-xl mb-8 leading-relaxed">
                  <strong className="text-primary">MISUN Academy</strong> একটি উদ্ভাবনী ডিজিটাল লার্নিং প্ল্যাটফর্ম, যা ভবিষ্যৎ প্রজন্মকে দক্ষ ও কর্মক্ষম করে গড়ে তোলার লক্ষ্য নিয়ে প্রতিষ্ঠিত হয়েছে। আমাদের মূল লক্ষ্য—বাংলাদেশসহ বিশ্বের যে কোনো প্রান্তে থাকা শিক্ষার্থীদের আধুনিক প্রযুক্তি ও ডিজিটাল স্কিল (যেমন: গ্রাফিক ডিজাইন, ফ্রিল্যান্সিং, ডিজিটাল মার্কেটিং, ভিডিও এডিটিং ইত্যাদি) শেখার সুযোগ করে দেওয়া।
                </p>

                <div className="bg-primary/10 rounded-2xl p-8 my-8 border-l-4 border-primary">
                  <p className="text-lg leading-relaxed mb-0">
                    আমরা বিশ্বাস করি, প্রত্যেকের মধ্যেই সৃজনশীলতা আছে—সঠিক দিকনির্দেশনা আর প্র্যাকটিক্যাল স্কিল শেখার মাধ্যমে সেই প্রতিভা জাগ্রত করা সম্ভব। MISUN Academy সেই লক্ষ্যেই কাজ করে যাচ্ছে।
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 max-w-6xl">
          {/* Mission */}
          <Card className="bg-gradient-to-b from-primary to-primary backdrop-blur-xl border-primary/30 hover:shadow-glow transition-all duration-500 hover:scale-105 group overflow-hidden relative">
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <CardContent className="p-10 relative z-10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Our <span className="text-white">Mission</span>
                </h3>
                <p className="text-white font-semibold text-lg mb-6">
                  Skill First, Career Next.
                </p>
              </div>

              <div className="space-y-6 text-white font-bangla">
                <p className="font-semibold text-lg mb-6 text-white">আমাদের মিশন হলো:</p>
                <ul className="space-y-4">
                  {[
                    "বাংলাদেশের যুব সমাজকে আন্তর্জাতিক মানের ডিজিটাল দক্ষতা শেখানো।",
                    "বাস্তব ভিত্তিক (hands-on) শেখার অভিজ্ঞতা প্রদান করা।",
                    "ফ্রিল্যান্সিং ও রিমোট ক্যারিয়ার গড়ার জন্য আত্মবিশ্বাসী করে তোলা।",
                    "প্রযুক্তি নির্ভর একটি আত্মনির্ভরশীল প্রজন্ম গড়ে তোলা।"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4 mt-1 group-hover/item:bg-primary/30 transition-colors duration-300">
                        <ArrowRight className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="bg-gradient-to-b from-primary to-primary backdrop-blur-xl border-primary/30 hover:shadow-glow transition-all duration-500 hover:scale-105 group overflow-hidden relative">
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <CardContent className="p-10 relative z-10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Our <span className="text-white">Vision</span>
                </h3>
              </div>

              <div className="space-y-6 text-white font-bangla">
                <p className="font-semibold text-lg mb-6 text-white">আমাদের ভিশন হলো:</p>
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed">
                    সবার জন্য সাশ্রয়ী, মানসম্মত এবং প্রাসঙ্গিক ডিজিটাল শিক্ষা নিশ্চিত করা, যা তাদের একটি স্বাধীন ও আত্মনির্ভরশীল জীবনের দিকে এগিয়ে নিতে পারে।
                  </p>

                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <p className="text-lg leading-relaxed text-center">
                      আমরা এমন একটি কমিউনিটি গড়ে তুলতে চাই, যেখানে শেখা মানেই শুধু সার্টিফিকেট নয়, বরং বাস্তবে কাজ করার দক্ষতা অর্জন।
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>


    </div>
  );
};

export default AboutUs;