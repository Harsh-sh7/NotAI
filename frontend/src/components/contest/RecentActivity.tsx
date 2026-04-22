import React from 'react';

interface Submission {
    _id: string;
    problemTitle: string;
    problemDescription: string;
    difficulty: string;
    topic: string;
    language: string;
    code: string;
    solved: boolean;
    testCases?: any[];
    lastAttemptedAt?: string;
}

interface RecentActivityProps {
    submissions: Submission[];
    onSubmissionClick: (submission: Submission) => void;
    onViewAll: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ submissions, onSubmissionClick, onViewAll }) => {
    if (submissions.length === 0) return null;

    return (
        <div className="lg:col-span-1 self-start">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-text">Recent Activity</h2>
                <button
                    onClick={onViewAll}
                    className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
                >
                    View All
                </button>
            </div>

            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2">
                {submissions.slice(0, 5).map((submission) => (
                    <div
                        key={submission._id}
                        className="group relative p-4 rounded-xl hover:bg-white/[0.03] transition-all duration-300 cursor-pointer overflow-hidden"
                        onClick={() => onSubmissionClick(submission)}
                    >
                        <div className="flex items-center justify-between mb-1.5 relative z-10">
                            <h3 className="font-medium text-primary-text text-[15px] group-hover:text-accent transition-colors line-clamp-1">
                                {submission.problemTitle}
                            </h3>
                            {submission.solved && (
                                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 ml-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-secondary-text font-light relative z-10">
                            <span className={`flex items-center gap-1.5 ${submission.difficulty === 'Beginner' ? 'text-emerald-500' :
                                    submission.difficulty === 'Intermediate' ? 'text-amber-500' :
                                        'text-rose-500'
                                }`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                {submission.difficulty}
                            </span>
                            <span className="opacity-50">•</span>
                            <span>{submission.topic}</span>
                        </div>
                        {/* Subtle background line for separation */}
                        <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-white/[0.02] group-hover:bg-transparent transition-colors"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};
