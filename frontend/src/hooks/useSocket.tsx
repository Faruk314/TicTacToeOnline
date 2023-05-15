import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useCookies } from "react-cookie";

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    const newSocket = io("http://localhost:4001", {
      auth: {
        token: cookies.token,
      },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [cookies]);

  return socket;
};
