import * as React from "react";

interface ProgressProps {
    value?: number;
    className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value = 0, className = "" }) => {
    return (
        <div className={`h-1 w-full overflow-hidden bg-blue-100 ${className}`}>
            <div
                className="h-full bg-[#004B93] transition-all duration-300 ease-in-out"
                style={{ width: `${value}%` }}
            />
        </div>
    );
};
