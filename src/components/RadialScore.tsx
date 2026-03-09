import React from 'react';

interface RadialScoreProps {
    score: number;
    label: string;
    size?: 'sm' | 'md' | 'lg';
}

export const RadialScore: React.FC<RadialScoreProps> = ({ score, label, size = 'md' }) => {
    const radius = size === 'lg' ? 45 : size === 'md' ? 36 : 28;
    const strokeWidth = size === 'lg' ? 6 : size === 'md' ? 5 : 4;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getColor = (s: number) => {
        if (s >= 90) return 'text-emerald-500';
        if (s >= 70) return 'text-blue-500';
        if (s >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    const currentSize = size === 'lg' ? 'w-32 h-32' : size === 'md' ? 'w-24 h-24' : 'w-16 h-16';

    return (
        <div className="flex flex-col items-center">
            <div className={`relative ${currentSize}`}>
                <svg className="w-full h-full -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-white/5"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={`${getColor(score)} transition-all duration-1000 ease-out`}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-black text-white ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm'}`}>
                        {score}
                    </span>
                </div>
            </div>
            <span className="mt-3 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">
                {label}
            </span>
        </div>
    );
};
