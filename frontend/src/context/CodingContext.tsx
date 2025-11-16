import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  clearAllData: () => void;
}

const CodingContext = createContext<CodingContextType | undefined>(undefined);

const DEFAULT_CODE: Record<string, string> = {
  javascript: `function greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\n\ngreet("World");`,
  python: `# Note: External packages like numpy, pandas are not available\n\ndef greet(name):\n    print(f"Hello, {name}!")\n    return f"Greeting sent to {name}"\n\nresult = greet("World")\nprint(result)`,
  cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!";\n    return 0;\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`
};

export const CodingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Helper function to get user-specific localStorage key
  const getUserKey = (key: string) => user ? `${key}_${user.id}` : key;
  
  // Initialize state from localStorage or defaults
  const [code, setCode] = useState<string>(DEFAULT_CODE.javascript);
  const [language, setLanguage] = useState<string>('javascript');
  const [selection, setSelection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>('');
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load user-specific data when user changes
  useEffect(() => {
    if (user) {
      const savedCode = localStorage.getItem(getUserKey('coding_code'));
      const savedLanguage = localStorage.getItem(getUserKey('coding_language'));
      const savedOutput = localStorage.getItem(getUserKey('coding_output'));
      const savedError = localStorage.getItem(getUserKey('coding_error'));
      
      setCode(savedCode || DEFAULT_CODE.javascript);
      setLanguage(savedLanguage || 'javascript');
      setOutput(savedOutput ? JSON.parse(savedOutput) : []);
      setError(savedError || null);
    } else {
      // Reset to defaults when no user
      setCode(DEFAULT_CODE.javascript);
      setLanguage('javascript');
      setOutput([]);
      setError(null);
      setSelection(null);
      setNotifications([]);
      setIsModalOpen(false);
      setQuestion('');
    }
  }, [user]);

  // Save to localStorage when state changes (only if user is logged in)
  React.useEffect(() => {
    if (user) {
      localStorage.setItem(getUserKey('coding_code'), code);
    }
  }, [code, user]);

  React.useEffect(() => {
    if (user) {
      localStorage.setItem(getUserKey('coding_language'), language);
    }
  }, [language, user]);

  React.useEffect(() => {
    if (user) {
      localStorage.setItem(getUserKey('coding_output'), JSON.stringify(output));
    }
  }, [output, user]);

  React.useEffect(() => {
    if (user) {
      if (error) {
        localStorage.setItem(getUserKey('coding_error'), error);
      } else {
        localStorage.removeItem(getUserKey('coding_error'));
      }
    }
  }, [error, user]);

  const clearAllData = () => {
    // Clear state
    setCode(DEFAULT_CODE.javascript);
    setLanguage('javascript');
    setSelection(null);
    setIsLoading(false);
    setIsExecuting(false);
    setNotifications([]);
    setIsModalOpen(false);
    setQuestion('');
    setOutput([]);
    setError(null);
    
    // Clear user-specific localStorage (only if user is logged in)
    if (user) {
      localStorage.removeItem(getUserKey('coding_code'));
      localStorage.removeItem(getUserKey('coding_language'));
      localStorage.removeItem(getUserKey('coding_output'));
      localStorage.removeItem(getUserKey('coding_error'));
    }
  };

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
        clearAllData,
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
