import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ isOpen, onClose }) => {
  const { chats, currentChat, loading, createNewChat, loadChat, deleteChat, updateChatTitle } = useChat();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const handleNewChat = async () => {
    try {
      await createNewChat();
      // Close sidebar on mobile after creating new chat
      if (window.innerWidth < 768) {
        onClose();
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

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await deleteChat(chatId);
      } catch (error) {
        console.error('Error deleting chat:', error);
      }
    }
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
      
      <div className={`
        fixed md:relative top-0 left-0 h-full w-64 bg-surface border-r border-secondary z-50
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
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
      </div>
    </>
  );
};
