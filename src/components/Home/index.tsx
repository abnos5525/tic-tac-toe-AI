import React, { useState, useEffect, useCallback } from "react";
import { Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import GameHeader from "./GameHeader";
import GameBoard from "./GameBoard";
import GameControls from "./GameControls";
import TechnicalDetails from "./TechnicalDetails";
import TrainingSpinner from "./TrainingSpinner";
import { createModel, saveModel, loadModel } from "../../ai/model";
import { trainModel } from "../../ai/trainer";
import type { Board, TrainingStatus, AiLevel } from "./types";

const TicTacToeAI: React.FC = () => {
  // حالت‌های بازی
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [aiThinking, setAiThinking] = useState<boolean>(false);
  const [aiWins, setAiWins] = useState<number>(0);
  const [playerWins, setPlayerWins] = useState<number>(0);
  const [draws, setDraws] = useState<number>(0);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [aiModel, setAiModel] = useState<any>(null);
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>("idle");
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [aiLevel, setAiLevel] = useState<AiLevel>("medium");

  // بارگذاری مدل از حافظه محلی
  useEffect(() => {
    const savedModel = loadModel();
    if (savedModel) {
      setAiModel(savedModel);
      setTrainingStatus("completed");
      setTrainingProgress(100);
    } else {
      const newModel = createModel();
      setAiModel(newModel);
      startTraining(newModel);
    }
  }, []);

  // لاگ وضعیت برای دیباگ
  useEffect(() => {
    console.log("Current state:", {
      isPlayerTurn,
      winner,
      isDraw,
      aiThinking,
      trainingStatus,
    });
  }, [isPlayerTurn, winner, isDraw, aiThinking, trainingStatus]);

  // شروع آموزش مدل
  const startTraining = useCallback(async (model: any) => {
    setTrainingStatus("training");
    setTrainingProgress(0);
    try {
      const trainedModel = await trainModel(model, 2000, (progress) =>
        setTrainingProgress(progress)
      );
      setAiModel(trainedModel);
      saveModel(trainedModel);
      setTrainingStatus("completed");
    } catch (error) {
      console.error("Training failed:", error);
      setTrainingStatus("idle");
    }
  }, []);

  // آموزش مجدد هوش مصنوعی
  const retrainAI = useCallback(() => {
    const newModel = createModel();
    setAiModel(newModel);
    startTraining(newModel);
    // resetGame(); // Handled by useEffect on trainingStatus change
  }, [startTraining]);

  // تشخیص برنده بازی
  const calculateWinner = useCallback((squares: Board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }, []);

  // حرکت بازیکن
  const handlePlayerMove = useCallback(
    (index: number) => {
      if (
        board[index] ||
        winner ||
        isDraw ||
        !isPlayerTurn ||
        aiThinking ||
        trainingStatus === "training"
      )
        return;
      const newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);
      const gameWinner = calculateWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
        setPlayerWins((prev) => prev + 1);
        return;
      }
      if (!newBoard.includes(null)) {
        setIsDraw(true);
        setDraws((prev) => prev + 1);
        return;
      }
      setIsPlayerTurn(false);
      // افزودن این خط برای فعال‌سازی حرکت هوش مصنوعی
      if (trainingStatus === "completed") {
        setAiThinking(true);
      }
    },
    [
      board,
      winner,
      isDraw,
      isPlayerTurn,
      aiThinking,
      trainingStatus,
      calculateWinner,
    ]
  );

  // یافتن حرکات برنده
  const findWinningMoves = useCallback(
    (currentBoard: Board, player: string) => {
      const moves: number[] = [];
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          const newBoard = [...currentBoard];
          newBoard[i] = player;
          if (calculateWinner(newBoard) === player) {
            moves.push(i);
          }
        }
      }
      return moves;
    },
    [calculateWinner]
  );

  // حرکت هوش مصنوعی
  const makeAIMove = useCallback(() => {
    if (
      !aiModel ||
      isPlayerTurn ||
      winner ||
      isDraw ||
      trainingStatus !== "completed"
    )
      return;
    setAiThinking(true);
    setTimeout(() => {
      // تبدیل وضعیت صفحه به ورودی مدل
      const input = board.map((cell) => {
        if (cell === "X") return 1;
        if (cell === "O") return -1;
        return 0;
      });
      // پیش‌بینی مدل
      let output: number[];
      try {
        output = aiModel.run(input) as number[];
      } catch (e) {
        console.error("AI prediction error:", e);
        output = Array(9).fill(0); // Fallback
      }
      // انتخاب حرکت بر اساس سطح دشواری
      let bestMove = -1;
      let validMoves = board
        .map((_, idx) => idx)
        .filter((idx) => board[idx] === null);
      // اگر هیچ حرکت معتبری وجود ندارد، بازی را تمام کن
      if (validMoves.length === 0) {
        setIsDraw(true);
        setDraws((prev) => prev + 1);
        setAiThinking(false);
        return;
      }
      if (aiLevel === "medium") {
        const winningMoves = findWinningMoves(board, "O");
        if (winningMoves.length > 0) {
          bestMove = winningMoves[0];
        } else {
          const blockingMoves = findWinningMoves(board, "X");
          if (blockingMoves.length > 0) {
            bestMove = blockingMoves[0];
          } else {
            // انتخاب از خروجی مدل با کمی تصادفی‌سازی
            const sortedMoves = validMoves
              .map((idx) => ({ idx, value: output[idx] }))
              .sort((a, b) => b.value - a.value);
            bestMove =
              Math.random() < 0.7
                ? sortedMoves[0].idx
                : sortedMoves[Math.floor(Math.random() * sortedMoves.length)]
                    .idx;
          }
        }
      } else {
        // سطح سخت: بهترین حرکت از مدل
        bestMove = validMoves.reduce(
          (bestIdx, idx) => (output[idx] > output[bestIdx] ? idx : bestIdx),
          validMoves[0]
        );
      }
      const newBoard = [...board];
      newBoard[bestMove] = "O";
      setBoard(newBoard);
      const gameWinner = calculateWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
        setAiWins((prev) => prev + 1);
      } else if (!newBoard.includes(null)) {
        setIsDraw(true);
        setDraws((prev) => prev + 1);
      } else {
        setIsPlayerTurn(true);
      }
      setAiThinking(false);
    }, 500);
  }, [
    aiModel,
    board,
    isPlayerTurn,
    winner,
    isDraw,
    trainingStatus,
    aiLevel,
    calculateWinner,
    findWinningMoves,
  ]);

  // اثر برای حرکت هوش مصنوعی
  useEffect(() => {
    if (!isPlayerTurn && !winner && !isDraw && trainingStatus === "completed") {
      makeAIMove();
    }
  }, [isPlayerTurn, winner, isDraw, aiThinking, trainingStatus, makeAIMove]);

  // شروع مجدد بازی
  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setIsDraw(false);
    setAiThinking(false);
  }, []);

  // تغییر سطح دشواری
  const changeAiLevel = useCallback(
    (level: AiLevel) => {
      setAiLevel(level);
      resetGame();
    },
    [resetGame]
  );

  // ریست کردن بازی بعد از آموزش مجدد
  useEffect(() => {
    if (trainingStatus === "completed") {
      resetGame();
    }
  }, [trainingStatus, resetGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <GameHeader />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* بخش بازی */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            {trainingStatus === "training" ? (
              <TrainingSpinner trainingProgress={trainingProgress} />
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
                  <div className="text-lg sm:text-xl font-semibold text-gray-800 min-h-[28px] sm:min-h-[32px]">
                    {aiThinking ? (
                      <span className="flex items-center text-purple-600">
                        <span className="animate-pulse mr-2 text-lg">⏳</span>{" "}
                        هوش مصنوعی در حال فکر کردن...
                      </span>
                    ) : trainingStatus === "training" ? (
                      <span className="flex items-center text-indigo-600">
                        <span className="animate-spin mr-2">🌀</span> در حال
                        آموزش هوش مصنوعی...
                      </span>
                    ) : winner ? (
                      <span
                        className={
                          winner === "X" ? "text-green-600" : "text-red-600"
                        }
                      >
                        {winner === "X"
                          ? "🎉 شما برنده شدید!"
                          : "🤖 هوش مصنوعی برنده شد!"}
                      </span>
                    ) : isDraw ? (
                      <span className="text-yellow-600">😐 بازی مساوی شد!</span>
                    ) : (
                      <span
                        className={
                          isPlayerTurn ? "text-green-600" : "text-gray-500"
                        }
                      >
                        {isPlayerTurn ? "نوبت شما (X)" : "نوبت هوش مصنوعی (O)"}
                      </span>
                    )}
                  </div>
                  <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    onClick={resetGame}
                    disabled={trainingStatus === "training"}
                    className="w-full sm:w-auto"
                  >
                    بازی جدید
                  </Button>
                </div>

                <GameBoard
                  board={board}
                  handlePlayerMove={handlePlayerMove}
                  isPlayerTurn={isPlayerTurn}
                  winner={winner}
                  isDraw={isDraw}
                  aiThinking={aiThinking}
                  playerWins={playerWins}
                  aiWins={aiWins}
                  draws={draws}
                />
              </>
            )}
          </div>

          {/* پنل کنترل و اطلاعات */}
          <GameControls
            aiLevel={aiLevel}
            changeAiLevel={changeAiLevel}
            trainingProgress={trainingProgress}
            trainingStatus={trainingStatus}
            retrainAI={retrainAI}
            showStats={showStats}
            setShowStats={setShowStats}
          />
        </div>

        {/* بخش اطلاعات یادگیری */}
        {showStats && <TechnicalDetails />}
      </div>
    </div>
  );
};

export default TicTacToeAI;
