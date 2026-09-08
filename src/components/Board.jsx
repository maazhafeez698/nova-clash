import Cell from "./Cell.jsx";

export default function Board({
  board,
  winLine,
  onCellClick,
  disabled,
  currentPlayer,
}) {
  return (
    <div
      role="group"
      aria-label="Tic Tac Toe board"
      className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full p-5 sm:p-6"
    >
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          ghost={currentPlayer}
          disabled={disabled}
          highlight={winLine?.includes(index)}
          onClick={() => onCellClick(index)}
          label={
            value
              ? `Cell ${index + 1}, marked ${value}`
              : `Cell ${index + 1}, empty`
          }
        />
      ))}
    </div>
  );
}
