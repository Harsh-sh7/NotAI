import React from 'react';
import { StatsCards } from './StatsCards';
import { RecentActivity } from './RecentActivity';
import { DifficultyCard } from './DifficultyCard';

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

interface ContestDashboardProps {
    user: any;
    submissions: Submission[];
    onDifficultyStart: (difficulty: string) => void;
    onSubmissionClick: (submission: Submission) => void;
    onViewHistory: () => void;
    onAuthRequired: () => void;
}

export const ContestDashboard: React.FC<ContestDashboardProps> = ({
    user,
    submissions,
    onDifficultyStart,
    onSubmissionClick,
    onViewHistory,
    onAuthRequired
}) => {
    return (
        <div className="flex-1 overflow-y-auto bg-primary">
            <div className="max-w-7xl mx-auto p-6 md:p-8">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-text mb-4 bg-gradient-to-r from-accent via-purple-500 to-accent bg-clip-text text-transparent animate-gradient">
                        Coding Contest
                    </h1>
                    <p className="text-lg text-secondary-text max-w-2xl mx-auto">
                        Challenge yourself with AI-generated problems. Choose your difficulty and start coding!
                    </p>
                </div>

                {/* Stats Grid */}
                <StatsCards submissions={submissions} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Difficulty Levels - Takes 2 columns */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-primary-text mb-6">Choose Your Challenge</h2>

                        <div className="space-y-4">
                            <DifficultyCard
                                level="Beginner"
                                submissions={submissions}
                                user={user}
                                onStart={() => onDifficultyStart('Beginner')}
                                onAuthRequired={onAuthRequired}
                            />

                            <DifficultyCard
                                level="Intermediate"
                                submissions={submissions}
                                user={user}
                                onStart={() => onDifficultyStart('Intermediate')}
                                onAuthRequired={onAuthRequired}
                            />

                            <DifficultyCard
                                level="Expert"
                                submissions={submissions}
                                user={user}
                                onStart={() => onDifficultyStart('Expert')}
                                onAuthRequired={onAuthRequired}
                            />
                        </div>
                    </div>

                    {/* Recent Activity - Takes 1 column */}
                    <RecentActivity
                        submissions={submissions}
                        onSubmissionClick={onSubmissionClick}
                        onViewAll={onViewHistory}
                    />
                </div>
            </div>
        </div>
    );
};
