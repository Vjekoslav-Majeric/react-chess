import functions from "./functions.js";
import Square from "./Square";

import { useState } from "react";

export default function Board({history, moveNumber, handleMove }) {
  const [startx, setStartx] = useState(null);
  const [starty, setStarty] = useState(null);
  
  const board = history[moveNumber].board;
  const whiteToMove = history[moveNumber].whiteToMove;
  function handleClick(event, x, y) {
    if (startx === null && starty === null) {
      if (!functions.checkSelect(board[x][y], whiteToMove)) {
        event.currentTarget.blur();
        return;
      }
      setStartx(x);
      setStarty(y);
      return;
    }
    event.currentTarget.blur();
    const newBoard = functions.movePiece(
      history,
      moveNumber,
      whiteToMove,
      startx,
      starty,
      x,
      y
    );
    if (newBoard) {
      handleMove({
        moveName: functions.getMoveName(board, startx, starty, x, y),
        whiteToMove: !whiteToMove,
        board: newBoard,
      });
    }
    setStartx(null);
    setStarty(null);
  }

  function getSquares(board) {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];

    const result = [];
    for (let i = 0; i < board.length; i++) {
      result[i] = [];
      for (let j = 0; j < board[i].length; j++) {
        result[i][j] = (
          <Square
            key={letters[j] + (8 - i)}
            isDark={(i + j) % 2}
            id={letters[j] + (8 - i)}
            x={i}
            y={j}
            piece={board[i][j]}
            onClick={handleClick}
          />
        );
      }
    }
    return result;
  }

  return (
    <>
      {getSquares(board).map((row, index) => (
        <div className="row no-bottom-margin" key={index}>
          {/*squares will never be reordered so this key should be ok*/}
          {row}
        </div>
      ))}
    </>
  );
}
