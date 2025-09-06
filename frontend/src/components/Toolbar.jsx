import React from 'react';
import { Play, Square, Save, Download, Upload, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Toolbar = ({
  compilationStatus,
  isLoading,
  onCompile,
  onRun,
  onSave,
  onFileUpload,
  onDownload,
  theme,
  fileInputRef,
}) => {
  const getStatusIcon = () => {
    switch (compilationStatus) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <Loader2 className="w-4 h-4 text-[var(--accent)] animate-spin" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (compilationStatus) {
      case 'success': return 'Ready';
      case 'error': return 'Error';
      case 'running': return 'Processing...';
      default: return 'Ready';
    }
  };

  return (
    <div className="toolbar">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm font-medium text-[var(--text-primary)]">{getStatusText()}</span>
          </div>
          <div className="h-4 w-px bg-[var(--border)]"></div>
          <span className="text-sm text-[var(--text-primary)]/70">main.c</span>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileUpload}
            accept=".c,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button
            onClick={onDownload}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <div className="h-6 w-px bg-[var(--border)]"></div>
          <button
            onClick={onCompile}
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
            <span>{isLoading ? 'Compiling...' : 'Compile'}</span>
          </button>
          <button
            onClick={onRun}
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isLoading ? 'Running...' : 'Run'}</span>
          </button>
          <button
            onClick={onSave}
            disabled={isLoading}
            className="btn btn-primary"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'Save Gist'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;