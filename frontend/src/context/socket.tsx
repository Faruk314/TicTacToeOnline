import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../redux/hooks";

type SocketContextData = {
  socket: Socket | null;
};

const initialSocketContextData: SocketContextData = {
  socket: null,
};

export const SocketContext = createContext<SocketContextData>(
  initialSocketContextData
);

type SocketContextProviderProps = {
  children: ReactNode;
};

export const SocketContextProvider = ({
  children,
}: SocketContextProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const [cookies, setCookie] = useCookies(["token"]);

  console.log(cookies);

  useEffect(() => {
    if (isLoggedIn) {
      const token = cookies.token;

      if (token) {
        setCookie("token", token);
      }
    }
  }, [isLoggedIn, setCookie, cookies]);

  useEffect(() => {
    let newSocket: any;

    if (cookies.token && isLoggedIn) {
      newSocket = io("http://localhost:4001", {
        auth: {
          token: cookies.token,
        },
      });
    }

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [cookies, isLoggedIn]);

  const contextValue: SocketContextData = {
    socket,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
