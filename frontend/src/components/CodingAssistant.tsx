
import React, { useCallback } from 'react';
import { CodeEditor } from './CodeEditor';
import { Notification } from './Notification';
import { geminiService } from '../services/geminiService';
import { PlayIcon, SparklesIcon } from './Icons';
import { useAuth } from '../context/AuthContext';
import { useCoding } from '../context/CodingContext';

const DEFAULT_CODE: Record<string, string> = {
  javascript: `function greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\n\ngreet("World");`,
  python: `# Note: External packages like numpy, pandas are not available\n\ndef greet(name):\n    print(f"Hello, {name}!")\n    return f"Greeting sent to {name}"\n\nresult = greet("World")\nprint(result)`,
  cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!";\n    return 0;\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`
};

// Map Monaco languages to Judge0 language IDs
const LANGUAGE_MAP: Record<string, string> = {
  javascript: 'javascript',
  python: 'python',
  cpp: 'cpp',
  java: 'java',
};

interface CodingAssistantProps {
  onAuthRequired: () => void;
}

export const CodingAssistant: React.FC<CodingAssistantProps> = ({ onAuthRequired }) => {
  const { user } = useAuth();
  const {
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
  } = useCoding();


  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage] || '');
    setOutput([]);
    setError(null);
  };

  const handleSelectionChange = (selectedText: string) => {
    setSelection(selectedText.trim());
  };

  const handleAskAboutSelection = () => {
    if (selection && selection.length > 0) {
      setIsModalOpen(true);
    }
  };

  const executeCodeBackend = async (lang: string, codeToExecute: string) => {
    try {
      // Connect to backend server using environment variable
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${backendUrl}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: lang,
          code: codeToExecute,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to execute code on the server.');
      }

      const result = await response.json();

      if (result.status.id === 3) { // Accepted
        setOutput(result.stdout ? result.stdout.split('\n') : ['Execution finished with no output.']);
      } else { // Some kind of error
        let errorMessage = result.stderr || result.compile_output || result.status.description || 'An unknown execution error occurred.';

        // Provide helpful messages for common errors
        if (errorMessage.includes('ModuleNotFoundError') || errorMessage.includes('No module named')) {
          errorMessage += '\n\nNote: Judge0 only supports Python standard library. External packages like numpy, pandas, requests, etc. are not available.';
        }

        setError(errorMessage);
      }

    } catch (e: any) {
      setError(`Execution failed: ${e.message}`);
    }
  };

  const handleRunCode = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    setOutput([]);
    setError(null);
    setIsExecuting(true);

    try {
      // Execute all languages through Judge0 backend
      await executeCodeBackend(LANGUAGE_MAP[language], code);
    } catch (e: any) {
      setError(`An unexpected error occurred: ${e.message || String(e)}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleAskAboutError = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    if (!error) return;

    setIsLoading(true);

    const prompt = `I encountered an error in my ${language} code. Can you help me understand and fix it?

**Programming Language:** ${language}

**Full Code:**
\`\`\`${language}
${code}
\`\`\`

**Error Message:**
${error}
`;
    try {
      const response = await geminiService.sendMessage(prompt);
      setNotifications(prev => [...prev, { id: Date.now(), content: response }]);
    } catch (err) {
      console.error('Error getting AI assistance:', err);
      setError('Failed to get AI assistance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onAuthRequired();
      setIsModalOpen(false);
      return;
    }
    if (!question.trim()) return;

    setIsLoading(true);
    setIsModalOpen(false);

    const prompt = `
      You are an expert code assistant. A user has selected a specific part of their code and has a question.
      Provide a concise and helpful answer.

      **Programming Language:** ${language}

      **Full Code Context:**
      \`\`\`${language}
      ${code}
      \`\`\`

      **Selected Code Snippet:**
      \`\`\`${language}
      ${selection}
      \`\`\`

      **User's Question:**
      ${question}
    `;

    try {
      const response = await geminiService.sendMessage(prompt);
      setNotifications(prev => [...prev, { id: Date.now(), content: response }]);
    } catch (err) {
      console.error('Error getting AI assistance:', err);
      setError('Failed to get AI assistance. Please try again.');
    } finally {
      setQuestion('');
      setSelection(null);
      setIsLoading(false);
    }
  };

  const closeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const runButtonText = isExecuting ? 'Running...' : 'Run';

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 p-4 md:p-6 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-6xl space-y-4">
          <div className="flex flex-wrap gap-4 justify-between items-center bg-secondary p-3 rounded-lg border-2 border-border">
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-primary border-2 border-border px-4 py-2 rounded-lg text-sm text-primary-text focus:outline-none focus:border-accent transition-all"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
              <button
                onClick={handleRunCode}
                disabled={isExecuting}
                className="px-4 py-2 bg-accent text-primary hover:opacity-80 rounded-lg flex items-center transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayIcon className="w-5 h-5 mr-2" /> {runButtonText}
              </button>
            </div>
            <button
              onClick={handleAskAboutSelection}
              disabled={!selection || selection.length === 0 || isLoading}
              className="px-4 py-2 bg-accent text-primary hover:opacity-80 rounded-lg disabled:bg-secondary disabled:text-secondary-text disabled:cursor-not-allowed transition-all font-semibold"
            >
              {isLoading ? 'Thinking...' : 'Ask about selection'}
            </button>
          </div>
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            onSelectionChange={handleSelectionChange}
          />
          {(output.length > 0 || error) && (
            <div className="mt-4 bg-secondary p-4 rounded-lg border-2 border-border animate-fade-in">
              <h3 className="text-sm font-semibold text-secondary-text mb-2 tracking-wider uppercase">Console</h3>
              <div className="text-sm whitespace-pre-wrap font-mono text-primary-text max-h-48 overflow-y-auto">
                {output.map((line, index) => <div key={index} className="border-l-2 border-transparent pl-2">{line}</div>)}
                {error && (
                  <div className="text-red-500 border-l-2 border-red-500 pl-2 mt-2">
                    <p>{error}</p>
                    <button onClick={handleAskAboutError} disabled={isLoading} className="mt-2 text-sm flex items-center px-3 py-1 bg-red-500 bg-opacity-20 hover:bg-opacity-30 rounded-md transition-all text-red-400 disabled:opacity-50 font-medium">
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      {isLoading ? 'Analyzing...' : 'Ask AI about this error'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-secondary border-2 border-border p-6 rounded-lg shadow-xl w-full max-w-lg animate-slide-up">
            <h2 className="text-lg font-semibold mb-2 text-primary-text">Ask about your code</h2>
            <p className="text-sm text-secondary-text mb-4">Your selected code snippet will be sent to Gemini along with your question.</p>
            <form onSubmit={handleModalSubmit}>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., How can I optimize this function?"
                rows={4}
                className="w-full bg-primary border-2 border-border rounded-lg p-3 focus:outline-none focus:border-accent text-primary-text placeholder-secondary-text transition-all"
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-primary border-2 border-border rounded-lg hover:border-accent transition-all font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-accent text-primary rounded-lg hover:opacity-80 transition-all font-semibold">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 w-full max-w-md max-h-[80vh] overflow-y-auto space-y-4 z-50 pr-4 flex flex-col-reverse">
        {notifications.map(notif => (
          <Notification key={notif.id} id={notif.id} content={notif.content} onClose={closeNotification} />
        ))}
      </div>
    </div>
  );
};
