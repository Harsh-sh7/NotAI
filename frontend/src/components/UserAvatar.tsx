import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const UserAvatar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-10 h-10 rounded-full bg-primary text-primary-content font-medium text-sm hover:bg-primary-focus transition-colors flex items-center justify-center overflow-hidden"
      >
        {user.isGoogleAuth === true && user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.username}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Failed to load avatar image:', user.avatar);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span>{getInitials(user.username)}</span>
        )}
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-surface border border-secondary rounded-lg shadow-lg z-20">
            <div className="p-3 border-b border-secondary">
              <p className="font-medium text-primary-content">{user.username}</p>
              <p className="text-sm text-muted">{user.email}</p>
              {user.isGoogleAuth && (
                <span className="inline-block mt-1 px-2 py-1 bg-primary bg-opacity-20 text-primary text-xs rounded">
                  Google Account
                </span>
              )}
            </div>
            
            <div className="p-1">
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-muted hover:bg-secondary hover:text-primary-content rounded transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
