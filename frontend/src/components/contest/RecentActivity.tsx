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

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {submissions.slice(0, 5).map((submission) => (
                    <div
                        key={submission._id}
                        className="bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 hover:border-accent/50 transition-all duration-300 cursor-pointer group"
                        onClick={() => onSubmissionClick(submission)}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-primary-text text-sm group-hover:text-accent transition-colors line-clamp-1">
                                {submission.problemTitle}
                            </h3>
                            {submission.solved && (
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-secondary-text">
                            <span className={`px-2 py-0.5 rounded ${submission.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-500' :
                                    submission.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-500' :
                                        'bg-red-500/10 text-red-500'
                                }`}>
                                {submission.difficulty}
                            </span>
                            <span>•</span>
                            <span>{submission.topic}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
