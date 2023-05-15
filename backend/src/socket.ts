import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";

interface CustomSocket extends Socket {
  userId?: number;
}

export default function setupSocket() {
  const server = http.createServer();

  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket: CustomSocket, next) => {
    const token = socket.handshake.auth.token;

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number;
      };
      socket.userId = decodedToken.userId;
      next();
    } catch (error) {
      console.log(error);
    }
  });

  io.on("connection", (socket: CustomSocket) => {
    // Handle socket events
    console.log("New socket connection:", socket.userId);
  });

  io.listen(4001);
}
