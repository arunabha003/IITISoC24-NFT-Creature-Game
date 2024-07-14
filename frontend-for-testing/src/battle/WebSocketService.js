// WebSocketService.js

import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5001'; // Replace with your server URL

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL, {
      withCredentials: true, // Optional, if you need to send cookies
    });
    console.log("socket",socket)
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket is not initialized');
  }
  return socket;
};
