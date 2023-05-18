import "./App.css";
import Board from "./Board";
import History from "./History";
import functions from "./functions.js";

import { useState } from "react";
function App() {
  const [text, setText] = useState(
    "STREET RULES: No need to say check and you win when you take the opponent's king."
  );
  const [winnerFound, setWinnerFound] = useState(false);
  const [history, setHistory] = useState([
    {
      moveName: "Game start",
      whiteToMove: true,
      board: functions.getStartingBoard(),
    },
  ]);
  const [displayedMove, setDisplayedMove] = useState(0);

  function handleMove(move) {
    if (winnerFound) return;
    setHistory([...history.slice(0, displayedMove + 1), move]);
    setDisplayedMove(displayedMove + 1);
    let winner = functions.findWinner(move.board);
    if (winner) {
      setText(
        "The winner is: " + winner.toUpperCase() + "! Refresh the page to play again."
      );
      setWinnerFound(true);
    }
  }

  function goToMove(moveNumber) {
    setDisplayedMove(moveNumber);
  }

  return (
    <div className="App row no-bottom-margin">
      <header className="col s12 l8">
        <Board
          history={history}
          moveNumber={displayedMove}
          handleMove={handleMove}
        />
      </header>
      <header className="col s12 l4">
        <label>{text}</label>
        <History history={history} goToMove={goToMove} />
      </header>
    </div>
  );
}

export default App;
