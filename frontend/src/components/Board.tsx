import React, { useEffect, useState, useCallback, useContext } from "react";
import { SocketContext } from "../context/socket";
import GameOver from "../modals/GameOver";
import {
  retrieveMessages,
  setBoard,
  setOtherPlayerInfo,
  setPlayerTurn,
  setRoundState,
  setPlayerStats,
  setGameOver,
  setWinner,
  setTotalRounds,
} from "../redux/GameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { playClickSound } from "../redux/SoundSlice";
import { Game } from "../types/types";

const Board = () => {
  const dispatch = useAppDispatch();
  const gameId = useAppSelector((state) => state.game.roomId);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const [playerOnMoveId, setPlayerOnMoveId] = useState<number | null>(null);
  const isGameOver = useAppSelector((state) => state.game.isGameOver);
  const board = useAppSelector((state) => state.game.board);
  const isRoundOver = useAppSelector((state) => state.game.isRoundOver);
  const { socket } = useContext(SocketContext);

  const handleGameStateResponse = useCallback(
    (gameState: Game) => {
      console.log(gameState);
      dispatch(setPlayerTurn(gameState.playerTurn));
      dispatch(setTotalRounds(gameState.totalRounds));
      dispatch(setRoundState(gameState.isRoundOver));
      dispatch(setGameOver(gameState.isGameOver));
      dispatch(setWinner(gameState.winner));

      if (gameState.isRoundOver) {
        dispatch(setRoundState(gameState.isRoundOver));
        socket?.emit("newRound", gameId);
        return;
      }

      dispatch(setBoard(gameState.board));
      dispatch(retrieveMessages(gameState.messages));

      dispatch(
        setPlayerStats({
          X: {
            userId: gameState.players.X.userId,
            score: gameState.players.X.score,
          },
          O: {
            userId: gameState.players.O.userId,
            score: gameState.players.O.score,
          },
        })
      );

      if (gameState.players.X.userId === loggedUserInfo?.userId) {
        dispatch(setOtherPlayerInfo(gameState.players.O));
      }

      if (gameState.players.O.userId === loggedUserInfo?.userId) {
        dispatch(setOtherPlayerInfo(gameState.players.X));
      }

      if (
        gameState.playerTurn === "X" &&
        gameState.players.X.userId === loggedUserInfo?.userId
      ) {
        setPlayerOnMoveId(loggedUserInfo.userId);
      }

      if (
        gameState.playerTurn === "O" &&
        gameState.players.O.userId === loggedUserInfo?.userId
      ) {
        setPlayerOnMoveId(loggedUserInfo.userId);
      }
    },
    [dispatch, loggedUserInfo?.userId, gameId, socket]
  );

  useEffect(() => {
    if (loggedUserInfo) {
      socket?.emit("requestGameState", { gameId });
    }
  }, [gameId, socket, loggedUserInfo]);

  useEffect(() => {
    if (loggedUserInfo) {
      socket?.on("gameStateResponse", handleGameStateResponse);
    }

    return () => {
      if (loggedUserInfo) {
        socket?.off("gameStateResponse", handleGameStateResponse);
      }
    };
  }, [socket, loggedUserInfo]);

  // const checkGameStatus = (playerTurn: string) => {
  //   const caseOne =
  //     board[0][0] === playerTurn &&
  //     board[0][1] === playerTurn &&
  //     board[0][2] === playerTurn;
  //   const caseTwo =
  //     board[1][0] === playerTurn &&
  //     board[1][1] === playerTurn &&
  //     board[1][2] === playerTurn;
  //   const caseThree =
  //     board[2][0] === playerTurn &&
  //     board[2][1] === playerTurn &&
  //     board[2][2] === playerTurn;
  //   const caseFour =
  //     board[0][0] === playerTurn &&
  //     board[1][0] === playerTurn &&
  //     board[2][0] === playerTurn;
  //   const caseFive =
  //     board[0][1] === playerTurn &&
  //     board[1][1] === playerTurn &&
  //     board[2][1] === playerTurn;
  //   const caseSix =
  //     board[0][2] === playerTurn &&
  //     board[1][2] === playerTurn &&
  //     board[2][2] === playerTurn;
  //   const caseSeven =
  //     board[0][2] === playerTurn &&
  //     board[1][1] === playerTurn &&
  //     board[2][0] === playerTurn;
  //   const caseEight =
  //     board[0][0] === playerTurn &&
  //     board[1][1] === playerTurn &&
  //     board[2][2] === playerTurn;

  //   if (
  //     caseOne ||
  //     caseTwo ||
  //     caseThree ||
  //     caseFour ||
  //     caseFive ||
  //     caseSix ||
  //     caseSeven ||
  //     caseEight
  //   ) {
  //     if (playerTurn === "X") {
  //       setMessage("X-WINS");
  //     } else {
  //       setMessage("O-WINS");
  //     }

  //     return setIsGameOver(true);
  //   }

  //   let isDraw = board.flat().every((sign) => sign === "X" || sign === "O");

  //   if (isDraw) {
  //     setMessage("DRAW");

  //     return setIsGameOver(true);
  //   }

  //   setPlayerTurn(playerTurn === "X" ? "O" : "X");
  // };

  const playerMove = (row: number, col: number) => {
    if (board[row][col] !== "") return;

    if (playerOnMoveId !== loggedUserInfo?.userId) return;

    dispatch(playClickSound("/sounds/boardClick.wav"));

    if (!isRoundOver) {
      socket?.emit("playerMove", { row, col, gameId });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {isGameOver && <GameOver />}
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((col, colIndex) => (
              <div
                onClick={() => !isGameOver && playerMove(rowIndex, colIndex)}
                key={colIndex}
                className="flex items-center justify-center w-[6rem] h-[6rem] rounded-md hover:cursor-pointer"
              >
                <span className="text-[5rem]">{col}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
