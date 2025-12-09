import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useContest } from '../context/ContestContext';
import { geminiService } from '../services/geminiService';
import { CodeEditor } from './CodeEditor';
import { SparklesIcon, PlayIcon } from './Icons';
import {
    ContestDashboard,
    LoadingOverlay,
    TopicSelectionModal,
    SubmissionHistoryModal
} from './contest/index';

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
    const [editorHeight, setEditorHeight] = useState(60); // percentage
    const [isDragging, setIsDragging] = useState(false);
    const [problemPanelWidth, setProblemPanelWidth] = useState(50); // percentage
    const [isHorizontalDragging, setIsHorizontalDragging] = useState(false);


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

    // Generate clean starter code with only comments
    const getStarterCode = (lang: string): string => {
        const starterTemplates: Record<string, string> = {
            python: `# Read input
# Write your solution here
# Print output
`,
            javascript: `// Read input
// Write your solution here
// Print output
`,
            cpp: `#include <iostream>
using namespace std;

int main() {
    // Read input
    // Write your solution here
    // Print output
    return 0;
}`,
            java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read input
        // Write your solution here
        // Print output
    }
}`
        };
        return starterTemplates[lang] || starterTemplates.python;
    };

    const handleDifficultyStart = (difficulty: string) => {
        setProblem(null);
        setTopic('');
        setCustomTopic('');
        setCode('');
        setOutput('');
        setError(null);
        setTestResults([]);
        setLevel(difficulty);
        setShowTopicModal(true);
    };

    const handleSubmissionClick = (submission: Submission) => {
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

CRITICAL: You MUST respond with ONLY valid JSON. No markdown, no code blocks, no extra text.

The JSON must follow this EXACT format:
{
  "title": "Problem Title",
  "description": "Detailed problem description in a SINGLE LINE. Replace all newlines with spaces. DO NOT include examples in the description - they will be shown separately. Use PLAIN TEXT only - no markdown symbols. Explain the problem clearly, specify input format, output format, and constraints.",
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

STRICT REQUIREMENTS:
- Return ONLY the JSON object, nothing else
- The description field MUST be a single line string with no actual newlines
- Use \\n for newlines in starterCode only
- NO markdown formatting in description
- DO NOT include example test cases in the description
- Test cases should have simple input/output (numbers, strings, arrays as space-separated values)
- Make sure the problem is appropriate for ${level} level and focuses on ${topic}
- Ensure all strings are properly escaped for JSON`;

        try {
            const response = await geminiService.sendMessage(prompt);

            // Extract JSON from the response - handle various formats
            let jsonStr = response.trim();

            // Try to extract JSON from markdown code blocks
            const jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)```/) || jsonStr.match(/```\s*([\s\S]*?)```/);
            if (jsonMatch) {
                jsonStr = jsonMatch[1].trim();
            }

            // Clean up the JSON string before parsing
            // First, normalize line endings
            jsonStr = jsonStr
                .replace(/\r\n/g, '\n')
                .replace(/\r/g, '\n');

            // Remove actual newlines within string values (but preserve \n escape sequences)
            // This regex finds strings and replaces actual newlines with spaces
            jsonStr = jsonStr.replace(/"([^"]*?)"/g, (match, content) => {
                // Replace actual newlines in string content with spaces
                const cleaned = content.replace(/\n/g, ' ');
                return `"${cleaned}"`;
            });

            // Remove any remaining control characters except newlines between JSON properties
            jsonStr = jsonStr.replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, '');

            jsonStr = jsonStr.trim();

            let problemData;
            try {
                problemData = JSON.parse(jsonStr);
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                console.error('Full response length:', response.length);
                console.error('Attempted to parse (first 500 chars):', jsonStr.substring(0, 500));
                console.error('Last 200 chars:', jsonStr.substring(Math.max(0, jsonStr.length - 200)));

                throw new Error('Failed to parse problem data. The AI response was malformed. Please try generating again.');
            }

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
                setCode(previousAttempt.code || getStarterCode(language));
                setLanguage(previousAttempt.language || language);

                // Show notification that previous attempt was loaded
                setOutput(`📝 Loaded your previous attempt from ${new Date(previousAttempt.lastAttemptedAt).toLocaleDateString()} `);
                setActiveTab('output');
            } else {
                // Always use clean starter code, ignore AI-generated code
                setCode(getStarterCode(language));
            }
        } catch (err: any) {
            console.error('Error generating problem:', err);
            setError(err.message || 'Failed to generate problem. Please try again.');
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
            // Use clean starter code instead of AI-generated code
            setCode(getStarterCode(newLanguage));
        }
    };

    const handleNewContest = () => {
        clearContest();
        setShowLevelModal(true);
    };

    // Use ref to avoid stale closure in event handlers
    const isDraggingRef = React.useRef(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log('Mouse down - starting drag');
        isDraggingRef.current = true;
        setIsDragging(true);
    };

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        if (!isDraggingRef.current) return;

        const container = document.querySelector('.code-editor-container');
        if (!container) {
            console.log('Container not found');
            return;
        }

        const containerRect = container.getBoundingClientRect();
        const newHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100;

        console.log('Dragging - newHeight:', newHeight);

        // Constrain between 20% and 80%
        if (newHeight >= 20 && newHeight <= 80) {
            setEditorHeight(newHeight);
        }
    }, []);

    const handleMouseUp = React.useCallback(() => {
        console.log('Mouse up - ending drag');
        isDraggingRef.current = false;
        setIsDragging(false);
    }, []);

    useEffect(() => {
        console.log('isDragging changed to:', isDragging);
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'ns-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Horizontal resize handlers
    const isHorizontalDraggingRef = React.useRef(false);

    const handleHorizontalMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log('Horizontal mouse down - starting drag');
        isHorizontalDraggingRef.current = true;
        setIsHorizontalDragging(true);
    };

    const handleHorizontalMouseMove = React.useCallback((e: MouseEvent) => {
        if (!isHorizontalDraggingRef.current) return;

        const container = document.querySelector('.contest-container');
        if (!container) {
            console.log('Contest container not found');
            return;
        }

        const containerRect = container.getBoundingClientRect();
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

        console.log('Horizontal dragging - newWidth:', newWidth);

        // Constrain between 30% and 70%
        if (newWidth >= 30 && newWidth <= 70) {
            setProblemPanelWidth(newWidth);
        }
    }, []);

    const handleHorizontalMouseUp = React.useCallback(() => {
        console.log('Horizontal mouse up - ending drag');
        isHorizontalDraggingRef.current = false;
        setIsHorizontalDragging(false);
    }, []);

    useEffect(() => {
        console.log('isHorizontalDragging changed to:', isHorizontalDragging);
        if (isHorizontalDragging) {
            document.addEventListener('mousemove', handleHorizontalMouseMove);
            document.addEventListener('mouseup', handleHorizontalMouseUp);
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.removeEventListener('mousemove', handleHorizontalMouseMove);
            document.removeEventListener('mouseup', handleHorizontalMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleHorizontalMouseMove);
            document.removeEventListener('mouseup', handleHorizontalMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isHorizontalDragging, handleHorizontalMouseMove, handleHorizontalMouseUp]);


    // Welcome dashboard (default view)
    if (!problem) {
        return (
            <div className="h-full w-full flex flex-col overflow-hidden">
                <ContestDashboard
                    user={user}
                    submissions={submissions}
                    onDifficultyStart={handleDifficultyStart}
                    onSubmissionClick={handleSubmissionClick}
                    onViewHistory={() => setShowHistory(true)}
                    onAuthRequired={onAuthRequired}
                />

                {/* Topic Selection Modal */}
                {showTopicModal && (
                    <TopicSelectionModal
                        level={level || ''}
                        topic={topic}
                        customTopic={customTopic}
                        language={language}
                        isLoading={isLoading}
                        error={error}
                        onTopicSelect={setTopic}
                        onCustomTopicChange={(value) => {
                            setCustomTopic(value);
                            setTopic(value);
                        }}
                        onLanguageChange={handleLanguageChange}
                        onGenerate={() => {
                            setShowTopicModal(false);
                            handleGenerateProblem();
                        }}
                        onClose={() => {
                            setShowTopicModal(false);
                            setLevel('');
                            setTopic('');
                            setCustomTopic('');
                        }}
                    />
                )}

                {/* Loading Overlay */}
                {isLoading && (
                    <LoadingOverlay level={level || ''} topic={topic} />
                )}

                {/* Submission History Modal */}
                {showHistory && (
                    <SubmissionHistoryModal
                        submissions={submissions}
                        onClose={() => setShowHistory(false)}
                        onSubmissionClick={handleSubmissionClick}
                    />
                )}
            </div>
        );
    }

    // Contest problem view
    if (problem) {
        return (
            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden contest-container">
                {/* Problem Description Panel */}
                <div className="h-full flex flex-col" style={{ width: `${problemPanelWidth}%`, flexShrink: 0 }}>
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

                {/* Horizontal Resize Handle */}
                <div
                    onMouseDown={handleHorizontalMouseDown}
                    className={`group relative w-1 bg-border hover:bg-accent/50 cursor-ew-resize flex-shrink-0 transition-all duration-200 ${isHorizontalDragging ? 'bg-accent' : ''}`}
                    style={{ minWidth: '4px' }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`h-16 w-0.5 rounded-full transition-all duration-200 ${isHorizontalDragging ? 'bg-accent h-24' : 'bg-secondary-text/40 group-hover:bg-accent/70 group-hover:h-20'}`}></div>
                    </div>
                    {/* Invisible larger hit area for easier grabbing */}
                    <div className="absolute inset-y-0 -left-2 -right-2"></div>
                </div>

                {/* Code Editor Panel */}
                <div className="h-full flex flex-col code-editor-container" style={{ width: `${100 - problemPanelWidth}%`, flexShrink: 0 }}>
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

                    <div className="flex-1 flex flex-col overflow-hidden">
                        <style>{`
                            .contest-code-editor > div {
                                height: 100% !important;
                                max-height: none !important;
                            }
                        `}</style>
                        <div className="overflow-hidden" style={{ height: `${editorHeight}%`, flexShrink: 0 }}>
                            <div className="contest-code-editor" style={{ height: '100%' }}>
                                <CodeEditor
                                    code={code}
                                    setCode={setCode}
                                    language={language}
                                    onSelectionChange={() => { }}
                                />
                            </div>
                        </div>

                        {/* Resize Handle */}
                        <div
                            onMouseDown={handleMouseDown}
                            className={`group relative h-1 bg-border hover:bg-accent/50 cursor-ns-resize flex-shrink-0 transition-all duration-200 ${isDragging ? 'bg-accent' : ''}`}
                            style={{ minHeight: '4px' }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className={`w-16 h-0.5 rounded-full transition-all duration-200 ${isDragging ? 'bg-accent w-24' : 'bg-secondary-text/40 group-hover:bg-accent/70 group-hover:w-20'}`}></div>
                            </div>
                            {/* Invisible larger hit area for easier grabbing */}
                            <div className="absolute inset-x-0 -top-2 -bottom-2"></div>
                        </div>

                        {/* Console */}
                        <div className="bg-secondary flex flex-col overflow-hidden" style={{ height: `${100 - editorHeight}%`, flexShrink: 0 }}>
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
            </div>
        );
    }

    return (
        <>
            {showHistory && (
                <SubmissionHistoryModal
                    submissions={submissions}
                    onClose={() => setShowHistory(false)}
                    onSubmissionClick={handleSubmissionClick}
                />
            )}
        </>
    );
};
