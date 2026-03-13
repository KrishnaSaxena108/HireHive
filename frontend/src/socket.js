import { io } from 'socket.io-client';

// 'http://localhost:4000' matches backend port in server.js
const URL = 'http://localhost:4000';

export const socket = io(URL, {
  autoConnect: true,
});
