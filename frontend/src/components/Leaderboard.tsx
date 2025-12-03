import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface LeaderboardEntry {
    _id: string;
    username: string;
    email: string;
    totalSolved: number;
    totalAttempted: number;
    successRate: number;
    lastSolved: string;
}

interface LeaderboardProps {
    onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onClose }) => {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLeaderboard(selectedDifficulty);
    }, [selectedDifficulty]);

    const fetchLeaderboard = async (difficulty: string) => {
        setLoading(true);
        setError(null);

        try {
            const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const url = difficulty === 'All'
                ? `${backendUrl}/api/contest/leaderboard`
                : `${backendUrl}/api/contest/leaderboard?difficulty=${difficulty}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && Array.isArray(data.leaderboard)) {
                setLeaderboard(data.leaderboard);
            } else {
                setLeaderboard([]);
                setError('Invalid data format received');
            }
        } catch (err: any) {
            console.error('Error fetching leaderboard:', err);
            setError(err.message || 'Failed to load leaderboard');
            setLeaderboard([]);
        } finally {
            setLoading(false);
        }
    };

    const getUserRank = () => {
        if (!user) return null;
        const index = leaderboard.findIndex(entry => entry._id === user.id);
        return index >= 0 ? index + 1 : null;
    };

    const getCardColors = (rank: number) => {
        const colors = [
            { bg: 'bg-cyan-50', border: 'border-cyan-200', badge: 'bg-cyan-400', circle: 'bg-cyan-400' },
            { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-400', circle: 'bg-purple-400' },
            { bg: 'bg-pink-50', border: 'border-pink-200', badge: 'bg-pink-400', circle: 'bg-pink-400' },
            { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-400', circle: 'bg-green-400' },
            { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-400', circle: 'bg-blue-400' },
            { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-400', circle: 'bg-indigo-400' },
            { bg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-400', circle: 'bg-rose-400' },
        ];
        return colors[(rank - 4) % colors.length];
    };

    const topThree = leaderboard.slice(0, 3);
    const restOfLeaderboard = leaderboard.slice(3);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[#F5F1E8] border-2 border-gray-200 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in flex flex-col">
                {/* Header */}
                <div className="p-6 border-b-2 border-gray-200 flex items-center justify-between flex-shrink-0 bg-white">
                    <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <svg className="w-6 h-6 text-gray-600 hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Difficulty Filters */}
                <div className="p-4 border-b-2 border-gray-200 flex gap-3 overflow-x-auto flex-shrink-0 bg-white">
                    {['All', 'Beginner', 'Intermediate', 'Expert'].map((difficulty) => (
                        <button
                            key={difficulty}
                            onClick={() => setSelectedDifficulty(difficulty)}
                            className={`px-6 py-2.5 rounded-full font-semibold transition-all whitespace-nowrap ${selectedDifficulty === difficulty
                                ? 'bg-gray-800 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:text-gray-800 border-2 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {difficulty}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#F5F1E8]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-12 h-12 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600 text-lg mb-2">Error loading leaderboard</p>
                            <p className="text-gray-600 text-sm">{error}</p>
                            <button
                                onClick={() => fetchLeaderboard(selectedDifficulty)}
                                className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
                            >
                                Retry
                            </button>
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div className="text-center py-12 text-gray-600">
                            <p className="text-lg mb-2">No submissions yet</p>
                            <p className="text-sm">Be the first to solve a problem!</p>
                        </div>
                    ) : (
                        <>
                            {/* Top 3 Podium */}
                            {topThree.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-end justify-center gap-6 mb-8">
                                        {/* 2nd Place */}
                                        {topThree[1] && (
                                            <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                                <div className="relative mb-3">
                                                    <div className="w-24 h-24 rounded-full border-4 border-gray-300 bg-gray-100 flex items-center justify-center shadow-lg">
                                                        <span className="text-4xl font-bold text-gray-700">
                                                            {topThree[1].username.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                                                        2
                                                    </div>
                                                </div>
                                                <p className="font-bold text-gray-800 text-base">{topThree[1].username}</p>
                                                <p className="text-sm text-gray-600">{topThree[1].totalSolved} solved</p>
                                                <p className="text-xs text-gray-500">{Math.round(topThree[1].successRate)}%</p>
                                            </div>
                                        )}

                                        {/* 1st Place */}
                                        {topThree[0] && (
                                            <div className="flex flex-col items-center animate-slide-up">
                                                <div className="relative mb-3">
                                                    <div className="w-32 h-32 rounded-full border-4 border-yellow-400 bg-yellow-100 flex items-center justify-center shadow-xl">
                                                        <span className="text-5xl font-bold text-yellow-700">
                                                            {topThree[0].username.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-1.5 rounded-full text-base font-bold shadow-lg">
                                                        1
                                                    </div>
                                                </div>
                                                <p className="font-bold text-gray-800 text-lg">{topThree[0].username}</p>
                                                <p className="text-sm text-gray-600">{topThree[0].totalSolved} solved</p>
                                                <p className="text-xs text-gray-500">{Math.round(topThree[0].successRate)}%</p>
                                            </div>
                                        )}

                                        {/* 3rd Place */}
                                        {topThree[2] && (
                                            <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                                <div className="relative mb-3">
                                                    <div className="w-24 h-24 rounded-full border-4 border-orange-400 bg-orange-100 flex items-center justify-center shadow-lg">
                                                        <span className="text-4xl font-bold text-orange-700">
                                                            {topThree[2].username.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                                                        3
                                                    </div>
                                                </div>
                                                <p className="font-bold text-gray-800 text-base">{topThree[2].username}</p>
                                                <p className="text-sm text-gray-600">{topThree[2].totalSolved} solved</p>
                                                <p className="text-xs text-gray-500">{Math.round(topThree[2].successRate)}%</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Rest of Leaderboard */}
                            <div className="space-y-4">
                                {restOfLeaderboard.map((entry, index) => {
                                    const rank = index + 4;
                                    const isCurrentUser = user && entry._id === user.id;
                                    const colors = getCardColors(rank);

                                    return (
                                        <div
                                            key={entry._id}
                                            className={`p-5 rounded-2xl border-2 transition-all shadow-sm hover:shadow-md ${isCurrentUser
                                                ? 'bg-accent bg-opacity-10 border-accent'
                                                : `bg-white ${colors.border}`
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Avatar */}
                                                <div className={`w-14 h-14 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center flex-shrink-0`}>
                                                    <span className="text-2xl font-bold text-gray-700">
                                                        {entry.username.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>

                                                {/* User Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-800 text-lg truncate">
                                                        {entry.username}
                                                        {isCurrentUser && (
                                                            <span className="ml-2 text-xs bg-accent text-white px-2 py-1 rounded-full">
                                                                You
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {entry.totalSolved} solved
                                                    </p>
                                                </div>

                                                {/* Rank Badge */}
                                                <div className={`px-4 py-2 rounded-full text-sm font-bold ${colors.badge} text-white shadow-sm`}>
                                                    #{rank}
                                                </div>

                                                {/* Success Rate Circle */}
                                                <div className={`w-20 h-20 rounded-full ${colors.circle} flex items-center justify-center flex-shrink-0 shadow-md`}>
                                                    <span className="text-base font-bold text-white">
                                                        {Math.round(entry.successRate)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Current User Rank (if not in top shown) */}
                            {user && getUserRank() && getUserRank()! > 10 && (
                                <div className="mt-6 p-5 bg-white border-2 border-accent rounded-2xl shadow-md">
                                    <p className="text-center text-sm text-gray-600 mb-1">Your Rank</p>
                                    <p className="text-center text-3xl font-bold text-accent">
                                        #{getUserRank()}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
