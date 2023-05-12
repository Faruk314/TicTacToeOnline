import React, { useEffect, useState } from "react";

const Board = () => {
  const [board, setBoard] = useState<string[][]>([]);
  const [playerTurn, setPlayerTurn] = useState("X");

  console.log(board);

  const handleClick = (row: number, col: number) => {
    if (board[row][col] !== "") return;

    let newBoard = [...board];

    newBoard[row][col] = playerTurn;

    setBoard(newBoard);

    setPlayerTurn(playerTurn === "X" ? "O" : "X");
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
