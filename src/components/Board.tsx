import React from "react";

const Board = () => {
  const createCell = (row: number, col: number) => {
    return (
      <div
        key={`${row}-${col}`}
        className="w-[10rem] h-[10rem] border border-gray-200"
      >{`${row}, ${col}`}</div>
    );
  };

  const createRow = (row: number) => {
    const cells = [];

    for (let col = 0; col < 3; col++) {
      cells.push(createCell(row, col));
    }

    return <div className="flex">{cells}</div>;
  };

  const createBoard = () => {
    const board = [];

    for (let row = 0; row < 3; row++) {
      board.push(createRow(row));
    }

    return <div>{board}</div>;
  };

  return (
    <div className="flex items-center justify-center h-[100vh]">
      {createBoard()}
    </div>
  );
};

export default Board;
