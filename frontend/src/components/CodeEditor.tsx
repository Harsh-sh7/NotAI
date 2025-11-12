
import React, { useRef, useEffect } from 'react';

declare const monaco: any;

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  onSelectionChange: (selectedText: string) => void;
}

let monacoLoadPromise: Promise<void> | null = null;

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, language, onSelectionChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoInstanceRef = useRef<any>(null);

  const onCodeChangeRef = useRef(setCode);
  onCodeChangeRef.current = setCode;
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;

  useEffect(() => {
    const editorNode = editorRef.current;
    if (!editorNode) {
        return;
    }

    const createEditor = () => {
        if (!editorRef.current) return;
    
        const editor = monaco.editor.create(editorRef.current!, {
            value: code,
            language: language,
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            scrollbar: {
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
            },
            fontSize: 14,
            wordWrap: 'on',
            padding: { top: 16 }
        });

        monacoInstanceRef.current = editor;

        editor.onDidChangeModelContent(() => {
            const currentCode = editor.getValue();
            onCodeChangeRef.current(currentCode);
        });
        
        editor.onDidChangeCursorSelection(() => {
            const selection = editor.getSelection();
            if (selection && !selection.isEmpty()) {
                const model = editor.getModel();
                if(model) {
                    const selectedText = model.getValueInRange(selection);
                    onSelectionChangeRef.current(selectedText);
                }
            } else {
                onSelectionChangeRef.current('');
            }
        });
    };

    if (!monacoLoadPromise) {
        monacoLoadPromise = new Promise<void>((resolve, reject) => {
            if (typeof (window as any).monaco !== 'undefined') {
                return resolve();
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js';
            
            script.onload = () => {
                const amdRequire = (window as any).require;
                if (typeof amdRequire !== 'function') {
                    console.error("Monaco loader did not load correctly.");
                    return reject(new Error("Monaco loader failed."));
                }

                amdRequire.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
                
                amdRequire(['vs/editor/editor.main'], () => {
                    // The AMD `define` function from Monaco's loader conflicts with other module loaders,
                    // like the one used by Pyodide. Attempting to `delete window.define` can fail
                    // if the property is non-configurable, leading to a TypeError.
                    // A more robust solution is to nullify the `amd` property on the `define` function.
                    // This prevents other loaders from detecting it as a valid AMD environment,
                    // resolving the conflict without causing errors.
                    if (typeof (window as any).define === 'function' && (window as any).define.amd) {
                        (window as any).define.amd = null;
                    }
                    resolve();
                });
            };

            script.onerror = (err) => {
                reject(err);
            };

            document.body.appendChild(script);
        });
    }
    
    monacoLoadPromise.then(() => {
        if (editorRef.current && !monacoInstanceRef.current) {
            createEditor();
        }
    }).catch(console.error);

    return () => {
        if (monacoInstanceRef.current) {
            monacoInstanceRef.current.dispose();
            monacoInstanceRef.current = null;
        }
    };
  }, []);

  useEffect(() => {
      if(monacoInstanceRef.current && typeof monaco !== 'undefined') {
          const model = monacoInstanceRef.current.getModel();
          if(model) {
            monaco.editor.setModelLanguage(model, language);
          }
      }
  }, [language]);
  
  useEffect(() => {
    if (monacoInstanceRef.current && code !== monacoInstanceRef.current.getValue()) {
        monacoInstanceRef.current.setValue(code);
    }
  }, [code]);

  return (
    <div 
        ref={editorRef} 
        className="bg-surface rounded-lg border border-secondary font-mono text-sm h-96 max-h-[60vh] overflow-hidden w-full"
    />
  );
};
