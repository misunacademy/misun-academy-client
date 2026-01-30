import React from "react";

export const Branch: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`w-10 h-1 bg-gray-500 rounded-full ${className}`} />
    );
};
