import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import CodeEditor from './components/CodeEditor';
import OutputPanel from './components/OutputPanel';
import './App.css';

function App() {
  const [code, setCode] = useState(`#include <stdio.h>\n\nint main() {\n    printf("Hello %s\\n", "Hackathon");\n    return 0;\n}`);
  const [output, setOutput] = useState('Ready to compile and run your C code...');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [files, setFiles] = useState([{ name: 'main.c', content: code, active: true }]);
  const [compilationStatus, setCompilationStatus] = useState(null);
  const [theme, setTheme] = useState('dark');
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

  // Real API calls to backend
  const handleCompile = async () => {
    setIsLoading(true);
    setCompilationStatus('running');
    try {
      const res = await axios.post('http://localhost:4000/api/compile', { code });
      if (res.data.ok) {
        setOutput(`✅ Compiled successfully:\n${res.data.js}`);
        setCompilationStatus('success');
      } else {
        setOutput(`❌ Compilation error: ${res.data.error}`);
        setCompilationStatus('error');
        highlightError(res.data.error);
      }
    } catch (err) {
      setOutput(`❌ Network error: ${err.message}`);
      setCompilationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRun = async () => {
    setIsLoading(true);
    setCompilationStatus('running');
    try {
      const res = await axios.post('http://localhost:4000/api/run', { code });
      if (res.data.ok) {
        setOutput(`📟 Program Output:\n${res.data.output || 'No output'}`);
        setCompilationStatus('success');
      } else {
        setOutput(`❌ Runtime error: ${res.data.error}\nOutput so far:\n${res.data.output || ''}`);
        setCompilationStatus('error');
        highlightError(res.data.error);
      }
    } catch (err) {
      setOutput(`❌ Network error: ${err.message}`);
      setCompilationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setCompilationStatus('running');
    try {
      const res = await axios.post('http://localhost:4000/api/save', {
        filename: 'main.c',
        content: code,
        token: user?.token, // Assumes user object has token after login
      });
      if (res.data.ok) {
        setOutput(`💾 Saved as Gist: ${res.data.url}`);
        setCompilationStatus('success');
      } else {
        setOutput(`❌ Save error: ${res.data.error}`);
        setCompilationStatus('error');
      }
    } catch (err) {
      setOutput(`❌ Network error: ${err.message}`);
      setCompilationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const newFile = { name: file.name, content, active: true };
        setFiles((prev) => prev.map((f) => ({ ...f, active: false })).concat(newFile));
        setCode(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    const activeFile = files.find((f) => f.active) || files[0];
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogin = () => {
    // Placeholder for GitHub OAuth
    setUser({ name: 'Developer', token: 'mock-token' });
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLoadSample = (sampleCode) => {
    setCode(sampleCode);
    setFiles((prev) => prev.map((f) => ({ ...f, active: false })).concat({ name: 'sample.c', content: sampleCode, active: true }));
  };

  const highlightError = (error) => {
    if (error.includes('line')) {
      const match = error.match(/line (\d+)/);
      if (match && editorRef.current) {
        const line = parseInt(match[1], 10);
        editorRef.current.revealLineInCenter(line);
        editorRef.current.setPosition({ lineNumber: line, column: 1 });
        editorRef.current.deltaDecorations(
          [],
          [
            {
              range: { startLineNumber: line, startColumn: 1, endLineNumber: line, endColumn: 1000 },
              options: { isWholeLine: true, className: 'errorLine' },
            },
          ]
        );
      }
    }
  };

  // Real-time syntax checking
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        const res = await axios.post('http://localhost:4000/api/check', { code });
        if (!res.data.ok) {
          setOutput(`❌ Syntax error: ${res.data.error}`);
          setCompilationStatus('error');
          highlightError(res.data.error);
        } else {
          setOutput('Code is syntactically correct');
          setCompilationStatus('success');
          editorRef.current?.deltaDecorations([], []);
        }
      } catch (err) {
        setOutput(`❌ Network error: ${err.message}`);
        setCompilationStatus('error');
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [code]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : 'light'}`}>
      <Header user={user} theme={theme} onThemeToggle={handleThemeToggle} onLogin={handleLogin} />
      <div className="flex h-screen">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} theme={theme} onLoadSample={handleLoadSample} />
        <div className="flex-1 flex flex-col">
          <Toolbar
            compilationStatus={compilationStatus}
            isLoading={isLoading}
            onCompile={handleCompile}
            onRun={handleRun}
            onSave={handleSave}
            onFileUpload={handleFileUpload}
            onDownload={handleDownload}
            theme={theme}
            fileInputRef={fileInputRef}
          />
          <div className="flex-1 flex">
            <div className="flex-1 flex flex-col">
              <div className="flex-1">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language="c"
                  theme={theme}
                  editorRef={editorRef}
                />
              </div>
            </div>
            <OutputPanel output={output} isLoading={isLoading} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;