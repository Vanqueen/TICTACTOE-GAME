function Square({ value, isWinning, onSquareClick }) {
  const baseStyle = "w-20 h-20 border-2 text-3xl font-bold flex items-center justify-center cursor-pointer";
  const valueStyle =
    value === "X"
      ? "text-red-400"
      : value === "O"
      ? "text-blue-400"
      : "text-gray-600";

  const winningStyle = isWinning ? "bg-green-200" : "";

  return (
    <button type="button" onClick={onSquareClick}
      className={`${baseStyle} ${winningStyle}`}
    >
      <span
        className={`${valueStyle}`}
      >
        {value}
      </span>
    </button>
  );
}

export default Square;
