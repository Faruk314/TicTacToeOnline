import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import query from "./db";
import { InviteInfo, PlayerMove, Request, User } from "./types/custom";
import { v4 as uuidv4 } from "uuid";
import { Game } from "./types/custom";
import { Redis } from "ioredis";

const client = new Redis({
  host: "localhost",
  port: 6379,
});

const checkGameStatus = async (gameId: string) => {
  const data = await client.get(gameId);

  if (!data) {
    console.log("gameState not found in Redis");
    return false;
  }

  const gameState = JSON.parse(data);

  const caseOne =
    gameState.board[0][0] === gameState.playerTurn &&
    gameState.board[0][1] === gameState.playerTurn &&
    gameState.board[0][2] === gameState.playerTurn;
  const caseTwo =
    gameState.board[1][0] === gameState.playerTurn &&
    gameState.board[1][1] === gameState.playerTurn &&
    gameState.board[1][2] === gameState.playerTurn;
  const caseThree =
    gameState.board[2][0] === gameState.playerTurn &&
    gameState.board[2][1] === gameState.playerTurn &&
    gameState.board[2][2] === gameState.playerTurn;
  const caseFour =
    gameState.board[0][0] === gameState.playerTurn &&
    gameState.board[1][0] === gameState.playerTurn &&
    gameState.board[2][0] === gameState.playerTurn;
  const caseFive =
    gameState.board[0][1] === gameState.playerTurn &&
    gameState.board[1][1] === gameState.playerTurn &&
    gameState.board[2][1] === gameState.playerTurn;
  const caseSix =
    gameState.board[0][2] === gameState.playerTurn &&
    gameState.board[1][2] === gameState.playerTurn &&
    gameState.board[2][2] === gameState.playerTurn;
  const caseSeven =
    gameState.board[0][2] === gameState.playerTurn &&
    gameState.board[1][1] === gameState.playerTurn &&
    gameState.board[2][0] === gameState.playerTurn;
  const caseEight =
    gameState.board[0][0] === gameState.playerTurn &&
    gameState.board[1][1] === gameState.playerTurn &&
    gameState.board[2][2] === gameState.playerTurn;

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
    gameState.message = "WIN";
    gameState.isRoundOver = true;

    return client.set(gameId, JSON.stringify(gameState));
  }

  let isDraw = gameState.board
    .flat()
    .every((sign) => sign === "X" || sign === "O");

  if (isDraw) {
    gameState.message = "DRAW";
    gameState.isRoundOver = true;

    return client.set(gameId, JSON.stringify(gameState));
  }

  gameState.playerTurn = gameState.playerTurn === "X" ? "O" : "X";

  return client.set(gameId, JSON.stringify(gameState));
};

const playerMove = async (
  row: number,
  col: number,
  gameId: string,
  playerId: number
) => {
  const data = await client.get(gameId);

  if (!data) {
    console.log("gameState not found on Redis");
    return;
  }

  const gameState: Game = JSON.parse(data);

  if (gameState.isGameOver === true || gameState.isRoundOver === true) {
    return false;
  }

  if (gameState.players.X.userId !== playerId && gameState.playerTurn === "X")
    return false;

  if (gameState.players.O.userId !== playerId && gameState.playerTurn === "O")
    return false;

  if (gameState.board[row][col] != "") {
    return false;
  }

  gameState.board[row][col] = gameState.playerTurn;

  await client.set(gameId, JSON.stringify(gameState));

  return true;
};

const createNewGame = (senderInfo: User, receiverInfo: User): Game => ({
  board: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  playerTurn: "X",
  isRoundOver: false,
  isGameOver: false,
  message: "",
  players: {
    X: {
      userId: senderInfo.userId,
      userName: senderInfo.userName,
      image: senderInfo.image,
      score: 0,
    },
    O: {
      userId: receiverInfo.userId,
      userName: receiverInfo.userName,
      image: receiverInfo.image,
      score: 0,
    },
  },
  messages: [],
  totalRounds: 5,
  winner: null,
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
  let usersLookingForMatch: number[] = [];

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

    socket.on("reconnectToRoom", (gameRoomId: string) => {
      if (gameRoomId && socket.userId) {
        const userSocketId = getUser(socket.userId);

        if (userSocketId) {
          const userSocket: Socket | undefined =
            io.sockets.sockets.get(userSocketId);

          if (userSocket) {
            userSocket.join(gameRoomId);
          }
        }
      }
    });

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

      const inviteInfo: InviteInfo = {
        senderSocketId,
        receiverSocketId,
      };

      await client.set(senderId.toString(), JSON.stringify(inviteInfo));
      await client.set(receiverId.toString(), JSON.stringify(inviteInfo));

      let q =
        "SELECT u.user_id AS userId, u.user_name AS userName, u.image FROM users u WHERE u.user_id = ?";

      let senderInfo: any = await query(q, [senderId]);

      q =
        "SELECT u.user_id AS userId, u.user_name AS userName, u.image FROM users u WHERE u.user_id = ?";

      let receiverInfo: any = await query(q, [receiverId]);

      io.to(receiverSocketId).emit("gameInvite", senderInfo[0]);
      io.to(senderSocketId).emit("gameInvitePending", receiverInfo[0]);
    });

    socket.on("findMatch", () => {
      if (socket.userId) {
        if (!usersLookingForMatch.includes(socket.userId)) {
          usersLookingForMatch.push(socket.userId);
        }
      }

      if (usersLookingForMatch.length > 1) {
        const playerOneId = usersLookingForMatch[0];
        const playerTwoId = usersLookingForMatch[1];

        usersLookingForMatch = usersLookingForMatch.filter(
          (playerId) => playerId !== playerOneId && playerId !== playerTwoId
        );

        const socketId = getUser(playerOneId);

        if (!socketId) return;

        io.to(socketId).emit("matchFound", {
          senderId: playerOneId,
          receiverId: playerTwoId,
        });
      }
    });

    socket.on("cancelFindMatch", () => {
      if (socket.userId) {
        usersLookingForMatch = usersLookingForMatch.filter(
          (userId) => userId !== socket.userId
        );
      }
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

        let q =
          "SELECT u.user_id AS userId, u.user_name AS userName, u.image FROM users u WHERE u.user_id = ?";

        let senderInfo: any = await query(q, [senderId]);

        q =
          "SELECT u.user_id AS userId, u.user_name AS userName, u.image FROM users u WHERE u.user_id = ?";

        let receiverInfo: any = await query(q, [receiverId]);

        const gameState: Game = createNewGame(senderInfo[0], receiverInfo[0]);

        await client.set(gameRoomId, JSON.stringify(gameState));

        await client.del(receiverId.toString());
        await client.del(senderId.toString());

        io.to(receiverSocketId).emit("gameStart", gameRoomId);
        io.to(senderSocketId).emit("gameStart", gameRoomId);
      }
    });

    socket.on("cancelInvite", async () => {
      if (!socket.userId) {
        console.log("User not authenticated");
        return;
      }

      const data = await client.get(socket.userId.toString());

      if (!data) return console.log("Could not retrieve invite data");

      let inviteInfo: InviteInfo = JSON.parse(data);

      io.to(inviteInfo.senderSocketId).emit("inviteCanceled");
      io.to(inviteInfo.receiverSocketId).emit("inviteCanceled");
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

        if (!gameState) return;

        if (gameState.isGameOver === true) return;

        io.to(userSocketId).emit("gameStateResponse", gameState);
      });
    });

    socket.on("playerMove", async (data: PlayerMove) => {
      const playerId: number | undefined = socket.userId;

      if (!playerId) return;

      if (!(await playerMove(data.row, data.col, data.gameId, playerId)))
        return;

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

        // ...

        const playerXSocketId = getUser(gameState.players.X.userId);
        const playerOSocketId = getUser(gameState.players.O.userId);

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
      async ({
        message,
        roomId,
        senderName,
      }: {
        message: string;
        roomId: string;
        senderName: string;
      }) => {
        const msg = {
          id: uuidv4(),
          message,
          senderName,
        };

        io.to(roomId).emit("receiveMessage", msg);

        const data = await client.get(roomId);

        if (!data) {
          console.log("Error retrieving game state");
          return;
        }

        const gameState: Game = JSON.parse(data);

        gameState.messages.push(msg);

        await client.set(roomId, JSON.stringify(gameState));
      }
    );

    socket.on("newRound", async (gameId: string) => {
      const data = await client.get(gameId);

      if (!data) return console.log("Could not retrieve gameState");

      let gameState: Game = JSON.parse(data);

      gameState.board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];

      if (gameState.isRoundOver && gameState.message === "WIN") {
        gameState.totalRounds -= 1;
      }

      if (
        gameState.isRoundOver &&
        gameState.playerTurn === "X" &&
        gameState.message === "WIN"
      ) {
        gameState.players.X.score += 1;
      }

      if (
        gameState.isRoundOver &&
        gameState.playerTurn === "O" &&
        gameState.message === "WIN"
      ) {
        gameState.players.O.score += 1;
      }

      if (
        gameState.totalRounds === 0 ||
        gameState.players.X.score === 3 ||
        gameState.players.O.score === 3
      ) {
        gameState.isGameOver = true;

        if (gameState.players.X.score > gameState.players.O.score) {
          gameState.winner = gameState.players.X.userId;
        } else {
          gameState.winner = gameState.players.O.userId;
        }
      }

      gameState.isRoundOver = false;

      io.to(gameId).emit("gameStateResponse", gameState);

      if (gameState.isGameOver === true) {
        await client.del(gameId);
        return;
      }

      await client.set(gameId, JSON.stringify(gameState));
    });

    socket.on(
      "leaveGame",
      async ({
        receiverId,
        gameId,
      }: {
        receiverId: number;
        gameId: string;
      }) => {
        const receiverSocketId = getUser(receiverId);

        if (!receiverSocketId) {
          return console.log("Receiver socketId not found (LeaveGame)");
        }

        await client.del(gameId);

        io.to(receiverSocketId).emit("opponentLeft");
      }
    );
  });

  io.listen(4001);
}
