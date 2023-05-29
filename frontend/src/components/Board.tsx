import React, { useEffect, useState } from "react";
import {
  setBoard,
  setOtherPlayerInfo,
  setPlayerTurn,
  setSimbols,
} from "../redux/GameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { playClickSound } from "../redux/SoundSlice";
import { Game } from "../types/types";

interface Props {
  socket: any;
}

const Board = ({ socket }: Props) => {
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();
  const gameId = useAppSelector((state) => state.game.roomId);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const [playerOnMoveId, setPlayerOnMoveId] = useState<number | null>(null);
  const isGameOver = useAppSelector((state) => state.game.isGameOver);
  const board = useAppSelector((state) => state.game.board);

  useEffect(() => {}, []);

  useEffect(() => {
    socket?.emit("requestGameState", { gameId });

    socket?.on("gameStateResponse", (gameState: Game) => {
      console.log(gameState);
      dispatch(setBoard(gameState.board));
      dispatch(
        setSimbols({
          X: { userId: gameState.players.X.userId },
          O: { userId: gameState.players.O.userId },
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
        dispatch(setPlayerTurn("X"));
        setPlayerOnMoveId(loggedUserInfo.userId);
      }

      if (
        gameState.playerTurn === "O" &&
        gameState.players.O.userId === loggedUserInfo?.userId
      ) {
        dispatch(setPlayerTurn("O"));
        setPlayerOnMoveId(loggedUserInfo.userId);
      }
    });

    return () => {
      socket?.off("gameStateResponse");
    };
  }, [socket, gameId, loggedUserInfo?.userId, dispatch]);

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

    socket.emit("playerMove", { row, col, gameId });

    // let newBoard = [...board];

    // newBoard[row][col] = playerTurn;

    // setBoard(newBoard);

    // checkGameStatus();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {message && <p className="mb-10 text-2xl font-bold">{message}</p>}
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
