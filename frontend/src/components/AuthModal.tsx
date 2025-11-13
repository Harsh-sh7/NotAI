import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleOAuthButton } from './GoogleOAuthButton';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(username, email, password);
      }
      onClose(); // Close modal on success
    } catch (err: any) {
      setError(err.message || `${mode === 'login' ? 'Login' : 'Signup'} failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setError('');
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl shadow-2xl p-6 md:p-8 border border-secondary w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-primary-content transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">
            {mode === 'login' ? 'Welcome Back!' : 'Join NotAI'}
          </h2>
          <p className="text-muted">
            {mode === 'login' 
              ? 'Sign in to continue your conversation' 
              : 'Create an account to get started'
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Google OAuth Button */}
        <GoogleOAuthButton 
          text={mode === 'login' ? 'Continue with Google' : 'Sign up with Google'} 
          className="mb-4" 
        />
        
        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-secondary"></div>
          <span className="px-3 text-muted text-sm">or</span>
          <div className="flex-1 border-t border-secondary"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-secondary-content mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary-content"
                placeholder="Enter your username"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-secondary-content mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary-content"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-content mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary-content"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-content py-3 rounded-lg font-medium hover:bg-primary-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="text-center mt-6">
          <p className="text-muted">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={switchMode}
              className="ml-2 text-primary hover:text-primary-focus font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
