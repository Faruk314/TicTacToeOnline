import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useCookies } from "react-cookie";
import { useAppSelector } from "../redux/hooks";

export const useSocket = (): Socket | null => {
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

  return socket;
};
