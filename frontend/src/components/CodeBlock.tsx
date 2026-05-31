import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from './Icons';
import { useTheme } from '../context/ThemeContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
    });
  };

  const isDark = theme === 'dark';

  return (
    <div className={`rounded-lg my-4 overflow-hidden border ${isDark ? 'border-[#2d2d2d] bg-[#1e1e1e]' : 'border-[#e2e8f0] bg-[#ffffff]'}`}>
      <div className={`flex justify-between items-center px-4 py-2 text-xs font-mono uppercase ${isDark ? 'bg-[#252526] text-[#a1a1aa]' : 'bg-[#f8fafc] text-[#64748b]'}`}>
        <span>{language}</span>
        <button onClick={handleCopy} className="flex items-center space-x-1 hover:opacity-80 transition-opacity">
          {isCopied ? (
            <>
              <CheckIcon className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="text-sm font-mono leading-relaxed">
        <SyntaxHighlighter
          language={language.toLowerCase()}
          style={isDark ? oneDark : oneLight}
          showLineNumbers={true}
          codeTagProps={{
            style: {
              background: 'transparent',
              fontFamily: 'inherit',
            }
          }}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          lineNumberStyle={{
            minWidth: '2.25em',
            paddingRight: '1em',
            textAlign: 'right',
            color: isDark ? '#4b5563' : '#94a3b8',
            userSelect: 'none',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
