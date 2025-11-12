import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ChatView } from './components/ChatView';
import { CodingAssistant } from './components/CodingAssistant';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { GeminiIcon, CodeIcon } from './components/Icons';

type View = 'chat' | 'code';
type AuthView = 'login' | 'signup';

const MainApp: React.FC = () => {
  const [view, setView] = useState<View>('chat');
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
          {user && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted hidden lg:block">
                Welcome, <span className="text-primary font-semibold">{user.username}</span>
              </span>
              <button
                onClick={logout}
                className="px-3 py-2 bg-secondary hover:bg-opacity-80 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
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
        {user && (
          <button
            onClick={logout}
            className="absolute right-4 px-3 py-1 bg-secondary hover:bg-opacity-80 rounded-lg text-xs font-medium transition-colors"
          >
            Logout
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden">
        {view === 'chat' ? <ChatView /> : <CodingAssistant />}
      </div>
    </div>
  );
};

const AuthWrapper: React.FC = () => {
  const [authView, setAuthView] = useState<AuthView>('login');
  const { user } = useAuth();

  if (user) {
    return (
      <ChatProvider>
        <MainApp />
      </ChatProvider>
    );
  }

  return authView === 'login' ? (
    <Login onSwitchToSignup={() => setAuthView('signup')} />
  ) : (
    <Signup onSwitchToLogin={() => setAuthView('login')} />
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
