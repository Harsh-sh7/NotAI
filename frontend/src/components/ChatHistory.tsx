import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ isOpen, onClose }) => {
  const { chats, currentChat, loading, createNewChat, loadChat, deleteChat, updateChatTitle } = useChat();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default 64 * 4 = 256px
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    const minWidth = 200;
    const maxWidth = 500;
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add event listeners for resize
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Handle keyboard events for delete modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (deleteModalOpen && e.key === 'Escape') {
        cancelDeleteChat();
      }
    };

    if (deleteModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [deleteModalOpen]);

  const handleNewChat = async () => {
    try {
      const newChat = await createNewChat();
      if (newChat) {
        // Close sidebar on mobile after creating new chat
        if (window.innerWidth < 768) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const handleChatSelect = (chatId: string) => {
    loadChat(chatId);
    // Close sidebar on mobile after selecting chat
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setChatToDelete(chatId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteChat = async () => {
    if (chatToDelete) {
      try {
        await deleteChat(chatToDelete);
        setDeleteModalOpen(false);
        setChatToDelete(null);
      } catch (error) {
        console.error('Error deleting chat:', error);
      }
    }
  };

  const cancelDeleteChat = () => {
    setDeleteModalOpen(false);
    setChatToDelete(null);
  };

  const startEditing = (e: React.MouseEvent, chatId: string, currentTitle: string) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setNewTitle(currentTitle);
  };

  const handleTitleUpdate = async (chatId: string) => {
    if (newTitle.trim()) {
      try {
        await updateChatTitle(chatId, newTitle.trim());
        setEditingChatId(null);
      } catch (error) {
        console.error('Error updating chat title:', error);
      }
    }
  };

  const cancelEditing = () => {
    setEditingChatId(null);
    setNewTitle('');
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const chatDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - chatDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return chatDate.toLocaleDateString();
  };

  if (loading && chats.length === 0) {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
        
        <div className={`
          fixed md:relative top-0 left-0 h-full w-64 bg-surface border-r border-secondary z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex items-center justify-center p-4
        `}>
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div 
        ref={sidebarRef}
        className={`
          fixed md:relative top-0 left-0 h-full bg-surface border-r border-secondary z-50
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ 
          width: window.innerWidth >= 768 ? `${sidebarWidth}px` : '256px' 
        }}
      >
        {/* Mobile close button */}
        <div className="flex justify-between items-center p-4 md:hidden border-b border-secondary">
          <h2 className="text-lg font-semibold text-primary-content">Chat History</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-primary-content rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-primary text-primary-content hover:bg-opacity-90 transition-colors"
          >
            <span className="text-lg">+</span>
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`group flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                currentChat?._id === chat._id 
                  ? 'bg-primary bg-opacity-20' 
                  : 'hover:bg-secondary'
              }`}
              onClick={() => handleChatSelect(chat._id)}
            >
              {editingChatId === chat._id ? (
                <div className="flex items-center flex-1">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="flex-1 bg-transparent border-b border-muted focus:outline-none focus:border-primary text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleUpdate(chat._id);
                      else if (e.key === 'Escape') cancelEditing();
                    }}
                    onBlur={() => handleTitleUpdate(chat._id)}
                  />
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate text-primary-content">
                      {chat.title}
                    </div>
                    <div className="text-xs text-muted">
                      {formatDate(chat.lastUpdated)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => startEditing(e, chat._id, chat.title)}
                      className="p-1 text-muted hover:text-primary rounded"
                      title="Rename chat"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      className="p-1 text-muted hover:text-red-500 rounded"
                      title="Delete chat"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* Resize handle - only on desktop */}
        <div 
          className="hidden md:block absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors"
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4"
          onClick={cancelDeleteChat}
        >
          <div 
            className="bg-background rounded-lg shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-content">Delete Chat</h3>
                  <p className="text-sm text-muted">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-muted mb-6">
                Are you sure you want to delete this chat? All messages in this conversation will be permanently removed.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDeleteChat}
                  className="px-4 py-2 text-sm font-medium text-muted hover:text-primary-content bg-secondary hover:bg-surface rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteChat}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Delete Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
