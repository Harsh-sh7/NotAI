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
            color: 'green',
            letter: 'B'
        },
        Intermediate: {
            color: 'yellow',
            letter: 'I'
        },
        Expert: {
            color: 'red',
            letter: 'E'
        }
    };

    const config = levelConfig[level];
    const levelSubmissions = submissions.filter(s => s.difficulty === level);
    const solvedCount = levelSubmissions.filter(s => s.solved).length;
    const totalCount = levelSubmissions.length;
    const progressPercent = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;

    if (user) {
        return (
            <div className={`group bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-${config.color}-500/50 hover:shadow-lg hover:shadow-${config.color}-500/10 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${config.color}-500/10 flex items-center justify-center`}>
                            <span className={`text-lg font-bold text-${config.color}-500`}>{config.letter}</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-primary-text">{level}</h3>
                            <p className="text-sm text-secondary-text">
                                {solvedCount} / {totalCount} solved
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onStart}
                        className={`px-6 py-2.5 bg-${config.color}-500 text-white rounded-lg font-medium hover:bg-${config.color}-600 transition-all duration-300 hover:scale-105`}
                    >
                        Start
                    </button>
                </div>
                <div className="h-2 bg-primary/50 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r from-${config.color}-500 to-${config.color}-400 transition-all duration-500`}
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-${config.color}-500/10 flex items-center justify-center`}>
                        <span className={`text-lg font-bold text-${config.color}-500`}>{config.letter}</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-primary-text">{level}</h3>
                        <p className="text-sm text-secondary-text">Sign in to track progress</p>
                    </div>
                </div>
                <button
                    onClick={onAuthRequired}
                    className={`px-6 py-2.5 bg-${config.color}-500 text-white rounded-lg font-medium hover:bg-${config.color}-600 transition-all duration-300`}
                >
                    Sign In
                </button>
            </div>
        </div>
    );
};
