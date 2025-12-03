import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface ContestProfileProps {
    onClose: () => void;
}

export const ContestProfile: React.FC<ContestProfileProps> = ({ onClose }) => {
    const { user, updateContestLevel } = useAuth();
    const [selectedLevel, setSelectedLevel] = useState(user?.contestLevel || '');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleSaveLevel = async () => {
        if (!selectedLevel) {
            setMessage('Please select a level');
            return;
        }

        setIsSaving(true);
        setMessage('');

        try {
            await updateContestLevel(selectedLevel);
            setMessage('✓ Level updated successfully!');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            setMessage('✗ Failed to update level');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-secondary border-2 border-border rounded-2xl w-full max-w-md overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b-2 border-border flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-primary-text">Contest Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-primary rounded-lg transition-all"
                    >
                        <svg className="w-6 h-6 text-secondary-text hover:text-primary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* User Info */}
                    <div className="text-center pb-6 border-b-2 border-border">
                        <div className="w-20 h-20 bg-accent bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-3xl font-bold text-accent">
                                {user?.username?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-primary-text mb-1">{user?.username}</h3>
                        <p className="text-sm text-secondary-text">{user?.email}</p>
                    </div>

                    {/* Level Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-3">
                            Contest Difficulty Level
                        </label>
                        <div className="space-y-3">
                            <button
                                onClick={() => setSelectedLevel('Beginner')}
                                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${selectedLevel === 'Beginner'
                                        ? 'border-green-500 bg-green-500 bg-opacity-10'
                                        : 'border-border bg-primary hover:border-green-500'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">🌱</div>
                                    <div className="flex-1">
                                        <h4 className={`font-bold ${selectedLevel === 'Beginner' ? 'text-green-500' : 'text-primary-text'
                                            }`}>
                                            Beginner
                                        </h4>
                                        <p className="text-sm text-secondary-text">
                                            Basic problems to get you started
                                        </p>
                                    </div>
                                    {selectedLevel === 'Beginner' && (
                                        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </button>

                            <button
                                onClick={() => setSelectedLevel('Intermediate')}
                                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${selectedLevel === 'Intermediate'
                                        ? 'border-yellow-500 bg-yellow-500 bg-opacity-10'
                                        : 'border-border bg-primary hover:border-yellow-500'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">🚀</div>
                                    <div className="flex-1">
                                        <h4 className={`font-bold ${selectedLevel === 'Intermediate' ? 'text-yellow-500' : 'text-primary-text'
                                            }`}>
                                            Intermediate
                                        </h4>
                                        <p className="text-sm text-secondary-text">
                                            Moderate challenges for growing skills
                                        </p>
                                    </div>
                                    {selectedLevel === 'Intermediate' && (
                                        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </button>

                            <button
                                onClick={() => setSelectedLevel('Expert')}
                                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${selectedLevel === 'Expert'
                                        ? 'border-red-500 bg-red-500 bg-opacity-10'
                                        : 'border-border bg-primary hover:border-red-500'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">⚡</div>
                                    <div className="flex-1">
                                        <h4 className={`font-bold ${selectedLevel === 'Expert' ? 'text-red-500' : 'text-primary-text'
                                            }`}>
                                            Expert
                                        </h4>
                                        <p className="text-sm text-secondary-text">
                                            Advanced problems for experts
                                        </p>
                                    </div>
                                    {selectedLevel === 'Expert' && (
                                        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`p-3 rounded-lg text-center text-sm font-semibold ${message.includes('✓')
                                ? 'bg-green-500 bg-opacity-20 text-green-500'
                                : 'bg-red-500 bg-opacity-20 text-red-500'
                            }`}>
                            {message}
                        </div>
                    )}

                    {/* Save Button */}
                    <button
                        onClick={handleSaveLevel}
                        disabled={isSaving || !selectedLevel}
                        className="w-full px-6 py-3 bg-accent text-primary rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};
