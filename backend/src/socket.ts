import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import query from "./db";
import { PlayerMove, Request } from "./types/custom";
import { v4 as uuidv4 } from "uuid";
import { Game } from "./types/custom";
import { Redis } from "ioredis";

const client = new Redis({
  host: "localhost",
  port: 6379,
});

const checkGameStatus = async (gameId: string) => {
  try {
    const result = await new Promise<string | null>((resolve, reject) => {
      client.get(gameId, (err, result: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });

    if (!result) {
      console.log("gameState not found");
      return;
    }

    const newState = JSON.parse(result);

    const caseOne =
      newState.board[0][0] === newState.playerTurn &&
      newState.board[0][1] === newState.playerTurn &&
      newState.board[0][2] === newState.playerTurn;
    const caseTwo =
      newState.board[1][0] === newState.playerTurn &&
      newState.board[1][1] === newState.playerTurn &&
      newState.board[1][2] === newState.playerTurn;
    const caseThree =
      newState.board[2][0] === newState.playerTurn &&
      newState.board[2][1] === newState.playerTurn &&
      newState.board[2][2] === newState.playerTurn;
    const caseFour =
      newState.board[0][0] === newState.playerTurn &&
      newState.board[1][0] === newState.playerTurn &&
      newState.board[2][0] === newState.playerTurn;
    const caseFive =
      newState.board[0][1] === newState.playerTurn &&
      newState.board[1][1] === newState.playerTurn &&
      newState.board[2][1] === newState.playerTurn;
    const caseSix =
      newState.board[0][2] === newState.playerTurn &&
      newState.board[1][2] === newState.playerTurn &&
      newState.board[2][2] === newState.playerTurn;
    const caseSeven =
      newState.board[0][2] === newState.playerTurn &&
      newState.board[1][1] === newState.playerTurn &&
      newState.board[2][0] === newState.playerTurn;
    const caseEight =
      newState.board[0][0] === newState.playerTurn &&
      newState.board[1][1] === newState.playerTurn &&
      newState.board[2][2] === newState.playerTurn;

    if (
      caseOne ||
      caseTwo ||
      caseThree ||
      caseFour ||
      caseFive ||
      caseSix ||
      caseSeven ||
      caseEight
    ) {
      if (newState.playerTurn === "X") {
        newState.message = "X-WINS";
      } else {
        newState.message = "O-WINS";
      }

      newState.isGameOver = true;

      return client.set(gameId, JSON.stringify(newState));
    }

    let isDraw = newState.board
      .flat()
      .every((sign) => sign === "X" || sign === "O");

    if (isDraw) {
      newState.message = "DRAW";
      newState.isGameOver = true;

      return client.set(gameId, JSON.stringify(newState));
    }

    newState.playerTurn = newState.playerTurn === "X" ? "O" : "X";

    return client.set(gameId, JSON.stringify(newState));
  } catch (err) {
    console.log(err);
  }
};

const playerMove = async (row: number, col: number, gameId: string) => {
  try {
    const result = await new Promise<string | null>((resolve, reject) => {
      client.get(gameId, (err, result: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });

    if (!result) {
      console.log("gameState not found");
      return;
    }

    const newState = JSON.parse(result);

    newState.board[row][col] = newState.playerTurn;

    await new Promise<void>((resolve, reject) => {
      client.set(gameId, JSON.stringify(newState), (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const createNewGame = (senderId: number, receiverId: number): Game => ({
  board: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  playerTurn: "X",
  isGameOver: false,
  message: "",
  players: { X: senderId, O: receiverId },
});

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

      let senderInfo: any = await query(q, [senderId]);

      q =
        "SELECT u.user_id AS userId, u.user_name AS userName, u.image FROM users u WHERE u.user_id = ?";

      let receiverInfo: any = await query(q, [receiverId]);

      io.to(receiverSocketId).emit("gameInvite", senderInfo[0]);
      io.to(senderSocketId).emit("gameInvitePending", receiverInfo[0]);
    });

    socket.on("acceptInvite", async ({ senderId, receiverId }: Request) => {
      const gameRoomId: string = uuidv4();

      const senderSocketId = getUser(senderId);
      const receiverSocketId = getUser(receiverId);

      if (!receiverSocketId || !senderSocketId) return;

      const senderSocket: Socket | undefined =
        io.sockets.sockets.get(senderSocketId);
      const receiverSocket: Socket | undefined =
        io.sockets.sockets.get(receiverSocketId);

      if (senderSocket && receiverSocket) {
        senderSocket.join(gameRoomId);
        receiverSocket.join(gameRoomId);

        const gameState: Game = createNewGame(senderId, receiverId);

        client.set(gameRoomId, JSON.stringify(gameState));

        io.to(receiverSocketId).emit("gameStart", gameRoomId);
        io.to(senderSocketId).emit("gameStart", gameRoomId);
      }
    });

    socket.on("requestGameState", async ({ gameId }: { gameId: string }) => {
      const userId: number | undefined = socket.userId;

      if (!userId) return;

      const userSocketId = getUser(userId);

      if (!userSocketId) return;

      client.get(gameId, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }

        const gameState = result ? JSON.parse(result) : null;

        io.to(userSocketId).emit("gameStateResponse", gameState);
      });
    });

    socket.on("playerMove", async (data: PlayerMove) => {
      await playerMove(data.row, data.col, data.gameId);

      await checkGameStatus(data.gameId);

      try {
        let gameState: Game = await new Promise((resolve, reject) => {
          client.get(data.gameId, (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
              return;
            }
            resolve(result ? JSON.parse(result) : null);
          });
        });

        if (!gameState) {
          console.log("gameState not found");
          return;
        }

        console.log(gameState);
        // ...

        const playerXSocketId = getUser(gameState.players.X);
        const playerOSocketId = getUser(gameState.players.O);

        if (!playerXSocketId || !playerOSocketId) {
          console.log("PlayerX or playerO socketId not found");
          return;
        }

        io.to(playerXSocketId).emit("gameStateResponse", gameState);
        io.to(playerOSocketId).emit("gameStateResponse", gameState);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on(
      "sendMessage",
      ({
        message,
        roomId,
        senderName,
      }: {
        message: string;
        roomId: string;
        senderName: string;
      }) => {
        io.to(roomId).emit("receiveMessage", {
          id: uuidv4(),
          message,
          senderName,
        });
      }
    );
  });

  io.listen(4001);
}
