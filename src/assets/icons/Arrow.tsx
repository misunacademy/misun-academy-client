import React from "react";

export const Arrow: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg
            className={`w-6 h-6 ${className}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    );
};
