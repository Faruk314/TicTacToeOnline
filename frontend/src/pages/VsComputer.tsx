import React, { useCallback, useEffect, useState } from "react";
import Player from "../cards/Player";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import SoundPlayer from "../components/SoundPlayer";
import { playClickSound } from "../redux/SoundSlice";

const VsComputer = () => {
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const computerInfo = {
    userId: 0,
    userName: "Computer",
    image: "/images/computer.png",
    score: 0,
  };

  const [playerTurn, setPlayerTurn] = useState("X");
  const [message, setMessage] = useState("");
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [board, setBoard] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [userTurn, setUserTurn] = useState(true);
  const [computerTurn, setComputerTurn] = useState(false);
  const difficulty = useAppSelector((state) => state.game.difficulty);
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const dispatch = useAppDispatch();

  console.log(computerTurn);

  const checkGameStatus = useCallback(() => {
    const caseOne =
      board[0][0] === playerTurn &&
      board[0][1] === playerTurn &&
      board[0][2] === playerTurn;
    const caseTwo =
      board[1][0] === playerTurn &&
      board[1][1] === playerTurn &&
      board[1][2] === playerTurn;
    const caseThree =
      board[2][0] === playerTurn &&
      board[2][1] === playerTurn &&
      board[2][2] === playerTurn;
    const caseFour =
      board[0][0] === playerTurn &&
      board[1][0] === playerTurn &&
      board[2][0] === playerTurn;
    const caseFive =
      board[0][1] === playerTurn &&
      board[1][1] === playerTurn &&
      board[2][1] === playerTurn;
    const caseSix =
      board[0][2] === playerTurn &&
      board[1][2] === playerTurn &&
      board[2][2] === playerTurn;
    const caseSeven =
      board[0][2] === playerTurn &&
      board[1][1] === playerTurn &&
      board[2][0] === playerTurn;
    const caseEight =
      board[0][0] === playerTurn &&
      board[1][1] === playerTurn &&
      board[2][2] === playerTurn;

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
      if (userTurn) {
        setMessage("You won!");
        setUserScore((prev) => prev + 1);
      }

      if (computerTurn) {
        setMessage("Computer won!");
        setComputerScore((prev) => prev + 1);
      }

      setIsRoundOver(true);
      return;
    }

    let isDraw = board.flat().every((sign) => sign === "X" || sign === "O");

    if (isDraw) {
      setMessage("DRAW");
      setIsRoundOver(true);
      return;
    }

    setPlayerTurn((prevPlayerTurn) => (prevPlayerTurn === "X" ? "O" : "X"));

    if (userTurn) {
      setComputerTurn(true);
      setUserTurn(false);
    }

    if (computerTurn) {
      setUserTurn(true);
      setComputerTurn(false);
    }
  }, [board, computerTurn, playerTurn, userTurn]);

  const playerMove = useCallback(
    async (row: number, col: number) => {
      if (userTurn) {
        dispatch(playClickSound("/sounds/boardClick.wav"));
      }

      if (board[row][col] !== "") return;

      let newBoard = [...board];
      newBoard[row][col] = playerTurn;

      setBoard(newBoard);

      checkGameStatus();
    },
    [board, checkGameStatus, dispatch, playerTurn, userTurn]
  );

  const handleComputerMove = () => {
    if (difficulty === "easy") {
      let firstRandomNum = Math.floor(Math.random() * 3);
      let secondRandomNum = Math.floor(Math.random() * 3);

      console.log(firstRandomNum, secondRandomNum);

      while (board[firstRandomNum][secondRandomNum] !== "") {
        firstRandomNum = Math.floor(Math.random() * 3);
        secondRandomNum = Math.floor(Math.random() * 3);
        console.log("ide");
      }

      playerMove(firstRandomNum, secondRandomNum);
    }
  };

  useEffect(() => {
    if (computerTurn && !isRoundOver) {
      handleComputerMove();
    }
  }, [computerTurn, difficulty, board, playerMove, isRoundOver]);

  return (
    <section className="">
      <Navbar singlePlayer={true} />

      <div className="flex justify-between mx-4 mt-10">
        <div className="flex flex-col items-center">
          <Player playerInfo={loggedUserInfo} singlePlayer={true} />
          <p className="text-4xl">{userScore}</p>
        </div>

        <div className="flex flex-col items-center">
          <Player playerInfo={computerInfo} />
          <p className="text-4xl">{computerScore}</p>
        </div>
      </div>

      {isRoundOver && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-center">{message}</p>
          <button
            onClick={() => {
              dispatch(playClickSound("/sounds/click.wav"));
              setBoard([
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
              ]);
              setIsRoundOver(false);
              setPlayerTurn("X");
              setComputerTurn(false);
              setUserTurn(true);
            }}
            className="px-2 py-1 font-bold bg-white border-2 border-black rounded-full hover:bg-gray-200 disabled:"
          >
            Play again
          </button>
        </div>
      )}

      <div className="flex justify-center mt-20">
        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((col, colIndex) => (
                <div
                  onClick={() => {
                    if (computerTurn === false && !isRoundOver) {
                      playerMove(rowIndex, colIndex);
                    }
                  }}
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

      <SoundPlayer />
    </section>
  );
};

export default VsComputer;
