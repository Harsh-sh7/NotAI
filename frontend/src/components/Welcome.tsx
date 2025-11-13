import React from 'react';
import { GeminiIcon, CodeIcon } from './Icons';

interface WelcomeProps {
  onLogin: () => void;
  onSignup: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onLogin, onSignup }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <GeminiIcon className="w-16 h-16 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NotAI
            </h1>
          </div>
          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
            Your intelligent coding companion powered by Google Gemini AI. 
            Chat with AI, execute code, and boost your productivity all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-surface/50 backdrop-blur-sm rounded-xl p-6 border border-secondary/20">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 mx-auto">
              <GeminiIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-primary-content mb-3">AI-Powered Chat</h3>
            <p className="text-muted">
              Engage in intelligent conversations with Google Gemini AI. Get help with coding, 
              problem-solving, and creative tasks.
            </p>
          </div>

          <div className="bg-surface/50 backdrop-blur-sm rounded-xl p-6 border border-secondary/20">
            <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-4 mx-auto">
              <CodeIcon className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-primary-content mb-3">Live Code Execution</h3>
            <p className="text-muted">
              Write, test, and execute code in multiple programming languages with real-time results 
              powered by Judge0 API.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onLogin}
              className="px-8 py-3 bg-primary text-primary-content rounded-lg font-medium hover:bg-primary/90 transition-colors min-w-[140px]"
            >
              Sign In
            </button>
            <button
              onClick={onSignup}
              className="px-8 py-3 border border-secondary text-secondary-content rounded-lg font-medium hover:bg-surface transition-colors min-w-[140px]"
            >
              Create Account
            </button>
          </div>
          <p className="text-sm text-muted">
            Get started in seconds with Google OAuth or create a new account
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-secondary/20">
          <p className="text-sm text-muted">
            Built with React, TypeScript, and powered by Google Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
};
