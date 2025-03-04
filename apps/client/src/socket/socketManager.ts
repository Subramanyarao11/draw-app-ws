import { io, Socket } from 'socket.io-client';
import useWhiteboardStore from '../store/whiteboardStore';
import { Element } from '../store/whiteboardStore';

let socket: Socket;

export const connectWithSocketServer = () => {
  socket = io(import.meta.env.VITE_API_URL);

  socket.on('connect', () => {
    console.log('connected to socket.io server');
  });

  socket.on('whiteboard-state', (elements: Element[]) => {
    useWhiteboardStore.getState().setElements(elements);
  });

  socket.on('element-update', (elementData: Element) => {
    useWhiteboardStore.getState().updateElement(elementData);
  });

  socket.on('whiteboard-clear', () => {
    useWhiteboardStore.getState().setElements([]);
  });

  return socket;
};

export const emitElementUpdate = (elementData: Element) => {
  if (socket && socket.connected) {
    socket.emit('element-update', elementData);
  } else {
    console.warn('Socket not connected. Unable to emit element update.');
  }
};

export const emitClearWhiteboard = () => {
  if (socket && socket.connected) {
    socket.emit('whiteboard-clear');
  } else {
    console.warn('Socket not connected. Unable to emit clear whiteboard.');
  }
};

export const getSocket = () => socket;
