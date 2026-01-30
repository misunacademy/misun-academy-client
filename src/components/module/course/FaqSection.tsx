import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Container from "@/components/ui/container";

const faqs = [
    {
        question: "How can I enroll in the course?",
        answer: "You can enroll by clicking the 'Enroll Now' button on the course page. This will take you to the checkout process, where you can complete your payment. Once the payment is confirmed, you will receive an email with login details and access to the course materials.",
    },
    {
        question: "What is the course duration?",
        answer: "The course duration depends on your pace of learning. However, we recommend dedicating at least 6-8 hours per day for optimal progress. The course is structured to be flexible, allowing you to learn at your convenience while maintaining a structured timeline.",
    },
    {
        question: "Will I get a certificate?",
        answer: "Yes! Upon successfully completing the course, you will receive a digital certificate of completion. This certificate can be downloaded, shared on your LinkedIn profile, or used as proof of your skills for job applications and professional development.",
    },
    {
        question: "What if I miss a module?",
        answer: "No worries! All course modules are recorded and available for you to watch at any time. You can access them from your dashboard and replay them as many times as needed. This ensures you never miss any important lessons, even if you're unable to attend live sessions.",
    },
    {
        question: "Do I need prior coding experience?",
        answer: "Not at all! This course is designed to be beginner-friendly. We start with the basics and gradually move to advanced topics. Step-by-step guidance, hands-on projects, and detailed explanations will help you build a strong foundation, even if you have no prior coding experience.",
    },
];


const FaqSection = () => {
    return (
        <Container>
            <div className="mb-20 mt-24 md:mt-48">
                <h1 className="text-[28px] md:text-3xl lg:text-4xl font-bold font-monaExpanded text-center uppercase">
                    Frequently Asked <span className="text-primary">Questions?</span>
                </h1>
            </div>
            <section className="max-w-6xl mx-auto my-12 bg-secondary/50 rounded-2xl md:rounded-3xl p-6 md:p-16 border border-primary/15">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`faq-${index}`} className="md:my-1">
                            <AccordionTrigger className="text-xl font-semibold flex items-center justify-between w-full data-[state=open]:text-primary no-underline hover:no-underline focus:no-underline">
                                <h2>{faq.question}</h2>
                            </AccordionTrigger>
                            <AccordionContent className="text-[16px]">{faq.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>
        </Container>
    );
};

export default FaqSection;
