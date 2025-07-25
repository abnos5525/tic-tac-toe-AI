import React from "react";
import { Button } from "antd";

interface GameBoardProps {
  board: (string | null)[];
  handlePlayerMove: (index: number) => void;
  isPlayerTurn: boolean;
  winner: string | null;
  isDraw: boolean;
  aiThinking: boolean;
  playerWins: number;
  aiWins: number;
  draws: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  handlePlayerMove,
  isPlayerTurn,
  winner,
  isDraw,
  aiThinking,
  playerWins,
  aiWins,
  draws,
}) => {
  return (
    <>
      {/* صفحه بازی - اندازه بزرگتر و بهتر */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-[300px] sm:max-w-[350px] mx-auto mb-6">
        {board.map((cell, index) => (
          <Button
            key={index}
            onClick={() => handlePlayerMove(index)}
            disabled={
              !isPlayerTurn || !!winner || isDraw || aiThinking || cell !== null
            }
            className={`
              !aspect-square !w-full !min-h-[80px] sm:!min-h-[100px] !rounded-xl !text-4xl sm:!text-5xl !font-bold !flex !items-center !justify-center
              ${cell === "X"
                ? "!bg-green-100 !text-green-600 hover:!bg-green-200 active:!bg-green-300 !border-green-300"
                : cell === "O"
                ? "!bg-red-100 !text-red-600 hover:!bg-red-200 active:!bg-red-300 !border-red-300"
                : "!bg-indigo-50 hover:!bg-indigo-100 active:!bg-indigo-200 !border-indigo-200"}
              ${!cell &&
              !winner &&
              !isDraw &&
              isPlayerTurn &&
              !aiThinking
                ? "hover:!shadow-md active:!shadow-inner cursor-pointer"
                : "cursor-default"}
              !transition-all !duration-200 !shadow-md !border-2
            `}
            size="large"
          >
            {cell === "X" ? "X" : cell === "O" ? "O" : ""}
          </Button>
        ))}
      </div>

      {/* آمار سریع */}
      <div className="flex justify-center space-x-4 sm:space-x-6">
        <div className="text-center bg-green-50 p-3 rounded-xl w-20 sm:w-24 shadow-sm border border-green-100">
          <div className="text-xl sm:text-2xl font-bold text-green-600">{playerWins}</div>
          <div className="text-xs sm:text-sm text-green-800">برد شما</div>
        </div>
        <div className="text-center bg-red-50 p-3 rounded-xl w-20 sm:w-24 shadow-sm border border-red-100">
          <div className="text-xl sm:text-2xl font-bold text-red-600">{aiWins}</div>
          <div className="text-xs sm:text-sm text-red-800">برد AI</div>
        </div>
        <div className="text-center bg-yellow-50 p-3 rounded-xl w-20 sm:w-24 shadow-sm border border-yellow-100">
          <div className="text-xl sm:text-2xl font-bold text-yellow-600">{draws}</div>
          <div className="text-xs sm:text-sm text-yellow-800">مساوی</div>
        </div>
      </div>
    </>
  );
};

export default GameBoard;