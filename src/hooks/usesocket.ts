import { useMemo, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { ApiEndPoint } from '../config';

const useSocket = (userId: String | undefined) => {

    const [socket,setSocket] = useState<Socket>();
  const socketInstance = useMemo(() => {
    if (!userId) return null;

    const socketInstance2 = io(ApiEndPoint, {
      secure: true,
      transports: ['websocket'],
      query: {
        userId,
      },
    });

    setSocket(socketInstance2)

  }, [userId]);

  useEffect(() => {
    return () => {
      if (socket) {
        console.log("socket disconnected",socket.id)
        socket.disconnect();
      }
    };
  }, [socket]);

  return socket;
};

export default useSocket;
