import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [isCopied, setIsCopied] = useState(false);

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

  return (
    <div className="bg-[#18181b] rounded-lg my-4 overflow-hidden border border-[#27272a] text-[#f4f4f5]">
      <div className="flex justify-between items-center px-4 py-2 bg-[#27272a] text-xs text-[#a1a1aa]">
        <span className="font-mono uppercase">{language}</span>
        <button onClick={handleCopy} className="flex items-center space-x-1 text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors">
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
      <pre className="p-4 text-sm overflow-x-auto bg-[#18181b] text-[#f4f4f5] font-mono leading-relaxed">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};
