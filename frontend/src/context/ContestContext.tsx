import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

interface TestCase {
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
}

interface Problem {
    title: string;
    description: string;
    difficulty: string;
    topic: string;
    testCases: TestCase[];
    starterCode: Record<string, string>;
    solutionTemplate: Record<string, string>;
}

interface ContestContextType {
    level: string | null;
    setLevel: (level: string) => void;
    topic: string;
    setTopic: (topic: string) => void;
    language: string;
    setLanguage: (language: string) => void;
    problem: Problem | null;
    setProblem: (problem: Problem | null) => void;
    code: string;
    setCode: (code: string) => void;
    userInput: string;
    setUserInput: (input: string) => void;
    output: string;
    setOutput: (output: string) => void;
    error: string | null;
    setError: (error: string | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    isExecuting: boolean;
    setIsExecuting: (executing: boolean) => void;
    activeTab: 'input' | 'output';
    setActiveTab: (tab: 'input' | 'output') => void;
    testResults: { passed: boolean; message: string }[];
    setTestResults: (results: { passed: boolean; message: string }[]) => void;
    clearContest: () => void;
}

const ContestContext = createContext<ContestContextType | undefined>(undefined);

export const ContestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    const [level, setLevel] = useState<string | null>(null);
    const [topic, setTopic] = useState<string>('');
    const [language, setLanguage] = useState<string>('python');
    const [problem, setProblem] = useState<Problem | null>(null);
    const [code, setCode] = useState<string>('');
    const [userInput, setUserInput] = useState<string>('');
    const [output, setOutput] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isExecuting, setIsExecuting] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
    const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([]);

    const clearContest = () => {
        setLevel(null);
        setTopic('');
        setLanguage('python');
        setProblem(null);
        setCode('');
        setUserInput('');
        setOutput('');
        setError(null);
        setIsLoading(false);
        setIsExecuting(false);
        setActiveTab('input');
        setTestResults([]);
    };

    return (
        <ContestContext.Provider
            value={{
                level,
                setLevel,
                topic,
                setTopic,
                language,
                setLanguage,
                problem,
                setProblem,
                code,
                setCode,
                userInput,
                setUserInput,
                output,
                setOutput,
                error,
                setError,
                isLoading,
                setIsLoading,
                isExecuting,
                setIsExecuting,
                activeTab,
                setActiveTab,
                testResults,
                setTestResults,
                clearContest,
            }}
        >
            {children}
        </ContestContext.Provider>
    );
};

export const useContest = () => {
    const context = useContext(ContestContext);
    if (!context) {
        throw new Error('useContest must be used within a ContestProvider');
    }
    return context;
};
