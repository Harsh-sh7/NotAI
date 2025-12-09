import React from 'react';

interface StatsCardsProps {
    submissions: any[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ submissions }) => {
    const solvedCount = submissions.filter(s => s.solved).length;
    const totalCount = submissions.length;
    const successRate = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-accent/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-secondary-text mb-1">Problems Solved</p>
                        <p className="text-4xl font-bold text-primary-text">{solvedCount}</p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                        <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-accent/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-secondary-text mb-1">Total Attempts</p>
                        <p className="text-4xl font-bold text-primary-text">{totalCount}</p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-accent/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-secondary-text mb-1">Success Rate</p>
                        <p className="text-4xl font-bold text-primary-text">{successRate}%</p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
