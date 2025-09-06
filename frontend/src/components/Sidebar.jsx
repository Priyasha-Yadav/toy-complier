import React from 'react';
import { Code, FileText, Terminal } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, theme, onLoadSample }) => {
  const samplePrograms = [
    {
      name: 'Hello World',
      code: `#include <stdio.h>\n\nint main() {\n    printf("Hello %s\\n", "World");\n    return 0;\n}`,
    },
    {
      name: 'Fibonacci',
      code: `#include <stdio.h>\n\nint fib(int n) {\n    if (n < 2) return n;\n    return fib(n-1) + fib(n-2);\n}\n\nint main() {\n    printf("%d\\n", fib(6));\n    return 0;\n}`,
    },
    {
      name: 'Sum Loop',
      code: `#include <stdio.h>\n\nint main() {\n    int sum = 0;\n    for (int i = 1; i <= 10; i = i + 1) {\n        sum = sum + i;\n    }\n    printf("%d\\n", sum);\n    return 0;\n}`,
    },
  ];

  const tabs = [
    { id: 'editor', icon: Code, label: 'Editor' },
    { id: 'files', icon: FileText, label: 'Files' },
    { id: 'output', icon: Terminal, label: 'Output' },
  ];

  return (
    <div className="sidebar">
      <div className="p-4">
        <div className="space-y-2">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === id
                  ? 'bg-[var(--accent)] text-white'
                  : 'hover:bg-[var(--hover)] text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-[var(--border)]">
        <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)]/70">Sample Programs</h3>
        <div className="space-y-1">
          {samplePrograms.map((program, index) => (
            <button
              key={index}
              onClick={() => onLoadSample(program.code)}
              className="w-full text-left px-3 py-2 rounded text-sm hover:bg-[var(--hover)] transition-colors text-[var(--text-primary)]"
            >
              {program.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;