import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { CodingProvider } from './context/CodingContext';
import { ChatView } from './components/ChatView';
import { CodingAssistant } from './components/CodingAssistant';
import { AuthCallback } from './components/AuthCallback';
import { AuthModal } from './components/AuthModal';
import { UserAvatar } from './components/UserAvatar';
import { GeminiIcon, CodeIcon } from './components/Icons';

type View = 'chat' | 'code';
type AuthView = 'login' | 'signup';

const MainApp: React.FC = () => {
  const [view, setView] = useState<View>('chat');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const navButtonClasses = (buttonView: View) => 
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      view === buttonView
        ? 'bg-primary text-primary-content'
        : 'text-muted hover:bg-surface'
    }`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-primary-content font-sans">
      {/* Desktop header - hidden on mobile */}
      <header className="hidden md:flex p-4 border-b border-secondary items-center justify-between">
        <div className="flex items-center">
          <GeminiIcon className="w-8 h-8 mr-2 text-primary" />
          <h1 className="text-xl font-semibold">NotAI</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 p-1 bg-secondary rounded-lg">
            <button onClick={() => setView('chat')} className={navButtonClasses('chat')}>
              Chat
            </button>
            <button onClick={() => setView('code')} className={navButtonClasses('code')}>
              Coding Assistant
            </button>
          </div>
          {user ? (
            <UserAvatar />
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-focus transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-primary text-primary-content rounded-lg text-sm font-medium hover:bg-primary-focus transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile header for view switching */}
      <div className="md:hidden flex items-center justify-center p-2 border-b border-secondary bg-secondary">
        <div className="flex items-center space-x-1 p-1 bg-background rounded-lg">
          <button 
            onClick={() => setView('chat')} 
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              view === 'chat'
                ? 'bg-primary text-primary-content'
                : 'text-muted hover:bg-surface'
            }`}
          >
            Chat
          </button>
          <button 
            onClick={() => setView('code')} 
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              view === 'code'
                ? 'bg-primary text-primary-content'
                : 'text-muted hover:bg-surface'
            }`}
          >
            Code
          </button>
        </div>
        {user ? (
          <div className="absolute right-4">
            <UserAvatar />
          </div>
        ) : (
          <div className="absolute right-4 flex items-center gap-1">
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-2 py-1 text-xs font-medium text-primary hover:text-primary-focus transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-2 py-1 bg-primary text-primary-content rounded text-xs font-medium hover:bg-primary-focus transition-colors"
            >
              Sign Up
            </button>
          </div>
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

  console.log('AuthWrapper: Current pathname:', currentPath);
  console.log('AuthWrapper: User state:', user);
  console.log('AuthWrapper: Loading state:', isLoading);
  console.log('AuthWrapper: Full URL:', window.location.href);

  // OAuth callback route
  if (currentPath === '/auth/callback') {
    console.log('AuthWrapper: Detected /auth/callback route, rendering AuthCallback component');
    return <AuthCallback />;
  }

  // If we're on /profile, redirect to home since we always show main app now
  if (currentPath === '/profile') {
    console.log('AuthWrapper: Redirecting from /profile to home');
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
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
};

export default App;
