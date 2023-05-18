function getStartingBoard() {
  return [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ];
}

function getBoardDictionary(board) {
  //TODO mislim da mi ovo na kraju neće trebati
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const result = {};
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      result[letters[j] + (8 - i)] = {
        id: letters[j] + (8 - i),
        isDark: (i + j) % 2,
        piece: board[i][j],
      };
    }
  }
}

function movePiece(
  history,
  moveNumber,
  whiteToMove,
  startx,
  starty,
  endx,
  endy
) {
  const board = history[moveNumber].board;
  if (!checkMove(history, moveNumber, whiteToMove, startx, starty, endx, endy))
    return null;
  const result = cloneBoard(board);
  //make a move:
  if (isEnPassant(history, moveNumber, startx, starty, endx, endy)) {
    result[startx][endy] = "";
  }
  if (isCastle(history, moveNumber, startx, starty, endx, endy)) {
    if (endy > starty) {
      result[endx][endy - 1] = board[endx][7];
      result[endx][7] = "";
    } else {
      result[endx][endy + 1] = board[endx][0];
      result[endx][0] = "";
    }
  }
  result[endx][endy] = board[startx][starty];
  result[startx][starty] = "";

  return result;
}

function cloneBoard(board) {
  const result = [];
  for (let i = 0; i < board.length; i++) {
    result[i] = board[i].map((p) => p);
  }
  return result;
}

function checkMove(
  history,
  moveNumber,
  whiteToMove,
  startx,
  starty,
  endx,
  endy
) {
  const board = history[moveNumber].board;
  //making sure the inputs are numbers:
  startx = Number(startx);
  starty = Number(starty);
  endx = Number(endx);
  endy = Number(endy);

  //if start and end are the same it's not a move
  if (startx === endx && starty === endy) return false;

  const piece = board[startx][starty];

  //check to see if a piece is selected
  if (!piece) return false;
  //check if it is a move by the correct player
  if (whiteToMove && piece === piece.toLowerCase()) return false;
  if (!whiteToMove && piece === piece.toUpperCase()) return false;

  const target = board[endx][endy];

  //you can't take your own piece
  if (
    target &&
    ((target === target.toLowerCase() && piece === piece.toLowerCase()) ||
      (target === target.toUpperCase() && piece === piece.toUpperCase()))
  )
    return false;

  //pawns:
  //can move two if they were in the second row:
  if (
    piece === "p" &&
    startx === 1 &&
    endx === 3 &&
    starty === endy &&
    !board[2][starty] &&
    !target
  )
    return true;
  if (
    piece === "P" &&
    startx === 6 &&
    endx === 4 &&
    starty === endy &&
    !board[5][starty] &&
    !target
  )
    return true;
  //can move one if nothing is there
  if (piece === "p" && endx === startx + 1 && starty === endy && !target)
    return true;
  if (piece === "P" && endx === startx - 1 && starty === endy && !target)
    return true;
  //can take to the side
  if (
    piece === "p" &&
    endx === startx + 1 &&
    Math.abs(endy - starty) === 1 &&
    target
  )
    return true;
  if (
    piece === "P" &&
    endx === startx - 1 &&
    Math.abs(endy - starty) === 1 &&
    target
  )
    return true;
  //en passant
  if (isEnPassant(history, moveNumber, startx, starty, endx, endy)) return true;
  //all other pawn moves are illegal
  if (piece.toLowerCase() === "p") return false;

  //rooks and queens:
  //can move on the same file if there is nothing between them and target
  if (
    (piece.toLowerCase() === "r" || piece.toLowerCase() === "q") &&
    starty === endy
  ) {
    for (let i = Math.min(startx, endx) + 1; i < Math.max(startx, endx); i++)
      if (board[i][starty]) return false;
    return true;
  }
  //can move on the same row if there is nothing between them and target
  if (
    (piece.toLowerCase() === "r" || piece.toLowerCase() === "q") &&
    startx === endx
  ) {
    for (let j = Math.min(starty, endy) + 1; j < Math.max(starty, endy); j++)
      if (board[startx][j]) return false;
    return true;
  }
  //all other rook moves are illegal
  if (piece.toLowerCase() === "r") return false;

  //bishops and queens:
  //can only move diagonally if there is nothing between them and target:
  if (
    (piece.toLowerCase() === "b" || piece.toLowerCase() === "q") &&
    Math.abs(endx - startx) === Math.abs(endy - starty)
  ) {
    for (let i = 1; i < Math.abs(endx - startx); i++)
      if (
        board[startx + Math.sign(endx - startx) * i][
          starty + Math.sign(endy - starty) * i
        ]
      )
        return false;
    return true;
  }
  //all other bishop or queen moves are illegal
  if (piece.toLowerCase() === "b" || piece.toLowerCase() === "q") return false;

  //kings:
  //can move only one square in any direction
  if (
    piece.toLowerCase() === "k" &&
    Math.abs(endx - startx) <= 1 &&
    Math.abs(endy - starty) <= 1
  )
    return true;
  //TODO dodaj rokiranje
  if (isCastle(history, moveNumber, startx, starty, endx, endy)) return true;
  //all other king moves are illegal
  if (piece.toLowerCase() === "k") return false;

  //knights:
  //can move in L shape
  if (
    piece.toLowerCase() === "n" &&
    startx !== endx &&
    starty !== endy &&
    Math.abs(endx - startx) + Math.abs(endy - starty) === 3
  )
    return true;
  //all other knight moves are illegal
  if (piece.toLowerCase() === "n") return false;

  return null; //this should be unreachable
}

function isEnPassant(history, moveNumber, startx, starty, endx, endy) {
  const board = history[moveNumber].board;
  const piece = board[startx][starty];
  const target = board[endx][endy];
  if (
    piece === "p" &&
    endx === 5 &&
    endx === startx + 1 &&
    Math.abs(endy - starty) === 1 &&
    !target &&
    !board[6][endy] &&
    board[4][endy] === "P" &&
    history[moveNumber - 1].board[6][endy] === "P" &&
    !history[moveNumber - 1].board[4][endy]
  )
    return true;
  if (
    piece === "P" &&
    endx === 2 &&
    endx === startx - 1 &&
    Math.abs(endy - starty) === 1 &&
    !target &&
    !board[1][endy] &&
    board[3][endy] === "p" &&
    history[moveNumber - 1].board[1][endy] === "p" &&
    !history[moveNumber - 1].board[3][endy]
  )
    return true;
  return false;
}

function isCastle(history, moveNumber, startx, starty, endx, endy) {
  const board = history[moveNumber].board;
  const piece = board[startx][starty];
  const target = board[endx][endy];
  //black short castle
  if (
    piece === "k" &&
    startx === 0 &&
    starty === 4 &&
    endx === 0 &&
    endy === 6 &&
    !target &&
    !board[0][5] &&
    board[0][7] === "r"
  ) {
    for (let i = 0; i < moveNumber; i++) {
      if (history[i].board[0][4] !== "k" || history[i].board[0][7] !== "r")
        return false;
    }
    return true;
  }
  //black long castle
  if (
    piece === "k" &&
    startx === 0 &&
    starty === 4 &&
    endx === 0 &&
    endy === 2 &&
    !target &&
    !board[0][3] &&
    !board[0][1] &&
    board[0][0] === "r"
  ) {
    for (let i = 0; i < moveNumber; i++) {
      if (history[i].board[0][4] !== "k" || history[i].board[0][0] !== "r")
        return false;
    }
    return true;
  }
  //white short castle
  if (
    piece === "K" &&
    startx === 7 &&
    starty === 4 &&
    endx === 7 &&
    endy === 6 &&
    !target &&
    !board[7][5] &&
    board[7][7] === "R"
  ) {
    for (let i = 0; i < moveNumber; i++) {
      if (history[i].board[7][4] !== "K" || history[i].board[7][7] !== "R")
        return false;
    }
    return true;
  }
  //white long castle
  if (
    piece === "K" &&
    startx === 7 &&
    starty === 4 &&
    endx === 7 &&
    endy === 2 &&
    !target &&
    !board[7][3] &&
    !board[7][1] &&
    board[7][0] === "R"
  ) {
    for (let i = 0; i < moveNumber; i++) {
      if (history[i].board[7][4] !== "K" || history[i].board[7][0] !== "R")
        return false;
    }
    return true;
  }
  //not a castle
  return false;
}

function checkSelect(piece, whiteToMove) {
  if (!piece) return false;
  if (whiteToMove && piece.toUpperCase() === piece) return true;
  if (!whiteToMove && piece.toLowerCase() === piece) return true;
  return false;
}

function getMoveName(board, startx, starty, endx, endy) {
  //castling
  if (
    board[startx][starty].toUpperCase() === "K" &&
    Math.abs(endy - starty) === 2
  ) {
    if (endy > starty) return "O-O";
    else return "O-O-O";
  }
  //other moves
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  let result = board[startx][starty].toUpperCase();
  if (board[endx][endy]) result += "x";
  result += letters[endy] + (8 - endx);
  return result;
}

function findWinner(board) {
  let whiteKingFound = false;
  let blackKingFound = false;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === "K") {
        if (blackKingFound) return "";
        else whiteKingFound = true;
      }
      if (board[i][j] === "k") {
        if (whiteKingFound) return "";
        else blackKingFound = true;
      }
    }
  }
  return whiteKingFound ? "white" : "black";
}

const exportObj = {
  getStartingBoard,
  getBoardDictionary,
  cloneBoard,
  movePiece,
  checkSelect,
  getMoveName,
  findWinner,
};

export default exportObj;
