import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import query from "./db";
import { Request } from "./types/custom";

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
      async ({ senderId, receiverId }: Request) => {
        const receiverSocketId = getUser(receiverId);

        if (!receiverSocketId) return;

        let q = `SELECT u.user_id AS userId, u.user_name AS userName, u.image, fr.id, fr.status
        FROM friend_requests fr JOIN users u ON u.user_id = fr.sender WHERE fr.sender = ?`;

        let result: any = await query(q, [senderId]);

        io.to(receiverSocketId).emit("getFriendRequest", result[0]);
      }
    );

    socket.on(
      "deleteFriend",
      async ({ userId, requestId }: { userId: number; requestId: number }) => {
        const userSocketId = getUser(userId);

        if (!userSocketId) return;

        io.to(userSocketId).emit("deletedFromFriends", requestId);
      }
    );

    socket.on("sendInvite", async ({ senderId, receiverId }: Request) => {
      const receiverSocketId = getUser(receiverId);
      const senderSocketId = getUser(senderId);

      if (!receiverSocketId || !senderSocketId) return;

      let q =
        "SELECT u.user_id AS userId, u.user_name AS userName, u.image FROM users u WHERE u.user_id = ?";

      let result: any = await query(q, [senderId]);
      const message = `Waiting for player to accept the game invite`;

      io.to(receiverSocketId).emit("gameInvite", result[0]);
      io.to(senderSocketId).emit("gameInvitePending", message);
    });

    socket.on("acceptInvite", async ({ senderId, receiverId }: Request) => {});
  });

  io.listen(4001);
}
