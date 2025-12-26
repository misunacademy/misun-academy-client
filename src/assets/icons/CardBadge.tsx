import React from "react";

export const CardBadge: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
    return (
        <span className={`px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full ${className}`}>
            {text}
        </span>
    );
};
