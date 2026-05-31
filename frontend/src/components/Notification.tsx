import React from 'react';
import { CloseIcon, GeminiIcon } from './Icons';
import { CodeBlock } from './CodeBlock';
import { useTheme } from '../context/ThemeContext';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface NotificationProps {
  id: number;
  content: string;
  onClose: (id: number) => void;
}

export const Notification: React.FC<NotificationProps> = ({ id, content, onClose }) => {
    const { theme } = useTheme();
    return (
    <div className="bg-surface border border-secondary rounded-lg shadow-2xl p-4 animate-fade-in animate-slide-up">
      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 flex-shrink-0 rounded-full bg-primary flex items-center justify-center mt-1">
            <GeminiIcon className="w-4 h-4 text-primary-content" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="font-semibold text-primary-content">NotAI Assistant Response</h3>
          <div className={`prose ${theme === 'dark' ? 'prose-invert' : ''} prose-sm max-w-none mt-2 space-y-2 max-h-[40vh] overflow-y-auto pr-2`}>
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
        <button onClick={() => onClose(id)} className="text-muted hover:text-primary-content">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
