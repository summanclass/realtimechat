
import React, { useState, useEffect, useRef } from 'react';
import type { Socket } from 'socket.io-client';
import { ChatMessage, MessageType, ActivityLog } from '../types';
import LogViewerModal from './LogViewerModal';

interface ChatRoomProps {
  nickname: string;
}

// Ensure the global 'io' object from the script tag is available
declare const io: (options?: any) => Socket;

const ChatRoom: React.FC<ChatRoomProps> = ({ nickname }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to the socket server.
    // By not providing a URL, Socket.IO automatically connects to the server that served the page.
    socketRef.current = io({
      query: { nickname },
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
    });
    
    // Listen for the full chat history upon joining
    socket.on('history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    // Listen for new messages
    socket.on('newRecord', (record: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, record]);
    });

    // Listen for log data from the server
    socket.on('logsData', (data: ActivityLog[]) => {
      setLogs(data);
    });

    socket.on('connect_error', (err) => {
        console.error('Connection failed:', err.message);
    });

    // Disconnect on component unmount
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nickname]);

  useEffect(() => {
    // Auto-scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socketRef.current) {
      socketRef.current.emit('sendMessage', newMessage.trim());
      setNewMessage('');
    }
  };

  const handleViewLogs = () => {
    if (socketRef.current) {
      socketRef.current.emit('getLogs');
      setShowLogs(true);
    }
  };
  
  const formatTimestamp = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <>
      <div className="flex flex-col h-full bg-gray-800">
        <header className="bg-gray-900 p-4 shadow-md z-10 flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-center text-cyan-400">Live Chat Room</h1>
              <p className="text-center text-sm text-gray-400">Welcome, {nickname}!</p>
            </div>
            <button
              onClick={handleViewLogs}
              className="absolute right-4 p-2 text-gray-400 hover:text-cyan-400 transition-colors"
              aria-label="View activity logs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            if (msg.type === MessageType.SYSTEM) {
              return (
                <div key={msg.id} className="text-center text-sm text-gray-500 italic">
                  {msg.message}
                </div>
              );
            }
            const isMe = msg.nickname === nickname;
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col max-w-xs md:max-w-md ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2 rounded-lg shadow ${isMe ? 'bg-cyan-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                    {!isMe && <p className="text-xs font-bold text-cyan-300">{msg.nickname}</p>}
                    <p className="text-white break-words">{msg.message}</p>
                  </div>
                   <p className="text-xs text-gray-500 mt-1">{formatTimestamp(msg.timestamp)}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </main>

        <footer className="bg-gray-900 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-full hover:bg-cyan-700 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </form>
        </footer>
      </div>
      {showLogs && <LogViewerModal logs={logs} onClose={() => setShowLogs(false)} />}
    </>
  );
};

export default ChatRoom;
