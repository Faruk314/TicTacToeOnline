import React from "react";

const Board = () => {
  const createCell = (row: number, col: number) => {
    return (
      <div className="w-20 h-20 border border-gray-200">{`${row}, ${col}`}</div>
    );
  };

  return <div>{createCell(1, 2)}</div>;
};

export default Board;
