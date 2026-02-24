import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Container from "@/components/ui/container";

const faqs = [
    {
        question: "কোর্সে ভর্তি হতে কী কী লাগবে?",
        answer: "কোর্সে ভর্তি হতে শুধু একটি স্মার্টফোন বা কম্পিউটার এবং ইন্টারনেট সংযোগ লাগবে। পেমেন্ট সম্পন্ন হলে আপনি ইমেইলে লগইন তথ্য এবং কোর্স ম্যাটেরিয়াল পাবেন। ডিজাইনের কোনো পূর্ব অভিজ্ঞতা ছাড়াও সম্পূর্ণ শূন্য থেকে শুরু করা যাবে।",
    },
    {
        question: "গ্রাফিক্স ডিজাইন শিখতে কোনো ডিভাইস লাগবে?",
        answer: "কোর্সটি করতে একটি মিনিমাম কনফিগারেশনের PC বা Laptop থাকলে ভালো হয়। তবে প্রথম পর্যায়ে স্মার্টফোন দিয়েও অনেক কিছু শেখা সম্ভব। Adobe Illustrator, Photoshop ও Figma — এই সফটওয়্যারগুলো ব্যবহারের গাইডও কোর্সে অন্তর্ভুক্ত।",
    },
    {
        question: "কোর্স শেষ করলে কি সত্যিই ইনকাম করা যাবে?",
        answer: "হ্যাঁ, অবশ্যই। আমাদের ৪ মাস পূর্ণভাবে লেগে থাকা স্টুডেন্টরা Fiverr, Upwork সহ লোকাল মার্কেটে কাজ পাচ্ছেন। কোর্সে ক্লায়েন্ট ডিলিং, প্রাইসিং, পোর্টফোলিও বিল্ডিং — সব কিছুই হাতে-কলমে শেখানো হয়।",
    },
    {
        question: "লাইভ ক্লাস মিস হলে কি করব?",
        answer: "কোনো সমস্যা নেই। সকল ক্লাসের রেকর্ডিং ড্যাশবোর্ডে সংরক্ষিত থাকে এবং যেকোনো সময় দেখা যায়। এছাড়াও দিনের ৩ বেলা লাইভ সাপোর্ট সেশন এবং ২৪/৭ WhatsApp গ্রুপ সাপোর্টের মাধ্যমে যেকোনো প্রশ্নের সমাধান পাওয়া যাবে।",
    },
    {
        question: "কোর্স শেষে কি সার্টিফিকেট দেওয়া হবে?",
        answer: "হ্যাঁ, কোর্স সফলভাবে সম্পন্ন করলে MISUN Academy থেকে একটি ডিজিটাল সার্টিফিকেট প্রদান করা হবে। এই সার্টিফিকেট LinkedIn প্রোফাইলে যোগ করা যাবে এবং ফ্রিল্যান্সিং বা চাকরির আবেদনে ব্যবহার করা যাবে।",
    },
    {
        question: "কোর্সের মেয়াদ কতদিন এবং কীভাবে পড়ানো হয়?",
        answer: "কোর্সটি ৪ মাসের। প্রতিদিন লাইভ ক্লাস, ১:১ মেন্টরশিপ, ফিডব্যাক সেশন ও রিয়েল-ওয়ার্ল্ড প্রজেক্টের মাধ্যমে শেখানো হয়। নিজের গতিতে শিখতে পারলেও নিয়মিত লেগে থাকলে সর্বোচ্চ ফলাফল পাওয়া যায়।",
    },
    {
        question: "MISUN এজেন্সিতে কাজের সুযোগ কীভাবে পাব?",
        answer: "কোর্স চলাকালীন যারা নিয়মিত অ্যাসাইনমেন্ট জমা দেন, অ্যাক্টিভ থাকেন এবং ভালো পারফরম্যান্স দেখান — তাদের সরাসরি MISUN এজেন্সিতে কাজ করার এবং টিমে যোগ দেওয়ার সুযোগ দেওয়া হয়।",
    },
];


const FaqSection = () => {
    return (
        <section className="relative bg-[#060f0a] overflow-hidden">

            {/* Dot-grid texture */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Ambient glows */}
            <div className="absolute -top-20 left-1/3 w-[480px] h-[480px] bg-primary/6 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            {/* Edge separators */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <Container className="relative z-10 py-20 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-14">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                        </span>
                        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">FAQ</span>
                    </div>

                    <h2 className="text-3xl lg:text-5xl font-bold font-monaExpanded uppercase leading-[140%]">
                        <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
                            Frequently Asked{" "}
                        </span>
                        <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(156_70%_42%/0.45)]">
                            Questions
                        </span>
                        <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">?</span>
                    </h2>

                    {/* Decorative divider */}
                    <div className="flex items-center gap-3 w-full max-w-xs mx-auto mt-8">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
                        <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
                    </div>
                </div>

                {/* Accordion wrapper card */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Outer glow ring */}
                    <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-primary/20 via-primary/5 to-transparent pointer-events-none" />

                    <div className="relative rounded-3xl bg-[#060f0a] border border-primary/15
                        p-6 md:p-10
                        shadow-[0_0_60px_hsl(156_70%_42%/0.10)]">

                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/50 rounded-tl-3xl" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/50 rounded-tr-3xl" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/50 rounded-bl-3xl" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/50 rounded-br-3xl" />

                        {/* Top shimmer */}
                        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`faq-${index}`}
                                    className="group border-b border-primary/10 last:border-0 py-1"
                                >
                                    <AccordionTrigger className="flex items-center justify-between w-full py-5 text-left
                                        text-base md:text-lg font-semibold
                                        text-white/80 hover:text-white
                                        data-[state=open]:text-primary
                                        transition-colors duration-200
                                        no-underline hover:no-underline focus:no-underline
                                        [&>svg]:text-primary/60 [&>svg]:data-[state=open]:text-primary">
                                        <span className="flex items-center gap-3">
                                            {/* Index dot */}
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/25
                                                flex items-center justify-center
                                                text-xs font-bold text-primary/70
                                                group-data-[state=open]:bg-primary/20 group-data-[state=open]:border-primary/50 group-data-[state=open]:text-primary
                                                transition-all duration-200">
                                                {index + 1}
                                            </span>
                                            <h2 className="font-semibold">{faq.question}</h2>
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5 pl-9 text-base text-white/55 leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default FaqSection;
