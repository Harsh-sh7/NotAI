import React from 'react';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Minimal geometric design - overlapping squares representing AI layers */}
            <rect
                x="20"
                y="20"
                width="40"
                height="40"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="transition-all duration-300"
            />
            <rect
                x="40"
                y="40"
                width="40"
                height="40"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="transition-all duration-300"
            />
            {/* Center dot representing the core */}
            <circle
                cx="50"
                cy="50"
                r="6"
                fill="currentColor"
                className="transition-all duration-300"
            />
        </svg>
    );
};
