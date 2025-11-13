import React, { createContext, useContext, useState } from 'react';

interface NotificationType {
  id: number;
  content: string;
}

interface CodingContextType {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  selection: string | null;
  setSelection: (selection: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isExecuting: boolean;
  setIsExecuting: (executing: boolean) => void;
  notifications: NotificationType[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationType[]>>;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  question: string;
  setQuestion: (question: string) => void;
  output: string[];
  setOutput: React.Dispatch<React.SetStateAction<string[]>>;
  error: string | null;
  setError: (error: string | null) => void;
}

const CodingContext = createContext<CodingContextType | undefined>(undefined);

const DEFAULT_CODE: Record<string, string> = {
  javascript: `function greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\n\ngreet("World");`,
  python: `# Note: External packages like numpy, pandas are not available\n\ndef greet(name):\n    print(f"Hello, {name}!")\n    return f"Greeting sent to {name}"\n\nresult = greet("World")\nprint(result)`,
  cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!";\n    return 0;\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`
};

export const CodingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [code, setCode] = useState<string>(() => {
    const saved = localStorage.getItem('coding_code');
    return saved || DEFAULT_CODE.javascript;
  });
  const [language, setLanguage] = useState<string>(() => {
    const saved = localStorage.getItem('coding_language');
    return saved || 'javascript';
  });
  const [selection, setSelection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>('');
  const [output, setOutput] = useState<string[]>(() => {
    const saved = localStorage.getItem('coding_output');
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState<string | null>(() => {
    const saved = localStorage.getItem('coding_error');
    return saved || null;
  });

  // Save to localStorage when state changes
  React.useEffect(() => {
    localStorage.setItem('coding_code', code);
  }, [code]);

  React.useEffect(() => {
    localStorage.setItem('coding_language', language);
  }, [language]);

  React.useEffect(() => {
    localStorage.setItem('coding_output', JSON.stringify(output));
  }, [output]);

  React.useEffect(() => {
    if (error) {
      localStorage.setItem('coding_error', error);
    } else {
      localStorage.removeItem('coding_error');
    }
  }, [error]);

  return (
    <CodingContext.Provider
      value={{
        code,
        setCode,
        language,
        setLanguage,
        selection,
        setSelection,
        isLoading,
        setIsLoading,
        isExecuting,
        setIsExecuting,
        notifications,
        setNotifications,
        isModalOpen,
        setIsModalOpen,
        question,
        setQuestion,
        output,
        setOutput,
        error,
        setError,
      }}
    >
      {children}
    </CodingContext.Provider>
  );
};

export const useCoding = () => {
  const context = useContext(CodingContext);
  if (!context) {
    throw new Error('useCoding must be used within a CodingProvider');
  }
  return context;
};
