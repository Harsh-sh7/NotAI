import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { geminiService } from '../services/geminiService';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Chat {
  _id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: Date;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  createNewChat: () => Promise<void>;
  loadChat: (chatId: string) => Promise<void>;
  saveMessage: (role: 'user' | 'assistant', content: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  refreshChats: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  const generateChatTitle = async (messages: ChatMessage[]): Promise<string> => {
    try {
      // Only generate title if we have at least 2 messages (user + assistant)
      if (messages.length < 2) return 'New Chat';
      
      // Get the first few messages to understand the conversation context
      const contextMessages = messages.slice(0, 4).map(msg => 
        `${msg.role}: ${msg.content}`
      ).join('\n');
      
      const prompt = `Based on this conversation, generate a short, descriptive title (max 4-5 words) that captures the main topic or question being discussed:

${contextMessages}

Title:`;

      const response = await geminiService.sendMessage(prompt);
      
      // Clean up the response and limit length
      let title = response.trim().replace(/^(Title:|Chat:|Conversation:)/i, '').trim();
      title = title.replace(/['"]/g, ''); // Remove quotes
      
      // Limit to reasonable length
      if (title.length > 50) {
        title = title.substring(0, 47) + '...';
      }
      
      return title || 'New Chat';
    } catch (error) {
      console.error('Error generating chat title:', error);
      return 'New Chat';
    }
  };

  // Fetch all chats when the component mounts
  useEffect(() => {
    if (token) {
      refreshChats();
    }
  }, [token]);

  const refreshChats = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/chats`, {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const chatsData = await response.json();
        setChats(chatsData);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/api/chats`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: 'New Chat' }),
      });

      if (response.ok) {
        const newChat = await response.json();
        setChats(prev => [newChat, ...prev]);
        setCurrentChat(newChat);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const loadChat = async (chatId: string) => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/api/chats/${chatId}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const chat = await response.json();
        setCurrentChat(chat);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    if (!currentChat || !token) return;

    try {
      const response = await fetch(`${API_URL}/api/chats/${currentChat._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role, content }),
      });

      if (response.ok) {
        const updatedChat = await response.json();
        setCurrentChat(updatedChat);
        
        // Update the chat in the chats list
        setChats(prev => 
          prev.map(chat => 
            chat._id === updatedChat._id ? updatedChat : chat
          )
        );

        // Auto-generate title after first assistant response if title is still "New Chat"
        if (role === 'assistant' && 
            updatedChat.title === 'New Chat' && 
            updatedChat.messages.length >= 2) {
          
          // Add a small delay to avoid interfering with the main chat
          setTimeout(async () => {
            try {
              const newTitle = await generateChatTitle(updatedChat.messages);
              
              if (newTitle !== 'New Chat') {
                await updateChatTitle(updatedChat._id, newTitle);
              }
            } catch (error) {
              console.error('Error in delayed title generation:', error);
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const deleteChat = async (chatId: string) => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/api/chats/${chatId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setChats(prev => prev.filter(chat => chat._id !== chatId));
        
        // If the deleted chat was the current chat, clear it
        if (currentChat?._id === chatId) {
          setCurrentChat(null);
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const updateChatTitle = async (chatId: string, title: string) => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/api/chats/${chatId}/title`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        const updatedChat = await response.json();
        
        setChats(prev => 
          prev.map(chat => 
            chat._id === chatId ? { ...chat, title } : chat
          )
        );
        
        if (currentChat?._id === chatId) {
          setCurrentChat(prev => prev ? { ...prev, title } : null);
        }
      }
    } catch (error) {
      console.error('Error updating chat title:', error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        loading,
        createNewChat,
        loadChat,
        saveMessage,
        deleteChat,
        updateChatTitle,
        refreshChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
