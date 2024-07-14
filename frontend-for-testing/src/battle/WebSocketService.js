import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useWebSocket = () => {
  const url = "http://localhost:5001";
  const options = { withCredentials: true };
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(url, options);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [url, options]);

  return socket;
};

export default useWebSocket;
