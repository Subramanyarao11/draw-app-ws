import React from 'react';
import { SocketProvider } from './context/SocketContext';
import Whiteboard from './components/WhiteBoard';
import './App.css';

const App: React.FC = () => {
  return (
    <SocketProvider>
      <div className="app">
        <Whiteboard />
      </div>
    </SocketProvider>
  );
};

export default App;
