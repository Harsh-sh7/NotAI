import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isGoogleAuth?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setTokenFromCallback: (token: string, redirectPath?: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  // Check for existing token on mount
  useEffect(() => {
    console.log('AuthContext: Checking for stored token on mount');
    const storedToken = localStorage.getItem('token');
    console.log('AuthContext: Stored token found:', storedToken ? 'Yes' : 'No');
    
    if (storedToken) {
      console.log('AuthContext: Fetching user with stored token');
      fetchUser(storedToken);
    } else {
      console.log('AuthContext: No stored token, setting loading to false');
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      console.log('AuthContext: Fetching user with token:', authToken.substring(0, 20) + '...');
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      console.log('AuthContext: Fetch user response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('AuthContext: User data received:', data.user);
        setUser(data.user);
        setToken(authToken);
        console.log('AuthContext: User state set successfully');
      } else {
        console.error('AuthContext: Failed to fetch user, status:', response.status);
        const errorData = await response.json();
        console.error('AuthContext: Error data:', errorData);
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        throw new Error('Failed to fetch user');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    
    console.log('Login successful, user set:', data.user);
    console.log('Token stored in localStorage:', data.token);
    
    // Don't redirect immediately - let React routing handle it
    // The AuthWrapper will detect the user state change and redirect
  };

  const signup = async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    
    console.log('Signup successful, user set:', data.user);
    console.log('Token stored in localStorage:', data.token);
    
    // Don't redirect immediately - let React routing handle it
    // The AuthWrapper will detect the user state change and redirect
  };

  const setTokenFromCallback = async (authToken: string, redirectPath: string = '/') => {
    try {
      console.log('AuthContext: Setting token from callback:', authToken.substring(0, 20) + '...');
      console.log('AuthContext: Redirect path:', redirectPath);
      setIsLoading(true);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      console.log('AuthContext: Token stored in localStorage, fetching user...');
      
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      console.log('AuthContext: Fetch user response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('AuthContext: User data received:', data.user);
        setUser(data.user);
        console.log('AuthContext: User state set, redirecting...');
        
        // For OAuth, redirect to the specified path (now always home page)
        console.log('AuthContext: OAuth success, user authenticated');
        console.log('AuthContext: User set successfully, redirecting to:', redirectPath);
        
        // Use history API instead of window.location.href to avoid full reload
        setTimeout(() => {
          window.history.pushState({}, '', redirectPath);
          // Force a re-render by dispatching a popstate event
          window.dispatchEvent(new PopStateEvent('popstate'));
        }, 500); // Increased delay to ensure user state is fully set
      } else {
        console.error('AuthContext: Failed to fetch user, status:', response.status);
        const errorData = await response.json();
        console.error('AuthContext: Error data:', errorData);
        localStorage.removeItem('token');
        window.history.pushState({}, '', '/');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error setting token from callback:', error);
      localStorage.removeItem('token');
      window.history.pushState({}, '', '/');
      window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, setTokenFromCallback, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
