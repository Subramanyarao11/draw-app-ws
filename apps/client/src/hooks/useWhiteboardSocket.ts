import { useEffect, useCallback } from 'react';
import { connectWithSocketServer, emitElementUpdate, emitClearWhiteboard, getSocket } from '../socket/socketManager';
import { Element } from '../store/whiteboardStore';

const useWhiteboardSocket = () => {
  useEffect(() => {
    const socket = connectWithSocketServer();
    return () => {
      if (socket && socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  const updateElement = useCallback((elementData: Element) => {
    emitElementUpdate(elementData);
  }, []);

  const clearWhiteboard = useCallback(() => {
    emitClearWhiteboard();
  }, []);

  const socket = getSocket();

  return {
    socket,
    updateElement,
    clearWhiteboard,
    isConnected: socket?.connected || false,
  };
};

export default useWhiteboardSocket;
