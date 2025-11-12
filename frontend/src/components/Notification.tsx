import React from 'react';
import { CloseIcon, GeminiIcon } from './Icons';
import { CodeBlock } from './CodeBlock';

interface NotificationProps {
  id: number;
  content: string;
  onClose: (id: number) => void;
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

export const Notification: React.FC<NotificationProps> = ({ id, content, onClose }) => {
    const contentParts = parseContent(content);

    return (
    <div className="bg-surface border border-secondary rounded-lg shadow-2xl p-4 animate-fade-in animate-slide-up">
      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 flex-shrink-0 rounded-full bg-primary flex items-center justify-center mt-1">
            <GeminiIcon className="w-4 h-4 text-primary-content" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="font-semibold text-primary-content">NotAI Assistant Response</h3>
          <div className="prose prose-invert prose-sm max-w-none mt-2 space-y-2 max-h-[40vh] overflow-y-auto pr-2">
             {contentParts.map((part, index) => {
                if (typeof part === 'string') {
                    return <div key={index} dangerouslySetInnerHTML={{ __html: renderMarkdown(part) }} />;
                }
                return <CodeBlock key={index} code={part.code} language={part.lang} />;
            })}
          </div>
        </div>
        <button onClick={() => onClose(id)} className="text-muted hover:text-primary-content">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
