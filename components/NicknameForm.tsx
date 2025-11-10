
import React, { useState } from 'react';

interface NicknameFormProps {
  onSubmit: (nickname: string) => void;
}

const NicknameForm: React.FC<NicknameFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-800">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2 animate-fade-in-down">
          Welcome to Live Chat
        </h1>
        <p className="text-gray-400 mb-8 animate-fade-in-up">
          Please enter your nickname to join the conversation.
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Nickname"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-lg"
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="mt-4 w-full px-4 py-3 bg-cyan-600 text-white font-bold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 shadow-lg"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default NicknameForm;
