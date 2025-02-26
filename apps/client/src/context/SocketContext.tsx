import React, { createContext, useContext, ReactNode } from 'react';
import useWhiteboardSocket from '../hooks/useWhiteboardSocket';
import { Socket } from 'socket.io-client';
import { Element } from '../store/whiteboardStore';

interface SocketContextType {
  socket: Socket | undefined;
  updateElement: (elementData: Element) => void;
  clearWhiteboard: () => void;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socketUtils = useWhiteboardSocket();

  return (
    <SocketContext.Provider value={socketUtils}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
