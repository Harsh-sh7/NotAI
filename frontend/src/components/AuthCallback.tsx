import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthCallback: React.FC = () => {
  const { setTokenFromCallback } = useAuth();

  useEffect(() => {
    console.log('AuthCallback: Component mounted');
    console.log('AuthCallback: Current URL:', window.location.href);
    
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const redirectPath = urlParams.get('redirect') || '/';
    
    console.log('AuthCallback: Token found:', token ? 'Yes' : 'No');
    console.log('AuthCallback: Redirect path:', redirectPath);
    console.log('AuthCallback: All URL params:', Array.from(urlParams.entries()));
    
    if (token) {
      console.log('AuthCallback: Calling setTokenFromCallback...');
      setTokenFromCallback(token, redirectPath);
    } else {
      // Handle error case - redirect to home page
      console.error('AuthCallback: No token received from OAuth callback');
      window.location.href = '/';
    }
  }, [setTokenFromCallback]);

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted">Completing authentication...</p>
      </div>
    </div>
  );
};
