
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './Icons';
import { useAuth } from '../context/AuthContext';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onAuthRequired: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, onAuthRequired }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      if (!user) {
        // User is not authenticated, show auth modal
        onAuthRequired();
        return;
      }
      onSendMessage(text);
      setText('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2 bg-surface p-2 rounded-2xl border border-secondary focus-within:border-primary transition-colors duration-300">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        rows={1}
        className="flex-1 bg-transparent text-primary-content placeholder-muted resize-none focus:outline-none max-h-48 p-2"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-primary hover:bg-primary-focus disabled:bg-secondary disabled:cursor-not-allowed transition-all duration-200"
      >
        <SendIcon className="w-5 h-5 text-primary-content" />
      </button>
    </form>
  );
};
