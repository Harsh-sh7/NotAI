import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { CodingProvider } from './context/CodingContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ChatView } from './components/ChatView';
import { CodingAssistant } from './components/CodingAssistant';
import { AuthCallback } from './components/AuthCallback';
import { AuthModal } from './components/AuthModal';
import { UserAvatar } from './components/UserAvatar';
import { LandingPage } from './components/LandingPage';
import { Logo } from './components/Logo';
import { CodeIcon } from './components/Icons';

type View = 'chat' | 'code';
type AuthView = 'login' | 'signup';

const MainApp: React.FC = () => {
  const [view, setView] = useState<View>('chat');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const { user, logout, isLoading } = useAuth();

  // Check if user has visited before
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedNotAI');
    if (hasVisited) {
      setShowLanding(false);
    }
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem('hasVisitedNotAI', 'true');
    setShowLanding(false);
  };

  // Show landing page if first visit
  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  const { theme, toggleTheme } = useTheme();

  const navButtonClasses = (buttonView: View) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === buttonView
      ? 'bg-accent text-primary'
      : 'text-secondary-text hover:bg-secondary'
    }`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-primary text-primary-text font-sans transition-colors duration-300">
      {/* Desktop header - hidden on mobile */}
      <header className="hidden md:flex p-4 border-b-2 border-border items-center justify-between bg-secondary animate-slide-down">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowLanding(true)}
            className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300"
          >
            <Logo className="w-9 h-9 text-accent group-hover:rotate-12 transition-transform duration-300" />
            <h1 className="text-2xl font-bold text-accent">
              NotAI
            </h1>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 p-1.5 bg-primary border-2 border-border rounded-xl">
            <button
              onClick={() => setView('chat')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${view === 'chat'
                ? 'bg-accent text-primary shadow-lg'
                : 'text-secondary-text hover:text-primary-text hover:bg-secondary'
                }`}
            >
              Chat
            </button>
            <button
              onClick={() => setView('code')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${view === 'code'
                ? 'bg-accent text-primary shadow-lg'
                : 'text-secondary-text hover:text-primary-text hover:bg-secondary'
                }`}
            >
              Coding Assistant
            </button>
          </div>

          {/* Theme Toggle in Nav Bar */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg bg-primary border-2 border-border hover:border-accent transition-all duration-300 group"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-accent group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-accent group-hover:-rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {user ? (
            <UserAvatar />
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 text-sm font-semibold text-accent hover:text-secondary-text transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-5 py-2.5 bg-accent text-primary rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile header for view switching */}
      <div className="md:hidden flex items-center justify-between p-3 border-b-2 border-border bg-secondary animate-slide-down">
        <button
          onClick={() => setShowLanding(true)}
          className="flex items-center gap-2 group"
        >
          <Logo className="w-7 h-7 text-accent" />
          <h1 className="text-lg font-bold text-accent">
            NotAI
          </h1>
        </button>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 p-1 bg-primary border-2 border-border rounded-lg">
            <button
              onClick={() => setView('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-1 ${view === 'chat'
                ? 'bg-accent text-primary shadow-lg'
                : 'text-secondary-text hover:text-primary-text'
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button
              onClick={() => setView('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-1 ${view === 'code'
                ? 'bg-accent text-primary shadow-lg'
                : 'text-secondary-text hover:text-primary-text'
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
          </div>

          {/* Theme Toggle for Mobile */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-primary border-2 border-border hover:border-accent transition-all duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {user ? (
          <div className="ml-2">
            <UserAvatar />
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="ml-2 px-3 py-1.5 bg-accent text-primary rounded-lg text-sm font-semibold hover:opacity-80 transition-all duration-300"
          >
            Sign In
          </button>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        {view === 'chat' ? <ChatView onAuthRequired={() => setShowAuthModal(true)} /> : <CodingAssistant onAuthRequired={() => setShowAuthModal(true)} />}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

const AuthWrapper: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Listen for route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // OAuth callback route
  if (currentPath === '/auth/callback') {
    return <AuthCallback />;
  }

  // If we're on /profile, redirect to home since we always show main app now
  if (currentPath === '/profile') {
    window.history.pushState({}, '', '/');
  }

  // Always show the main app - authentication is handled via popup
  return (
    <ChatProvider>
      <CodingProvider>
        <MainApp />
      </CodingProvider>
    </ChatProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthWrapper />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
