import React from 'react';
import { SocketProvider } from './context/SocketContext';

const App: React.FC = () => {
  return (
    <SocketProvider>
      <div className="app">
        <h1>Collaborative Whiteboard</h1>
      </div>
    </SocketProvider>
  );
};

export default App;
