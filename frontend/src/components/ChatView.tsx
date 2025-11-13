import React, { useState, useRef, useEffect, useCallback } from 'react';
import { type Message } from '../types';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { GeminiIcon } from './Icons';
import { geminiService } from '../services/geminiService';
import { useChat } from '../context/ChatContext';
import { ChatHistory } from './ChatHistory';

interface ChatViewProps {
  onAuthRequired: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ onAuthRequired }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello! I'm NotAI. How can I assist you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { currentChat, saveMessage, createNewChat } = useChat();

  // Sync messages with current chat (only when not loading and not actively sending a message)
  useEffect(() => {
    if (!isLoading && !isSendingMessage) {
      if (currentChat && currentChat.messages.length > 0) {
        // Convert chat messages to the format expected by the UI
        const chatMessages: Message[] = currentChat.messages.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          content: msg.content,
        }));
        setMessages(chatMessages);
      } else {
        // Default welcome message when no chat is selected OR when it's a new empty chat
        setMessages([
          {
            role: 'model',
            content: "Hello! I'm NotAI. How can I assist you today?",
          },
        ]);
      }
    }
  }, [currentChat, isLoading, isSendingMessage]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    
    // Set sending flag to prevent message sync conflicts
    setIsSendingMessage(true);
    
    // Always add user message to UI immediately
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // If no current chat, create a new one first and wait for it
      if (!currentChat) {
        await createNewChat();
        // Wait a bit for the currentChat state to update
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Save user message to chat history
      await saveMessage('user', text);

      // Add empty model message for streaming effect
      setMessages((prev) => [...prev, { role: 'model', content: '' }]);
      
      // Send message and get response
      const response = await geminiService.sendMessage(text);
      
      // Update the last message with the full response
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'model', content: response },
      ]);

      // Save assistant response to chat history
      await saveMessage('assistant', response);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = 'Sorry, I encountered an error. Please try again.';
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove the loading message
        { role: 'model', content: errorMessage },
      ]);
      
      // Save error message to chat history
      try {
        await saveMessage('assistant', errorMessage);
      } catch (saveError) {
        console.error('Error saving error message:', saveError);
      }
    } finally {
      setIsLoading(false);
      setIsSendingMessage(false);
    }
  }, [isLoading, currentChat, saveMessage, createNewChat]);

  return (
    <div className="flex h-full relative">
      <ChatHistory 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header with hamburger menu */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-secondary bg-background">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-muted hover:text-primary-content rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-primary-content">NotAI</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && messages.length > 0 && (
            messages[messages.length - 1].role === 'user' || 
            (messages[messages.length - 1].role === 'model' && messages[messages.length - 1].content === '')
          ) && (
             <div className="flex items-start space-x-4 animate-fade-in animate-slide-up">
              <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary flex items-center justify-center">
                <GeminiIcon className="w-5 h-5 text-primary-content" />
              </div>
              <div className="flex items-center space-x-1 pt-2">
                <div className="w-2 h-2 bg-muted rounded-full animate-pulse-fast [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-muted rounded-full animate-pulse-fast [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-muted rounded-full animate-pulse-fast"></div>
              </div>
            </div>
          )}
        </main>
        
        <footer className="p-3 md:p-6 bg-background border-t border-secondary">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} onAuthRequired={onAuthRequired} />
            <p className="text-center text-xs text-muted mt-2">
              Gemini may display inaccurate info. Always fact-check important information.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
