import React from 'react';
import { type Message } from '../types';
import { CodeBlock } from './CodeBlock';
import { UserIcon } from './Icons';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, content } = message;
  const isUser = role === 'user';
  const { theme } = useTheme();

  // Don't render empty model messages (they're handled by loading animation)
  if (!isUser && !content.trim()) {
    return null;
  }

  const containerClasses = `flex items-start space-x-4 animate-fade-in animate-slide-up ${
    isUser ? 'justify-end' : ''
  }`;

  const bubbleClasses = `max-w-xl lg:max-w-2xl xl:max-w-3xl rounded-2xl p-4 ${
    isUser ? 'bg-primary text-primary-content' : 'bg-surface'
  }`;

  const iconContainerClasses = `w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${
    isUser ? 'bg-secondary' : 'bg-accent'
  }`;

  return (
    <div className={containerClasses}>
      {!isUser && (
        <div className={iconContainerClasses}>
          <Logo className="w-5 h-5 text-primary" />
        </div>
      )}
      <div className={bubbleClasses}>
        <div className={`prose ${theme === 'dark' ? 'prose-invert' : ''} prose-sm md:prose-base max-w-none space-y-4`}>
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const codeString = String(children).replace(/\n$/, '');
                const isInline = !match;
                return !isInline ? (
                  <CodeBlock code={codeString} language={match[1]} />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {content}
          </Markdown>
        </div>
      </div>
      {isUser && (
        <div className={iconContainerClasses}>
          <UserIcon className="text-secondary-content" />
        </div>
      )}
    </div>
  );
};
