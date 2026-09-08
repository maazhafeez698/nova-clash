import MiniBoard from "./MiniBoard.jsx";

export default function UltimateBoard({ state, onCellClick, disabled }) {
  const { boards, boardWinners, activeBoard, overallWinLine } = state;

  return (
    <div
      role="group"
      aria-label="Ultimate Tic Tac Toe meta-board"
      className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full p-4 sm:p-5 rounded-2xl border border-void-line bg-void-deep/40"
    >
      {boards.map((cells, boardIndex) => {
        const isLegal =
          !disabled &&
          boardWinners[boardIndex] === null &&
          (activeBoard === null || activeBoard === boardIndex);

        return (
          <MiniBoard
            key={boardIndex}
            boardIndex={boardIndex}
            cells={cells}
            winnerSymbol={boardWinners[boardIndex]}
            isActive={isLegal}
            metaHighlight={overallWinLine?.includes(boardIndex)}
            onCellClick={(cellIndex) => onCellClick(boardIndex, cellIndex)}
          />
        );
      })}
    </div>
  );
}
