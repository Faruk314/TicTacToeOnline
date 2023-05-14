import React, { useEffect, useState } from "react";

const Board = () => {
  const [board, setBoard] = useState<string[][]>([]);
  const [playerTurn, setPlayerTurn] = useState("X");
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState("");

  console.log(board);

  const checkGameStatus = () => {
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
      if (playerTurn === "X") {
        setMessage("X-WINS");
      } else {
        setMessage("O-WINS");
      }

      return setIsGameOver(true);
    }

    let isDraw = board.flat().every((sign) => sign === "X" || sign === "O");

    if (isDraw) {
      setMessage("DRAW");

      return setIsGameOver(true);
    }

    setPlayerTurn(playerTurn === "X" ? "O" : "X");
  };

  const handleClick = (row: number, col: number) => {
    if (board[row][col] !== "") return;

    let newBoard = [...board];

    newBoard[row][col] = playerTurn;

    setBoard(newBoard);

    checkGameStatus();
  };

  useEffect(() => {
    const createBoard = () => {
      let board = [];

      for (let row = 0; row < 3; row++) {
        let row = [];
        for (let col = 0; col < 3; col++) {
          row.push("");
        }
        board.push(row);
      }

      setBoard(board);
    };

    createBoard();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      {message && <p className="mb-10 text-2xl font-bold">{message}</p>}
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((col, colIndex) => (
              <div
                onClick={() => !isGameOver && handleClick(rowIndex, colIndex)}
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
