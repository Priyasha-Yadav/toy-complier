import React from 'react';
import { Terminal, Loader2 } from 'lucide-react';

const OutputPanel = ({ output, isLoading, theme }) => {
  return (
    <div className="output-panel flex flex-col">
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-[var(--text-primary)]" />
          <span className="font-medium text-[var(--text-primary)]">Output</span>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <pre className="text-sm font-mono whitespace-pre-wrap text-[var(--text-primary)]">
          {output}
        </pre>
      </div>
      {isLoading && (
        <div className="px-4 py-3 border-t border-[var(--border)]">
          <div className="flex items-center space-x-2 text-[var(--accent)]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputPanel;