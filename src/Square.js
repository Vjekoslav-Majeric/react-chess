import Piece from "react-chess-pieces";

export default function Square({ isDark, id, x, y, piece, onClick }) {
  return (
    <button
      className={
        (isDark ? "dark" : "light") +
        " square col s1" +
        " center-align valign-wrapper no-padding"
      }
      onClick={(event) => onClick(event, x, y)}
    >
      <Piece piece={piece} />
    </button>
  );
}
