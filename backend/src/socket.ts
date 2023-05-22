import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import query from "./db";

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

  let users = new Map<number, string>();

  const addUser = (userId: number, socketId: string) => {
    if (!users.has(userId)) {
      users.set(userId, socketId);
    }
  };

  const removeUser = (socketId: string) => {
    const userEntries = [...users.entries()];

    const usersEntriesFilterd = userEntries.filter(
      ([_, value]) => value !== socketId
    );

    users = new Map(usersEntriesFilterd);
  };

  const getUser = (userId: number) => {
    return users.get(userId);
  };

  io.on("connection", (socket: CustomSocket) => {
    // Handle socket events
    console.log("New socket connection:", socket.userId);

    if (socket.userId) {
      addUser(socket.userId, socket.id);
    }

    socket.on("disconnect", () => {
      removeUser(socket.id);
    });

    socket.on(
      "sendFriendRequest",
      async ({
        senderId,
        receiverId,
      }: {
        senderId: number;
        receiverId: number;
      }) => {
        const receiverSocketId = getUser(receiverId);

        if (!receiverSocketId) return;

        let q = `SELECT u.user_id AS userId, u.user_name AS userName, u.image, fr.id, fr.status
        FROM friend_requests fr JOIN users u ON u.user_id = fr.sender WHERE fr.sender = ?`;

        let result: any = await query(q, [senderId]);

        io.to(receiverSocketId).emit("getFriendRequest", result[0]);
      }
    );
  });

  io.listen(4001);
}
