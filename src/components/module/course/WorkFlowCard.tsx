import React from "react";

interface WorkflowCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function WorkflowCard({ icon, title, description }: WorkflowCardProps) {
    return (
        <div className="grid grid-cols-1 gap-4 w-[350px] md:w-full mx-auto group cursor-pointer">
            <div className="rounded-3xl bg-primary/30 py-8 px-8 group-hover:bg-secondary/90 m-2">
                {icon}
                <h1 className="text-xl font-bold mt-3 group-hover:text-primary font-bangla">
                    {title}
                </h1>
                <p className="text-md leading-[150%] tracking-[0] max-w-6xl mt-4 text-secondary group-hover:text-white font-bangla">
                    {description}
                </p>
            </div>
        </div>
    );
}
