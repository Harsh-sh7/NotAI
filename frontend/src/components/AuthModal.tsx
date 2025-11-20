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
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md">
        {/* Transparent glass card - background visible through it */}
        <div className="relative bg-secondary/30 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/30 overflow-hidden">
          {/* Subtle gradient shine for glass effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>

          {/* Content wrapper with relative positioning */}
          <div className="relative z-10">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-0 right-0 text-primary-text hover:text-accent transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-6 mt-2">
              <h2 className="text-2xl font-bold text-primary-text mb-2">
                {mode === 'login' ? 'Welcome Back!' : 'Join NotAI'}
              </h2>
              <p className="text-primary-text">
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
              <div className="flex-1 border-t-2 border-white/20"></div>
              <span className="px-3 text-primary-text text-sm">or</span>
              <div className="flex-1 border-t-2 border-white/20"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-primary-text mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-primary-text placeholder-primary-text backdrop-blur-sm"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-primary-text placeholder-primary-text backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-primary-text placeholder-primary-text backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent text-primary py-3 rounded-lg font-semibold hover:opacity-80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            {/* Switch Mode */}
            <div className="text-center mt-6">
              <p className="text-primary-text">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={switchMode}
                  className="ml-2 text-accent hover:opacity-80 font-semibold transition-opacity duration-300"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
