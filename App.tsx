
import React, { useState } from 'react';
import NicknameForm from './components/NicknameForm';
import ChatRoom from './components/ChatRoom';

const App: React.FC = () => {
  const [nickname, setNickname] = useState<string | null>(null);

  const handleNicknameSubmit = (name: string) => {
    setNickname(name);
  };

  return (
    <div className="h-screen w-screen flex flex-col antialiased">
      {nickname ? (
        <ChatRoom nickname={nickname} />
      ) : (
        <NicknameForm onSubmit={handleNicknameSubmit} />
      )}
    </div>
  );
};

export default App;
