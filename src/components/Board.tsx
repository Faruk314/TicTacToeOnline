import React, { useEffect, useState } from "react";

const Board = () => {
  const [board, setBoard] = useState<string[][]>([]);
  const [playerTurn, setPlayerTurn] = useState("X");

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
        return console.log("x-win");
      } else {
        return console.log("O-wins");
      }
    }

    let isDraw = board.flat().every((sign) => sign === "X" || sign === "O");

    if (isDraw) {
      return console.log("draw");
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
    <div className="flex items-center justify-center h-[100vh]">
      <div>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((col, colIndex) => (
              <div
                onClick={() => handleClick(rowIndex, colIndex)}
                key={colIndex}
                className="w-[10rem] h-[10rem] border border-gray-200 flex items-center justify-center"
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
