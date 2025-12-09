import React from 'react';

interface LoadingOverlayProps {
    level: string;
    topic: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ level, topic }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-secondary border-2 border-border rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
                <div className="flex flex-col items-center gap-6">
                    {/* Animated Spinner */}
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-4 border-border rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-4 border-accent/50 border-b-transparent rounded-full animate-spin-slow"></div>
                    </div>

                    {/* Loading Text */}
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-primary-text mb-2">
                            Generating Your Problem
                        </h3>
                        <p className="text-secondary-text text-sm">
                            AI is crafting a {level} level problem on {topic}...
                        </p>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
