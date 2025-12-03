import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useContest } from '../context/ContestContext';
import { geminiService } from '../services/geminiService';
import { CodeEditor } from './CodeEditor';
import { SparklesIcon, PlayIcon } from './Icons';

interface ContestProps {
    onAuthRequired: () => void;
}

interface Submission {
    _id: string;
    problemTitle: string;
    problemDescription: string;
    difficulty: string;
    topic: string;
    language: string;
    code: string;
    solved: boolean;
    attempts: number;
    lastAttemptedAt: string;
    testCases?: Array<{
        input: string;
        expectedOutput: string;
        isHidden?: boolean;
    }>;
}

const DSA_TOPICS = [
    'Arrays',
    'Strings',
    'Linked Lists',
    'Stacks',
    'Queues',
    'Trees',
    'Graphs',
    'Sorting',
    'Searching',
    'Dynamic Programming',
    'Greedy Algorithms',
    'Backtracking',
    'Hash Tables',
    'Heaps',
    'Recursion',
];

const LANGUAGE_MAP: Record<string, string> = {
    javascript: 'javascript',
    python: 'python',
    cpp: 'cpp',
    java: 'java',
};

export const Contest: React.FC<ContestProps> = ({ onAuthRequired }) => {
    const { user, updateContestLevel } = useAuth();
    const {
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
    } = useContest();

    const [showLevelModal, setShowLevelModal] = useState(false);
    const [customTopic, setCustomTopic] = useState('');
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);

    useEffect(() => {
        // Use user's saved contest level if available
        if (user?.contestLevel && !level) {
            setLevel(user.contestLevel);
        }
    }, [user]);

    useEffect(() => {
        if (level && !problem) {
            setShowLevelModal(false);
        }
    }, [level, problem]);

    useEffect(() => {
        if (user) {
            fetchSubmissions();
        }
    }, [user]);

    const fetchSubmissions = async () => {
        if (!user) return;

        try {
            const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const token = localStorage.getItem('token');

            const response = await fetch(`${backendUrl}/api/contest/submissions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                setSubmissions(data.submissions);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    const saveSubmission = async (solved: boolean) => {
        if (!user || !problem) return;

        try {
            const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const token = localStorage.getItem('token');

            const response = await fetch(`${backendUrl}/api/contest/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    problemTitle: problem.title,
                    problemDescription: problem.description,
                    difficulty: problem.difficulty,
                    topic: problem.topic,
                    language,
                    code,
                    solved,
                    testCases: problem.testCases
                })
            });

            const data = await response.json();

            if (data.success) {
                // Refresh submissions
                fetchSubmissions();
            }
        } catch (error) {
            console.error('Error saving submission:', error);
        }
    };

    const checkPreviousAttempt = async (problemTitle: string) => {
        if (!user) return null;

        try {
            const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const token = localStorage.getItem('token');

            const response = await fetch(`${backendUrl}/api/contest/submission/${encodeURIComponent(problemTitle)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success && data.submission) {
                return data.submission;
            }
        } catch (error) {
            console.error('Error checking previous attempt:', error);
        }

        return null;
    };

    const handleLevelSelect = async (selectedLevel: string) => {
        if (!user) {
            onAuthRequired();
            return;
        }

        try {
            // Save level to user profile
            await updateContestLevel(selectedLevel);
            setLevel(selectedLevel);
            setShowLevelModal(false);
        } catch (error) {
            console.error('Error saving contest level:', error);
            // Still set level locally even if save fails
            setLevel(selectedLevel);
            setShowLevelModal(false);
        }
    };

    const handleGenerateProblem = async () => {
        if (!user) {
            onAuthRequired();
            return;
        }

        if (!topic.trim()) {
            setError('Please select or enter a topic');
            return;
        }

        setIsLoading(true);
        setError(null);

        // Get list of previously attempted problems for this difficulty and topic
        const previousProblems = submissions
            .filter(s => s.difficulty === level && s.topic === topic)
            .map(s => s.problemTitle);

        const previousProblemsText = previousProblems.length > 0
            ? `\n\nIMPORTANT: The user has already attempted the following problems. DO NOT generate any of these problems again:\n${previousProblems.map((title, i) => `${i + 1}. ${title}`).join('\n')}\n\nGenerate a COMPLETELY DIFFERENT problem that is NOT in the above list.`
            : '';

        const prompt = `Generate a ${level} level DSA problem on the topic: ${topic}.${previousProblemsText}

Please provide the response in the following JSON format (make sure it's valid JSON):
{
  "title": "Problem Title",
  "description": "Detailed problem description. DO NOT include examples in the description - they will be shown separately. Use PLAIN TEXT only - no markdown symbols. Explain the problem clearly, specify input format, output format, and constraints.",
  "difficulty": "${level}",
  "topic": "${topic}",
  "testCases": [
    {
      "input": "test input 1",
      "expectedOutput": "expected output 1",
      "isHidden": false
    },
    {
      "input": "test input 2",
      "expectedOutput": "expected output 2",
      "isHidden": false
    },
    {
      "input": "test input 3",
      "expectedOutput": "expected output 3",
      "isHidden": true
    }
  ],
  "starterCode": {
    "python": "# Read input\\n# Write your solution here\\n# Print output\\n",
    "javascript": "// Read input\\n// Write your solution here\\n// Print output\\n",
    "cpp": "#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    // Read input\\n    // Write your solution here\\n    // Print output\\n    return 0;\\n}",
    "java": "import java.util.*;\\n\\npublic class Main {\\n    public static void main(String[] args) {\\n        Scanner sc = new Scanner(System.in);\\n        // Read input\\n        // Write your solution here\\n        // Print output\\n    }\\n}"
  }
}

IMPORTANT: 
- Use PLAIN TEXT in the description - NO markdown formatting symbols
- DO NOT include example test cases in the description - they will be displayed separately below
- Make the problem clear and well-defined
- Test cases should have simple input/output (numbers, strings, arrays as space-separated values)
- Clearly specify input format, output format, and constraints in the description
- Output should be a single line
- Make sure the problem is appropriate for ${level} level and focuses on ${topic}`;

        try {
            const response = await geminiService.sendMessage(prompt);

            // Extract JSON from the response
            let jsonStr = response;
            const jsonMatch = response.match(/\`\`\`json\s*([\s\S]*?)\`\`\`/) || response.match(/\`\`\`\s*([\s\S]*?)\`\`\`/);
            if (jsonMatch) {
                jsonStr = jsonMatch[1];
            }

            const problemData = JSON.parse(jsonStr);

            // Clean up the description - remove any markdown formatting that slipped through
            if (problemData.description) {
                problemData.description = problemData.description
                    .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove bold **text**
                    .replace(/\*(.+?)\*/g, '$1')      // Remove italic *text*
                    .replace(/`(.+?)`/g, '$1')        // Remove code `text`
                    .replace(/#{1,6}\s*/g, '')        // Remove headers
                    .trim();
            }

            // Ensure topic is set (use the one from context if not in response)
            if (!problemData.topic) {
                problemData.topic = topic;
            }

            setProblem(problemData);

            // Check if user has attempted this problem before
            const previousAttempt = await checkPreviousAttempt(problemData.title);

            if (previousAttempt) {
                // Load previous code if it exists
                setCode(previousAttempt.code || problemData.starterCode[language] || '');
                setLanguage(previousAttempt.language || language);

                // Show notification that previous attempt was loaded
                setOutput(`📝 Loaded your previous attempt from ${new Date(previousAttempt.lastAttemptedAt).toLocaleDateString()} `);
                setActiveTab('output');
            } else {
                setCode(problemData.starterCode[language] || '');
            }
        } catch (err) {
            console.error('Error generating problem:', err);
            setError('Failed to generate problem. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const executeCode = async (codeToRun: string, stdin: string = '') => {
        try {
            const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${backendUrl}/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language: LANGUAGE_MAP[language],
                    code: codeToRun,
                    stdin: stdin,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                const errorMessage = errData.details
                    ? `${errData.error}\n\nDetails: ${JSON.stringify(errData.details, null, 2)}`
                    : errData.error || 'Failed to execute code';
                throw new Error(errorMessage);
            }

            const result = await response.json();

            if (result.status.id === 3) {
                return {
                    success: true,
                    output: result.stdout?.trim() || '',
                };
            } else {
                return {
                    success: false,
                    error: result.stderr || result.compile_output || result.status.description || 'Execution error',
                };
            }
        } catch (e: any) {
            console.error('Code execution error:', e);
            return {
                success: false,
                error: `Execution failed: ${e.message}`,
            };
        }
    };

    const handleRunCode = async () => {
        if (!user) {
            onAuthRequired();
            return;
        }

        if (!problem) return;

        setIsExecuting(true);
        setError(null);
        setOutput('');
        setActiveTab('output');

        try {
            // Execute user code directly with their custom input
            const result = await executeCode(code, userInput);

            if (result.success) {
                setOutput(result.output || 'Code executed successfully with no output.');
            } else {
                setError(result.error || 'An error occurred during execution.');
            }
        } catch (e: any) {
            setError(`Unexpected error: ${e.message}`);
        } finally {
            setIsExecuting(false);
        }
    };

    const handleSubmit = async () => {
        if (!user) {
            onAuthRequired();
            return;
        }

        if (!problem) return;

        setIsExecuting(true);
        setError(null);
        setTestResults([]);
        setActiveTab('output');

        try {
            const results: { passed: boolean; message: string }[] = [];

            for (let i = 0; i < problem.testCases.length; i++) {
                const testCase = problem.testCases[i];

                // Execute user code directly with test input
                const result = await executeCode(code, testCase.input);

                if (result.success) {
                    const actualOutput = result.output?.trim() || '';
                    const expectedOutput = testCase.expectedOutput.trim();

                    if (actualOutput === expectedOutput) {
                        results.push({
                            passed: true,
                            message: testCase.isHidden
                                ? `Hidden Test Case ${i + 1}: Passed ✓`
                                : `Test Case ${i + 1}: Passed ✓\nInput: ${testCase.input}\nExpected: ${expectedOutput}\nGot: ${actualOutput}`,
                        });
                    } else {
                        results.push({
                            passed: false,
                            message: testCase.isHidden
                                ? `Hidden Test Case ${i + 1}: Failed ✗`
                                : `Test Case ${i + 1}: Failed ✗\nInput: ${testCase.input}\nExpected: ${expectedOutput}\nGot: ${actualOutput}`,
                        });
                    }
                } else {
                    results.push({
                        passed: false,
                        message: `Test Case ${i + 1}: Error\n${result.error}`,
                    });
                }
            }

            setTestResults(results);

            const allPassed = results.every(r => r.passed);

            // Save submission to database
            await saveSubmission(allPassed);

            if (allPassed) {
                setOutput('🎉 Congratulations! All test cases passed!');
            } else {
                setError('Some test cases failed. Please review the results below.');
            }
        } catch (e: any) {
            setError(`Unexpected error: ${e.message}`);
        } finally {
            setIsExecuting(false);
        }
    };

    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage);
        if (problem) {
            setCode(problem.starterCode[newLanguage] || '');
        }
    };

    const handleNewContest = () => {
        clearContest();
        setShowLevelModal(true);
    };

    // Welcome dashboard (default view)
    if (!problem) {
        return (
            <div className="h-full w-full overflow-y-auto bg-gradient-to-br from-primary via-primary to-secondary">
                <div className="max-w-7xl w-full mx-auto p-8 pb-12">
                    {/* Hero Section */}
                    <div className="mb-12">
                        <h1 className="text-5xl font-bold text-primary-text mb-3 tracking-tight">
                            Contest Arena
                        </h1>
                        <p className="text-xl text-secondary-text">
                            {user?.contestLevel
                                ? `Challenge yourself with ${user.contestLevel} level problems`
                                : 'Set your skill level in profile settings to get started'}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-accent/50 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-secondary-text mb-1">Problems Solved</p>
                                    <p className="text-4xl font-bold text-primary-text">{submissions.filter(s => s.solved).length}</p>
                                </div>
                                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-accent/50 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-secondary-text mb-1">Total Attempts</p>
                                    <p className="text-4xl font-bold text-primary-text">{submissions.length}</p>
                                </div>
                                <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-accent/50 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-secondary-text mb-1">Success Rate</p>
                                    <p className="text-4xl font-bold text-primary-text">
                                        {submissions.length > 0
                                            ? Math.round((submissions.filter(s => s.solved).length / submissions.length) * 100)
                                            : 0}%
                                    </p>
                                </div>
                                <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Difficulty Levels - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold text-primary-text mb-6">Choose Your Challenge</h2>

                            <div className="space-y-4">
                                {/* Beginner */}
                                {user ? (
                                    <div className="group bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                                    <span className="text-lg font-bold text-green-500">B</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-primary-text">Beginner</h3>
                                                    <p className="text-sm text-secondary-text">
                                                        {submissions.filter(s => s.difficulty === 'Beginner' && s.solved).length} / {submissions.filter(s => s.difficulty === 'Beginner').length} solved
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setProblem(null);
                                                    setTopic('');
                                                    setCustomTopic('');
                                                    setCode('');
                                                    setOutput('');
                                                    setError(null);
                                                    setTestResults([]);
                                                    setLevel('Beginner');
                                                    setShowTopicModal(true);
                                                }}
                                                className="px-6 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-300 hover:scale-105"
                                            >
                                                Start
                                            </button>
                                        </div>
                                        <div className="h-2 bg-primary/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                                                style={{
                                                    width: `${submissions.filter(s => s.difficulty === 'Beginner').length > 0
                                                        ? (submissions.filter(s => s.difficulty === 'Beginner' && s.solved).length / submissions.filter(s => s.difficulty === 'Beginner').length) * 100
                                                        : 0
                                                        }%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                                    <span className="text-lg font-bold text-green-500">B</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-primary-text">Beginner</h3>
                                                    <p className="text-sm text-secondary-text">Sign in to track progress</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={onAuthRequired}
                                                className="px-6 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-300"
                                            >
                                                Sign In
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Intermediate */}
                                {user ? (
                                    <div className="group bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                                    <span className="text-lg font-bold text-yellow-500">I</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-primary-text">Intermediate</h3>
                                                    <p className="text-sm text-secondary-text">
                                                        {submissions.filter(s => s.difficulty === 'Intermediate' && s.solved).length} / {submissions.filter(s => s.difficulty === 'Intermediate').length} solved
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setProblem(null);
                                                    setTopic('');
                                                    setCustomTopic('');
                                                    setCode('');
                                                    setOutput('');
                                                    setError(null);
                                                    setTestResults([]);
                                                    setLevel('Intermediate');
                                                    setShowTopicModal(true);
                                                }}
                                                className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-all duration-300 hover:scale-105"
                                            >
                                                Start
                                            </button>
                                        </div>
                                        <div className="h-2 bg-primary/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
                                                style={{
                                                    width: `${submissions.filter(s => s.difficulty === 'Intermediate').length > 0
                                                        ? (submissions.filter(s => s.difficulty === 'Intermediate' && s.solved).length / submissions.filter(s => s.difficulty === 'Intermediate').length) * 100
                                                        : 0
                                                        }%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                                    <span className="text-lg font-bold text-yellow-500">I</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-primary-text">Intermediate</h3>
                                                    <p className="text-sm text-secondary-text">Sign in to track progress</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={onAuthRequired}
                                                className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-all duration-300"
                                            >
                                                Sign In
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Expert */}
                                {user ? (
                                    <div className="group bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                                    <span className="text-lg font-bold text-red-500">E</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-primary-text">Expert</h3>
                                                    <p className="text-sm text-secondary-text">
                                                        {submissions.filter(s => s.difficulty === 'Expert' && s.solved).length} / {submissions.filter(s => s.difficulty === 'Expert').length} solved
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setProblem(null);
                                                    setTopic('');
                                                    setCustomTopic('');
                                                    setCode('');
                                                    setOutput('');
                                                    setError(null);
                                                    setTestResults([]);
                                                    setLevel('Expert');
                                                    setShowTopicModal(true);
                                                }}
                                                className="px-6 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-300 hover:scale-105"
                                            >
                                                Start
                                            </button>
                                        </div>
                                        <div className="h-2 bg-primary/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                                                style={{
                                                    width: `${submissions.filter(s => s.difficulty === 'Expert').length > 0
                                                        ? (submissions.filter(s => s.difficulty === 'Expert' && s.solved).length / submissions.filter(s => s.difficulty === 'Expert').length) * 100
                                                        : 0
                                                        }%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                                    <span className="text-lg font-bold text-red-500">E</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-primary-text">Expert</h3>
                                                    <p className="text-sm text-secondary-text">Sign in to track progress</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={onAuthRequired}
                                                className="px-6 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-300"
                                            >
                                                Sign In
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Submissions - Takes 1 column */}
                        {user && submissions.length > 0 && (
                            <div className="lg:col-span-1">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-primary-text">Recent Activity</h2>
                                    <button
                                        onClick={() => setShowHistory(true)}
                                        className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
                                    >
                                        View All
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {submissions.slice(0, 5).map((submission) => (
                                        <div
                                            key={submission._id}
                                            className="bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 hover:border-accent/50 transition-all duration-300 cursor-pointer group"
                                            onClick={() => {
                                                setShowHistory(false);
                                                setLevel(submission.difficulty);
                                                setTopic(submission.topic);
                                                setLanguage(submission.language);
                                                setCode(submission.code);

                                                const problemData = {
                                                    title: submission.problemTitle,
                                                    description: submission.problemDescription,
                                                    difficulty: submission.difficulty,
                                                    topic: submission.topic,
                                                    testCases: submission.testCases || [],
                                                    starterCode: { [submission.language]: submission.code },
                                                    solutionTemplate: {}
                                                };
                                                setProblem(problemData);
                                            }}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold text-primary-text text-sm group-hover:text-accent transition-colors line-clamp-1">
                                                    {submission.problemTitle}
                                                </h3>
                                                {submission.solved && (
                                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-secondary-text">
                                                <span className={`px-2 py-0.5 rounded ${submission.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-500' :
                                                    submission.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {submission.difficulty}
                                                </span>
                                                <span>•</span>
                                                <span>{submission.topic}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Topic Selection Modal */}
                {showTopicModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-secondary border-2 border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
                            <div className="p-6 border-b-2 border-border flex items-center justify-between sticky top-0 bg-secondary z-10">
                                <h2 className="text-2xl font-bold text-primary-text">
                                    Select Topic for {level} Contest
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowTopicModal(false);
                                        setLevel('');
                                        setTopic('');
                                        setCustomTopic('');
                                    }}
                                    className="p-2 hover:bg-primary rounded-lg transition-all"
                                >
                                    <svg className="w-6 h-6 text-secondary-text hover:text-primary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                                    {DSA_TOPICS.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTopic(t)}
                                            className={`p-4 rounded-lg border-2 transition-all duration-300 font-medium ${topic === t
                                                ? 'bg-accent text-primary border-accent shadow-lg'
                                                : 'bg-primary text-primary-text border-border hover:border-accent'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-secondary-text mb-2">
                                        Or enter a custom topic:
                                    </label>
                                    <input
                                        type="text"
                                        value={customTopic}
                                        onChange={(e) => {
                                            setCustomTopic(e.target.value);
                                            setTopic(e.target.value);
                                        }}
                                        placeholder="e.g., Binary Search Trees"
                                        className="w-full bg-primary border-2 border-border rounded-lg px-4 py-3 text-primary-text focus:outline-none focus:border-accent transition-all"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-secondary-text mb-2">
                                        Programming Language:
                                    </label>
                                    <select
                                        value={language}
                                        onChange={(e) => handleLanguageChange(e.target.value)}
                                        className="w-full bg-primary border-2 border-border rounded-lg px-4 py-3 text-primary-text focus:outline-none focus:border-accent transition-all"
                                    >
                                        <option value="python">Python</option>
                                        <option value="javascript">JavaScript</option>
                                        <option value="cpp">C++</option>
                                        <option value="java">Java</option>
                                    </select>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowTopicModal(false);
                                        handleGenerateProblem();
                                    }}
                                    disabled={isLoading || !topic.trim()}
                                    className="w-full px-6 py-4 bg-accent text-primary rounded-lg font-semibold hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <SparklesIcon className="w-5 h-5" />
                                    {isLoading ? 'Generating...' : 'Generate Problem'}
                                </button>

                                {error && (
                                    <div className="mt-4 p-4 bg-red-500 bg-opacity-10 border-2 border-red-500 rounded-lg">
                                        <p className="text-red-500 text-sm">{error}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Contest problem view
    if (problem) {
        return (
            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
                {/* Problem Description Panel */}
                <div className="w-full md:w-1/2 h-full border-r-2 border-border flex flex-col">
                    <div className="p-4 border-b-2 border-border bg-secondary flex items-center justify-between flex-shrink-0">
                        <h2 className="text-xl font-bold text-primary-text">{problem.title}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${problem.difficulty === 'Beginner' ? 'bg-green-500 bg-opacity-20 text-green-500' :
                            problem.difficulty === 'Intermediate' ? 'bg-yellow-500 bg-opacity-20 text-yellow-500' :
                                'bg-red-500 bg-opacity-20 text-red-500'
                            }`}>
                            {problem.difficulty}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                        <div className="prose prose-invert max-w-none">
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 bg-accent text-primary rounded-full text-sm font-semibold">
                                    {problem.topic || 'General'}
                                </span>
                            </div>

                            <div className="text-secondary-text whitespace-pre-wrap leading-relaxed">
                                {problem.description}
                            </div>

                            {problem.testCases.filter(tc => !tc.isHidden).length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-primary-text mb-3">Example Test Cases:</h3>
                                    {problem.testCases.filter(tc => !tc.isHidden).map((tc, idx) => (
                                        <div key={idx} className="mb-4 p-4 bg-primary border-2 border-border rounded-lg">
                                            <div className="mb-2">
                                                <span className="text-sm font-semibold text-secondary-text">Input:</span>
                                                <pre className="mt-1 text-sm text-primary-text bg-secondary p-2 rounded">{tc.input}</pre>
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-secondary-text">Output:</span>
                                                <pre className="mt-1 text-sm text-primary-text bg-secondary p-2 rounded">{tc.expectedOutput}</pre>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Code Editor Panel */}
                <div className="w-full md:w-1/2 h-full flex flex-col">
                    <div className="p-3 border-b-2 border-border bg-secondary flex items-center justify-between flex-wrap gap-2 flex-shrink-0">
                        <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            className="bg-primary border-2 border-border px-3 py-2 rounded-lg text-sm text-primary-text focus:outline-none focus:border-accent"
                        >
                            <option value="python">Python</option>
                            <option value="javascript">JavaScript</option>
                            <option value="cpp">C++</option>
                            <option value="java">Java</option>
                        </select>

                        <div className="flex gap-2">
                            <button
                                onClick={handleNewContest}
                                className="px-4 py-2 bg-primary border-2 border-border rounded-lg text-sm font-semibold hover:border-accent transition-all flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back
                            </button>
                            <button
                                onClick={handleRunCode}
                                disabled={isExecuting}
                                className="px-4 py-2 bg-primary border-2 border-border rounded-lg text-sm font-semibold hover:border-accent transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                <PlayIcon className="w-4 h-4" />
                                {isExecuting ? 'Running...' : 'Run'}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isExecuting}
                                className="px-4 py-2 bg-accent text-primary rounded-lg text-sm font-semibold hover:opacity-80 transition-all disabled:opacity-50"
                            >
                                {isExecuting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0" style={{ height: 'calc(60vh - 120px)' }}>
                        <CodeEditor
                            code={code}
                            setCode={setCode}
                            language={language}
                            onSelectionChange={() => { }}
                        />
                    </div>

                    {/* Console */}
                    <div className="h-64 flex-shrink-0 border-t-2 border-border bg-secondary flex flex-col">
                        <div className="flex items-center border-b-2 border-border flex-shrink-0">
                            <button
                                onClick={() => setActiveTab('input')}
                                className={`px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'input'
                                    ? 'bg-primary text-primary-text border-b-2 border-accent'
                                    : 'text-secondary-text hover:text-primary-text'
                                    }`}
                            >
                                Input
                            </button>
                            <button
                                onClick={() => setActiveTab('output')}
                                className={`px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'output'
                                    ? 'bg-primary text-primary-text border-b-2 border-accent'
                                    : 'text-secondary-text hover:text-primary-text'
                                    }`}
                            >
                                Output
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {activeTab === 'input' ? (
                                <textarea
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Enter custom input for testing..."
                                    className="w-full h-full bg-primary border-2 border-border rounded-lg p-3 text-sm font-mono text-primary-text placeholder-secondary-text focus:outline-none focus:border-accent resize-none"
                                />
                            ) : (
                                <div className="text-sm font-mono">
                                    {output && (
                                        <div className="text-primary-text whitespace-pre-wrap mb-4">
                                            {output}
                                        </div>
                                    )}

                                    {error && (
                                        <div className="text-red-500 whitespace-pre-wrap mb-4">
                                            {error}
                                        </div>
                                    )}

                                    {testResults.length > 0 && (
                                        <div className="space-y-2">
                                            {testResults.map((result, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`p-3 rounded-lg border-2 ${result.passed
                                                        ? 'bg-green-500 bg-opacity-10 border-green-500 text-green-500'
                                                        : 'bg-red-500 bg-opacity-10 border-red-500 text-red-500'
                                                        }`}
                                                >
                                                    <pre className="whitespace-pre-wrap text-xs">{result.message}</pre>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {!output && !error && testResults.length === 0 && (
                                        <div className="text-secondary-text">
                                            Run your code or submit to see results here...
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {showHistory && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-secondary border-2 border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in flex flex-col">
                        <div className="p-6 border-b-2 border-border flex items-center justify-between flex-shrink-0">
                            <h2 className="text-2xl font-bold text-primary-text">Your Submission History</h2>
                            <button
                                onClick={() => setShowHistory(false)}
                                className="p-2 hover:bg-primary rounded-lg transition-all"
                            >
                                <svg className="w-6 h-6 text-secondary-text hover:text-primary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {submissions.length === 0 ? (
                                <div className="text-center py-12 text-secondary-text">
                                    <p className="text-lg mb-2">No submissions yet</p>
                                    <p className="text-sm">Start solving problems to build your history!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {submissions.map((submission) => (
                                        <div
                                            key={submission._id}
                                            className="p-4 bg-primary border-2 border-border rounded-lg hover:border-accent transition-all cursor-pointer"
                                            onClick={async () => {
                                                // Load this problem
                                                setShowHistory(false);
                                                setLevel(submission.difficulty);
                                                setTopic(submission.topic);
                                                setLanguage(submission.language);
                                                setCode(submission.code);

                                                // Recreate problem object
                                                const problemData = {
                                                    title: submission.problemTitle,
                                                    description: submission.problemDescription,
                                                    difficulty: submission.difficulty,
                                                    topic: submission.topic,
                                                    testCases: submission.testCases || [],
                                                    starterCode: { [submission.language]: submission.code },
                                                    solutionTemplate: {}
                                                };
                                                setProblem(problemData);
                                            }}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-primary-text mb-1">
                                                        {submission.problemTitle}
                                                        {submission.solved && (
                                                            <span className="ml-2 text-xs bg-green-500 bg-opacity-20 text-green-500 px-2 py-1 rounded-full">
                                                                ✓ Solved
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-sm text-secondary-text">
                                                        <span className={`${submission.difficulty === 'Beginner' ? 'text-green-500' :
                                                            submission.difficulty === 'Intermediate' ? 'text-yellow-500' :
                                                                'text-red-500'
                                                            }`}>
                                                            {submission.difficulty}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{submission.topic}</span>
                                                        <span>•</span>
                                                        <span className="capitalize">{submission.language}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right text-sm text-secondary-text">
                                                    <p>{submission.attempts} attempt{submission.attempts > 1 ? 's' : ''}</p>
                                                    <p className="text-xs">{new Date(submission.lastAttemptedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
