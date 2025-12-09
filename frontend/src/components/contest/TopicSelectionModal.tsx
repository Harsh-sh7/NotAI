import React from 'react';
import { SparklesIcon } from '../Icons';

const DSA_TOPICS = [
    'Arrays',
    'Strings',
    'Linked Lists',
    'Stacks',
    'Queues',
    'Trees',
    'Graphs',
    'Sorting',
    'Searching',
    'Dynamic Programming',
    'Greedy Algorithms',
    'Backtracking',
    'Hash Tables',
    'Heaps',
    'Recursion',
];

interface TopicSelectionModalProps {
    level: string;
    topic: string;
    customTopic: string;
    language: string;
    isLoading: boolean;
    error: string | null;
    onTopicSelect: (topic: string) => void;
    onCustomTopicChange: (topic: string) => void;
    onLanguageChange: (language: string) => void;
    onGenerate: () => void;
    onClose: () => void;
}

export const TopicSelectionModal: React.FC<TopicSelectionModalProps> = ({
    level,
    topic,
    customTopic,
    language,
    isLoading,
    error,
    onTopicSelect,
    onCustomTopicChange,
    onLanguageChange,
    onGenerate,
    onClose
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-secondary border-2 border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="p-6 border-b-2 border-border flex items-center justify-between sticky top-0 bg-secondary z-10">
                    <h2 className="text-2xl font-bold text-primary-text">
                        Select Topic for {level} Contest
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-primary rounded-lg transition-all"
                    >
                        <svg className="w-6 h-6 text-secondary-text hover:text-primary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                        {DSA_TOPICS.map((t) => (
                            <button
                                key={t}
                                onClick={() => onTopicSelect(t)}
                                className={`p-4 rounded-lg border-2 transition-all duration-300 font-medium ${topic === t
                                        ? 'bg-accent text-primary border-accent shadow-lg'
                                        : 'bg-primary text-primary-text border-border hover:border-accent'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-secondary-text mb-2">
                            Or enter a custom topic:
                        </label>
                        <input
                            type="text"
                            value={customTopic}
                            onChange={(e) => onCustomTopicChange(e.target.value)}
                            placeholder="e.g., Binary Search Trees"
                            className="w-full bg-primary border-2 border-border rounded-lg px-4 py-3 text-primary-text focus:outline-none focus:border-accent transition-all"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-secondary-text mb-2">
                            Programming Language:
                        </label>
                        <select
                            value={language}
                            onChange={(e) => onLanguageChange(e.target.value)}
                            className="w-full bg-primary border-2 border-border rounded-lg px-4 py-3 text-primary-text focus:outline-none focus:border-accent transition-all"
                        >
                            <option value="python">Python</option>
                            <option value="javascript">JavaScript</option>
                            <option value="cpp">C++</option>
                            <option value="java">Java</option>
                        </select>
                    </div>

                    <button
                        onClick={onGenerate}
                        disabled={isLoading || !topic.trim()}
                        className="w-full px-6 py-4 bg-accent text-primary rounded-lg font-semibold hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <SparklesIcon className="w-5 h-5" />
                        {isLoading ? 'Generating...' : 'Generate Problem'}
                    </button>

                    {error && (
                        <div className="mt-4 p-4 bg-red-500 bg-opacity-10 border-2 border-red-500 rounded-lg">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
