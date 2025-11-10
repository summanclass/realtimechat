import React from 'react';
import { ActivityLog, ActivityLogType } from '../types';

interface LogViewerModalProps {
  logs: ActivityLog[];
  onClose: () => void;
}

const LogViewerModal: React.FC<LogViewerModalProps> = ({ logs, onClose }) => {
  const getLogTypeClass = (logType: ActivityLogType) => {
    switch (logType) {
      case 'USER_JOIN':
        return 'text-green-400';
      case 'USER_LEAVE':
        return 'text-yellow-500';
      case 'MESSAGE_SENT':
        return 'text-white';
      default:
        return 'text-gray-400';
    }
  };

  const formatTimestamp = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-cyan-500/30 rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-cyan-400">Activity Logs</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
            aria-label="Close log viewer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 font-mono text-sm">
          <div className="space-y-2">
            {logs.slice().reverse().map((log, index) => (
              <div key={index} className="flex items-start">
                <span className="text-gray-500 mr-4">{formatTimestamp(log.timestamp)}</span>
                <span className={`w-32 mr-4 font-bold ${getLogTypeClass(log.type)}`}>{`[${log.type}]`}</span>
                <span className="flex-1 text-gray-300">
                  <span className="font-semibold">{log.nickname}</span>
                  {log.type === 'MESSAGE_SENT' && log.message && `: "${log.message}"`}
                  {(log.type === 'USER_JOIN' || log.type === 'USER_LEAVE') && log.socketId && ` (SocketID: ${log.socketId})`}
                </span>
              </div>
            ))}
             {logs.length === 0 && (
                <div className="text-gray-500 text-center py-10">No activity logs yet.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LogViewerModal;