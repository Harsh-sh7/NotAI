import React from 'react';
import { type Message } from '../types';
import { CodeBlock } from './CodeBlock';
import { UserIcon } from './Icons';
import { Logo } from './Logo';

interface ChatMessageProps {
  message: Message;
}

const parseContent = (content: string): (string | { code: string; lang: string })[] => {
  if (!content) return [];
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map(part => {
    const match = part.match(/```(\w*)\n([\s\S]*?)```/);
    if (match) {
      return { code: match[2].trim(), lang: match[1] || 'text' };
    }
    return part;
  }).filter(part => (typeof part === 'string' && part.trim() !== '') || typeof part === 'object');
};

const renderMarkdown = (text: string) => {
  // Check if CDN scripts have loaded to prevent race condition errors
  if (typeof (window as any).marked?.parse === 'function' && typeof (window as any).DOMPurify?.sanitize === 'function') {
    const rawMarkup = (window as any).marked.parse(text, { breaks: true, gfm: true });
    return (window as any).DOMPurify.sanitize(rawMarkup);
  }
  // Fallback to plain text if scripts are not available
  return text;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, content } = message;
  const isUser = role === 'user';

  // Don't render empty model messages (they're handled by loading animation)
  if (!isUser && !content.trim()) {
    return null;
  }

  const contentParts = parseContent(content);

  const containerClasses = `flex items-start space-x-4 animate-fade-in animate-slide-up ${isUser ? 'justify-end' : ''
    }`;

  const bubbleClasses = `max-w-xl lg:max-w-2xl xl:max-w-3xl rounded-2xl p-4 ${isUser ? 'bg-primary text-primary-content' : 'bg-surface'
    }`;

  const iconContainerClasses = `w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${isUser ? 'bg-secondary' : 'bg-accent'
    }`;

  return (
    <div className={containerClasses}>
      {!isUser && (
        <div className={iconContainerClasses}>
          <Logo className="w-5 h-5 text-primary" />
        </div>
      )}
      <div className={bubbleClasses}>
        <div className="prose prose-invert prose-sm md:prose-base max-w-none space-y-4">
          {contentParts.map((part, index) => {
            if (typeof part === 'string') {
              return <div key={index} dangerouslySetInnerHTML={{ __html: renderMarkdown(part) }} />;
            }
            return <CodeBlock key={index} code={part.code} language={part.lang} />;
          })}
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
