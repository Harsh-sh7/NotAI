import React from 'react';

interface DifficultyCardProps {
    level: 'Beginner' | 'Intermediate' | 'Expert';
    submissions: any[];
    user: any;
    onStart: () => void;
    onAuthRequired: () => void;
}

export const DifficultyCard: React.FC<DifficultyCardProps> = ({
    level,
    submissions,
    user,
    onStart,
    onAuthRequired
}) => {
    const levelConfig = {
        Beginner: {
            bgHover: 'hover:bg-emerald-500/5 hover:border-emerald-500/30',
            dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
            text: 'text-emerald-500',
            btnClass: 'border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white',
            gradient: 'from-emerald-500 to-emerald-400'
        },
        Intermediate: {
            bgHover: 'hover:bg-amber-500/5 hover:border-amber-500/30',
            dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
            text: 'text-amber-500',
            btnClass: 'border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-white',
            gradient: 'from-amber-500 to-amber-400'
        },
        Expert: {
            bgHover: 'hover:bg-rose-500/5 hover:border-rose-500/30',
            dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
            text: 'text-rose-500',
            btnClass: 'border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white',
            gradient: 'from-rose-500 to-rose-400'
        }
    };

    const config = levelConfig[level];
    const levelSubmissions = submissions.filter(s => s.difficulty === level);
    const solvedCount = levelSubmissions.filter(s => s.solved).length;
    const totalCount = levelSubmissions.length;
    const progressPercent = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;

    if (user) {
        return (
            <div className={`group bg-secondary/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 ${config.bgHover} transition-all duration-500 overflow-hidden relative`}>
                <div className="flex items-center justify-between mb-5 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`}></div>
                        <div>
                            <h3 className="text-xl font-medium text-primary-text tracking-wide">{level}</h3>
                            <p className="text-sm text-secondary-text font-light mt-0.5">
                                {solvedCount} of {totalCount} completed
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onStart}
                        className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${config.btnClass}`}
                    >
                        Start Challenge
                    </button>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden relative z-10">
                    <div
                        className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-1000 ease-out`}
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>
        );
    }

    return (
        <div className="group bg-secondary/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`}></div>
                    <div>
                        <h3 className="text-xl font-medium text-primary-text tracking-wide">{level}</h3>
                        <p className="text-sm text-secondary-text font-light mt-0.5">Sign in to track progress</p>
                    </div>
                </div>
                <button
                    onClick={onAuthRequired}
                    className="px-5 py-2 rounded-full font-medium text-sm border border-white/10 text-primary-text hover:bg-white/5 transition-all duration-300"
                >
                    Sign In
                </button>
            </div>
        </div>
    );
};
