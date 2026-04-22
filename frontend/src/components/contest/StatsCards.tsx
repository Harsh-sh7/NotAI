import React from 'react';

interface StatsCardsProps {
    submissions: any[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ submissions }) => {
    const solvedCount = submissions.filter(s => s.solved).length;
    const totalCount = submissions.length;
    const successRate = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

    return (
        <div className="mb-16 bg-secondary/30 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
                <div className="p-8 hover:bg-white/[0.02] transition-colors duration-300">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold text-primary-text tracking-tight mb-1">{solvedCount}</p>
                        <p className="text-sm font-medium text-secondary-text tracking-wide uppercase">Problems Solved</p>
                    </div>
                </div>

                <div className="p-8 hover:bg-white/[0.02] transition-colors duration-300">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold text-primary-text tracking-tight mb-1">{totalCount}</p>
                        <p className="text-sm font-medium text-secondary-text tracking-wide uppercase">Total Attempts</p>
                    </div>
                </div>

                <div className="p-8 hover:bg-white/[0.02] transition-colors duration-300">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold text-primary-text tracking-tight mb-1">{successRate}%</p>
                        <p className="text-sm font-medium text-secondary-text tracking-wide uppercase">Success Rate</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
