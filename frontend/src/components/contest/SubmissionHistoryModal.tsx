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
    attempts?: number;
    lastAttemptedAt?: string;
}

interface SubmissionHistoryModalProps {
    submissions: Submission[];
    onClose: () => void;
    onSubmissionClick: (submission: Submission) => void;
}

export const SubmissionHistoryModal: React.FC<SubmissionHistoryModalProps> = ({
    submissions,
    onClose,
    onSubmissionClick
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-secondary border-2 border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in flex flex-col">
                <div className="p-6 border-b-2 border-border flex items-center justify-between flex-shrink-0">
                    <h2 className="text-2xl font-bold text-primary-text">Your Submission History</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-primary rounded-lg transition-all"
                    >
                        <svg className="w-6 h-6 text-secondary-text hover:text-primary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {submissions.length === 0 ? (
                        <div className="text-center py-12 text-secondary-text">
                            <p className="text-lg mb-2">No submissions yet</p>
                            <p className="text-sm">Start solving problems to build your history!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {submissions.map((submission) => (
                                <div
                                    key={submission._id}
                                    className="p-4 bg-primary border-2 border-border rounded-lg hover:border-accent transition-all cursor-pointer"
                                    onClick={() => onSubmissionClick(submission)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary-text mb-1">
                                                {submission.problemTitle}
                                                {submission.solved && (
                                                    <span className="ml-2 text-xs bg-green-500 bg-opacity-20 text-green-500 px-2 py-1 rounded-full">
                                                        ✓ Solved
                                                    </span>
                                                )}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-secondary-text">
                                                <span className={`${submission.difficulty === 'Beginner' ? 'text-green-500' :
                                                        submission.difficulty === 'Intermediate' ? 'text-yellow-500' :
                                                            'text-red-500'
                                                    }`}>
                                                    {submission.difficulty}
                                                </span>
                                                <span>•</span>
                                                <span>{submission.topic}</span>
                                                <span>•</span>
                                                <span className="capitalize">{submission.language}</span>
                                            </div>
                                        </div>
                                        <div className="text-right text-sm text-secondary-text">
                                            {submission.attempts && (
                                                <p>{submission.attempts} attempt{submission.attempts > 1 ? 's' : ''}</p>
                                            )}
                                            {submission.lastAttemptedAt && (
                                                <p className="text-xs">{new Date(submission.lastAttemptedAt).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
