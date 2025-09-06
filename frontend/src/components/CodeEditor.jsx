// components/CodeEditor.jsx
import React from 'react';

const CodeEditor = ({ value, onChange, language = 'c', theme = 'dark' }) => {
  const editorStyles = {
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    fontSize: '1.5rem',         // ↑ larger font
    lineHeight: '1.6',        // better readability
    tabSize: 4,
    paddingLeft: '4rem',
    color: '#BEB1A0',         // text color
    background: 'transparent', // use parent gradient
    border: 'none',
    outline: 'none',
    resize: 'none'
  };

  const getLineNumbers = () => {
    return value.split('\n').map((_, index) => index + 1);
  };

  return (
    <div className={`h-full w-full relative 
  ${theme === 'dark'
        ? 'bg-gradient-to-br from-[#3C2F2F] via-[#4A3728] to-[#8B6F47] text-[#BEB1A0]'
        : 'bg-gradient-to-br from-[#F5E8C7] via-[#D1B89D] to-[#B89778] text-[#3C2F2F]'} 
  font-mono 
  text-lg 
  tracking-wide 
  shadow-inner 
  p-4
  transition-colors duration-500`}>
      <div className="line-numbers absolute left-0 top-0 w-12 h-full pointer-events-none select-none">
        <div className="p-4 font-mono text-lg leading-[1.6]">
          {getLineNumbers().map((lineNum) => (
            <div key={lineNum} className="text-right pr-2 text-[#D4A017] opacity-70">
              {lineNum}
            </div>
          ))}
        </div>
      </div>

      {/* Main editor textarea */}
<textarea
  value={value}
  onChange={(e) => onChange(e.target.value)}
  className="code-editor w-full h-full custom-scrollbar font-mono"
  style={{
    fontSize: '1.5rem',
    lineHeight: '1.6',
    tabSize: 4,
    paddingLeft: '4rem',
    color: theme === 'dark' ? '#BEB1A0' : '#3C2F2F',  // dynamic text color
    background: theme === 'dark' ? 'transparent' : 'rgba(245, 232, 199, 0.6)', // light overlay for readability
    border: 'none',
    outline: 'none',
    resize: 'none'
  }}
  placeholder={`// Write your C code here...
// Example:
#include <stdio.h>

int main() {
    printf("Hello World\\n");
    return 0;
}`}
  spellCheck={false}
  autoCapitalize="off"
  autoComplete="off"
  autoCorrect="off"
/>


      {/* Language overlay */}
      <div className="absolute bottom-2 right-2 text-sm text-[#D4A017] opacity-70 font-mono">
        {language.toUpperCase()}
      </div>
    </div>
  );
};

export default CodeEditor;
