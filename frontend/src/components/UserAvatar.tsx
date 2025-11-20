import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const UserAvatar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Logout clicked');
    setShowDropdown(false);
    logout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Calculate dropdown position
  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, right: 0 };
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    };
  };

  const position = showDropdown ? getDropdownPosition() : { top: 0, right: 0 };

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setShowDropdown(!showDropdown)}
          className={`w-10 h-10 rounded-full font-semibold text-sm hover:opacity-80 transition-all duration-300 flex items-center justify-center overflow-hidden border-2 ${theme === 'dark'
              ? 'bg-white text-black border-white'
              : 'bg-black text-white border-black'
            }`}
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
      </div>

      {/* Render dropdown using Portal */}
      {showDropdown && createPortal(
        <div
          ref={dropdownRef}
          className="fixed bg-secondary border-2 border-border rounded-lg shadow-2xl animate-slide-down"
          style={{
            top: `${position.top}px`,
            right: `${position.right}px`,
            zIndex: 99999,
            minWidth: '192px',
          }}
        >
          <div className="p-3 border-b-2 border-border">
            <p className="font-semibold text-primary-text">{user.username}</p>
            <p className="text-sm text-secondary-text break-all">{user.email}</p>
            {user.isGoogleAuth && (
              <span className={`inline-block mt-1 px-2 py-1 text-xs rounded border ${theme === 'dark'
                  ? 'bg-white bg-opacity-10 text-white border-white'
                  : 'bg-black bg-opacity-10 text-black border-black'
                }`}>
                Google Account
              </span>
            )}
          </div>

          <div className="p-1">
            <button
              onClick={handleLogout}
              className={`w-full text-left px-3 py-2 text-sm rounded transition-all duration-300 font-medium ${theme === 'dark'
                  ? 'text-gray-300 hover:bg-white hover:text-black'
                  : 'text-gray-700 hover:bg-black hover:text-white'
                }`}
            >
              Sign Out
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
