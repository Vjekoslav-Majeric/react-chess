export default function History({ history, goToMove }) {
  return (
    <ul>
      {history.map((move, index) => (
        <li key={index}>
          {/*moves will never be reordered so this key should be ok*/}
          <button
            className={
              "waves-effect waves-light btn my-width " +
              (index === 0 ? "" : move.whiteToMove ? "black" : "white")
            }
            onClick={() => goToMove(index)}
          >
            {move.moveName}
          </button>
        </li>
      ))}
    </ul>
  );
}
