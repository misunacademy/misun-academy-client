'use client';

import Clock from "@/assets/icons/Clock";
import Container from "@/components/ui/container";
import WorkflowCard from "./WorkFlowCard";
import { Button } from "@/components/ui/button";
import { Duration, Scic, SearchOnline, Session, SubmitAssignment, SupportSession, WeekCourse } from "@/assets/icons";
import Link from "next/link";

const workflowSteps = [
    {
        title: "১:১ মেন্টরশিপ",
        description: "আপনার প্রতিটি সমস্যায় গাইড করবে একজন অভিজ্ঞ মেন্টর।",
        icon: <Clock />
    },
    {
        title: "ডেইলি ৩ বেলা লাইভ সাপোর্ট সেশন",
        description: "সকাল, বিকেল ও রাতে প্রতিদিন সরাসরি লাইভ সাপোর্ট পাওয়া যাবে।",
        icon: <Scic />
    },
    {
        title: "২৪/৭ WhatsApp প্রাইভেট গ্রুপ সাপোর্ট",
        description: "যেকোনো সময়ে WhatsApp গ্রুপ থেকে দ্রুত সাহায্য ও গাইডলাইন পাবেন।",
        icon: <SearchOnline />
    },
    {
        title: "১:১ ফিডব্যাক সেশন",
        description: "আপনার ডিজাইনের ওপর পার্সোনাল রিভিউ এবং উন্নতির পরামর্শ দেওয়া হবে।",
        icon: <Session />
    },
    {
        title: "জব এর জন্য সরাসরি হেল্প",
        description: "ফ্রিল্যান্সিং কিংবা লোকাল মার্কেটে কাজ পাওয়ার জন্য সরাসরি সহায়তা প্রদান করা হবে।",
        icon: <SupportSession />
    },
    {
        title: "৪ মাস লেগে থাকা স্টুডেন্টদের জন্য ১০০% সফলতার গ্যারান্টি",
        description: "পুরোপুরি লেগে থাকলে ডিজাইন সেক্টরে সফল হওয়ার পথ নিশ্চিত।",
        icon: <SubmitAssignment />
    },
    {
        title: "এজেন্সিতে কাজ করার সুযোগ",
        description: "লেগে থাকা স্টুডেন্টরা আমাদের এজেন্সিতে কাজ করার সুযোগ পাবেন।",
        icon: <WeekCourse />
    },
    {
        title: "সেরা স্টুডেন্টদের জন্য MISUN টিমে কাজের সুযোগ",
        description: "সেরা পারফর্মাররা আমাদের টিমের সঙ্গে যুক্ত হয়ে কাজ করার সুযোগ পাবেন।",
        icon: <Duration />
    }
]



export default function CourseWorkflow() {
    return (
        <Container className="mb-16 md:mb-36 max-w-7xl mx-auto">
            <section className="">
                <div className="p-4">
                    <div className="text-center">
                        <h1 className="text-3xl lg:text-5xl font-bold font-bangla uppercase leading-[150%] tracking-[0]">কোর্স যেভাবে <span className="text-primary">পরিচালিত</span> হবে</h1>
                        <p className="mt-4 lg:mr-6 text-black text-center font-bangla">
                            AI-এর যুগে ডিজাইন করা হয়েছে সহজ, কিন্তু সাফল্যের চাবিকাঠি এখন সঠিক জিনিসটা শিখে, সঠিক জায়গায় প্রয়োগ করা। এই কোর্সে আপনি শুধু সফটওয়্যার শেখা নয়, বরং একদম প্রফেশনাল লেভেলের বাস্তব কাজ শেখার সুযোগ পাবেন।
                        </p>
                        <div className="mt-8 mb-6 space-x-3">
                            <Link href={"/checkout"}>
                                <Button className='cursor-pointer'>এনরোল করুন</Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {workflowSteps.map((step, index) => (
                        <WorkflowCard key={index} {...step} />
                    ))}
                </div>
            </section>
        </ Container>
    );
}
