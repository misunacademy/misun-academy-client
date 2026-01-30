import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star, Facebook } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TestimonialCardProps {
    name: string;
    batch: string;
    studentId: string;
    testimonial: string;
    postLink?: string;
    index?: number;
}

export const TestimonialCard = ({ name, batch, studentId, testimonial, postLink, index = 0 }: TestimonialCardProps) => {

    return (
        <Card
            className="relative p-6 bg-gradient-card border-testimonial-border shadow-testimonial hover:shadow-testimonial-hover transition-all duration-500 hover:-translate-y-2 group overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Floating quote icon */}
            <div className="absolute -top-2 -right-2 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:rotate-12">
                <Quote className="w-16 h-16 text-primary" />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Star decoration */}
            <div className="absolute top-2 left-2 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <Star className="w-4 h-4 text-primary fill-current" />
            </div>

            <div className="relative space-y-4">
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                            {name}
                        </h3>

                        <TooltipProvider>
                            <div className="flex items-center gap-2">
                                {/* Facebook Link with Tooltip */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <a
                                            href={postLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="transition-all duration-300 transform hover:scale-110 active:scale-95 text-muted-foreground hover:text-primary hover:font-bold hover:bg-primary/20 rounded-xl p-2"
                                        >
                                            <Facebook className="w-5 h-5" />
                                        </a>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>View on Facebook</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Badge
                            variant="secondary"
                            className="bg-primary text-primary-foreground shadow-sm font-medium"
                        >
                            {batch} ব্যাচ
                        </Badge>
                        <span className="text-[10px] text-muted-foreground bg-primary/20 px-2 py-1 rounded-md">
                            ID: {studentId}
                        </span>
                    </div>
                </div>

                <blockquote className="text-testimonial-foreground leading-relaxed text-justify relative">
                    <span className="text-primary text-xl absolute -left-2 -top-1">&ldquo;</span>
                    <span className="pl-3 text-sm font-bangla">{testimonial}</span>
                    <span className="text-primary text-xl">&rdquo;</span>
                </blockquote>

                {/* Bottom accent line */}
                <div className="h-1 bg-gradient-primary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
        </Card>
    );
};