import React from "react";

const Board = () => {
  const createCell = (row: number, col: number) => {
    return (
      <div className="w-[10rem] h-[10rem] border border-gray-200">{`${row}, ${col}`}</div>
    );
  };

  const createRow = (row: number) => {
    const cells = [];

    for (let col = 0; col < 3; col++) {
      cells.push(createCell(row, col));
    }

    return <div className="flex">{cells}</div>;
  };

  return <div>{createRow(1)}</div>;
};

export default Board;
