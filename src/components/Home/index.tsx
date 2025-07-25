import { useState, useEffect, useCallback } from "react";
import { createModel, saveModel, loadModel } from "../../ai/model";
import TrainingProgress from "../TrainingProgress";
import { trainModel } from "../../ai/trainer";

type Board = (string | null)[];
type TrainingStatus = "idle" | "training" | "completed";
type AiLevel = "easy" | "medium" | "hard";

const TicTacToeAI = () => {
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
  const startTraining = useCallback(async (model) => {
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
    resetGame();
  }, [startTraining]);

  // تشخیص برنده بازی
  const calculateWinner = useCallback((squares) => {
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
    (index) => {
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
    (currentBoard, player) => {
      const moves = [];
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
      trainingStatus !== "completed" // تغییر شرط به completed نباشد
    )
      return;

    setAiThinking(true); // افزودن این خط برای نشان‌دادن وضعیت فکر کردن

    setTimeout(() => {
      // تبدیل وضعیت صفحه به ورودی مدل
      const input = board.map((cell) => {
        if (cell === "X") return 1;
        if (cell === "O") return -1;
        return 0;
      });

      // پیش‌بینی مدل
      let output;
      try {
        output = aiModel.run(input);
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

      if (aiLevel === "easy") {
        // سطح آسان: حرکات تصادفی
        bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      } else if (aiLevel === "medium") {
        // سطح متوسط: ترکیب حرکات بهینه و تصادفی
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
    (level) => {
      setAiLevel(level);
      resetGame();
    },
    [resetGame]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            Tic Tac Toe AI
          </h1>
          <p className="text-lg text-indigo-600">
            بازی با هوش مصنوعی مبتنی بر یادگیری تقویتی
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* بخش بازی */}
          {/* بخش بازی یا اسپینر آموزش */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-5">
            {trainingStatus === "training" ? (
              // نمایش اسپینر و پیام آموزش
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
                <p className="text-lg text-indigo-700 font-medium">
                  هوش مصنوعی در حال آموزش اولیه است...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  لطفاً صبر کنید. این فرآیند تنها یک‌بار انجام می‌شود.
                </p>
                <div className="w-full max-w-xs mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>پیشرفت</span>
                    <span>{trainingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${trainingProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              // نمایش صفحه بازی و عناصر مربوطه وقتی آموزش تمام شده
              <>
                <div className="flex justify-between items-center mb-5">
                  <div className="text-xl font-semibold text-gray-800">
                    {aiThinking ? (
                      <span className="flex items-center text-purple-600">
                        <span className="animate-pulse mr-2">⏳</span> هوش
                        مصنوعی در حال فکر کردن...
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
                  <button
                    onClick={resetGame}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    بازی جدید
                  </button>
                </div>

                {/* صفحه بازی */}
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
                  {board.map((cell, index) => (
                    <button
                      key={index}
                      onClick={() => handlePlayerMove(index)}
                      disabled={
                        !isPlayerTurn || winner || isDraw || aiThinking || cell
                      }
                      className={`aspect-square w-full rounded-xl text-5xl font-bold flex items-center justify-center
              ${
                cell === "X"
                  ? "bg-green-100 text-green-600 shadow-green"
                  : cell === "O"
                  ? "bg-red-100 text-red-600 shadow-red"
                  : "bg-indigo-50 hover:bg-indigo-100"
              }
              ${
                !cell && !winner && !isDraw && isPlayerTurn && !aiThinking
                  ? "cursor-pointer hover:shadow-md"
                  : "cursor-default"
              }
              transition-all duration-200 shadow-md`}
                    >
                      {cell === "X" ? "X" : cell === "O" ? "O" : ""}
                    </button>
                  ))}
                </div>

                {/* آمار سریع */}
                <div className="flex justify-center space-x-6">
                  <div className="text-center bg-green-50 p-3 rounded-xl w-24 shadow-sm">
                    <div className="text-2xl font-bold text-green-600">
                      {playerWins}
                    </div>
                    <div className="text-sm text-green-800">برد شما</div>
                  </div>
                  <div className="text-center bg-red-50 p-3 rounded-xl w-24 shadow-sm">
                    <div className="text-2xl font-bold text-red-600">
                      {aiWins}
                    </div>
                    <div className="text-sm text-red-800">برد AI</div>
                  </div>
                  <div className="text-center bg-yellow-50 p-3 rounded-xl w-24 shadow-sm">
                    <div className="text-2xl font-bold text-yellow-600">
                      {draws}
                    </div>
                    <div className="text-sm text-yellow-800">مساوی</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* پنل کنترل و اطلاعات */}
          <div className="bg-white rounded-2xl shadow-xl p-5">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              تنظیمات و اطلاعات
            </h2>

            {/* سطح دشواری */}
            <div className="mb-5">
              <label className="block text-gray-700 mb-2">
                سطح دشواری هوش مصنوعی
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "easy", label: "آسان", color: "bg-green-500" },
                  { id: "medium", label: "متوسط", color: "bg-yellow-500" },
                  { id: "hard", label: "سخت", color: "bg-red-500" },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => changeAiLevel(level.id)}
                    className={`py-2 rounded-lg transition-colors text-white ${
                      aiLevel === level.id
                        ? `${level.color} shadow-md`
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* وضعیت آموزش */}
            <div className="mb-5">
              <TrainingProgress
                progress={trainingProgress}
                status={trainingStatus}
              />
              <button
                onClick={retrainAI}
                disabled={trainingStatus === "training"}
                className="mt-3 w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors disabled:opacity-50"
              >
                {trainingStatus === "training"
                  ? "در حال آموزش..."
                  : "آموزش مجدد هوش مصنوعی"}
              </button>
            </div>

            {/* اطلاعات یادگیری تقویتی */}
            <div className="bg-indigo-50 rounded-xl p-4 mb-5 border border-indigo-100">
              <h3 className="font-bold text-indigo-800 mb-2 flex items-center">
                <span className="mr-2">🤖</span> یادگیری تقویتی (RL)
              </h3>
              <p className="text-sm text-indigo-700 mb-3">
                هوش مصنوعی با آزمون و خطا یاد می‌گیرد و برای هر حرکت پاداش
                دریافت می‌کند.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>برد هوش مصنوعی:</span>
                  <span className="font-bold text-green-600">+1</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>باخت هوش مصنوعی:</span>
                  <span className="font-bold text-red-600">-1</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>مساوی:</span>
                  <span className="font-bold text-yellow-600">+0.5</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>حرکت معتبر:</span>
                  <span className="font-bold text-gray-600">+0.01</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowStats(!showStats)}
              className="w-full py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center"
            >
              {showStats ? (
                <>
                  <span className="ml-2">↑</span> پنهان کردن جزئیات
                </>
              ) : (
                <>
                  <span className="ml-2">↓</span> نمایش جزئیات یادگیری
                </>
              )}
            </button>
          </div>
        </div>

        {/* بخش اطلاعات یادگیری */}
        {showStats && (
          <div className="mt-6 bg-white rounded-2xl shadow-xl p-5">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              جزئیات فنی پروژه
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2">
                  معماری شبکه عصبی
                </h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span> لایه ورودی: 9 نورون (هر خانه
                    صفحه)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span> لایه‌های پنهان: 128 و 64
                    نورون
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span> لایه خروجی: 9 نورون (احتمال
                    هر حرکت)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span> تابع فعال‌ساز: Leaky ReLU
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span> نرخ یادگیری: 0.01
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <h4 className="font-bold text-purple-800 mb-2">
                  فرآیند یادگیری تقویتی
                </h4>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-purple-700">
                  <li>شروع با مدل تصادفی بدون دانش اولیه</li>
                  <li>شبیه‌سازی 2000 بازی برای آموزش</li>
                  <li>به‌روزرسانی وزن‌ها بر اساس پاداش حرکات</li>
                  <li>ذخیره مدل آموزش‌دیده در localStorage</li>
                  <li>استفاده از مدل آموزش‌دیده در بازی واقعی</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 bg-green-50 p-4 rounded-xl border border-green-100">
              <h4 className="font-bold text-green-800 mb-2">
                تکنولوژی‌های استفاده شده
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-lg font-bold text-indigo-600">React</div>
                  <div className="text-xs text-gray-600">رابط کاربری</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-lg font-bold text-indigo-600">
                    Brain.js
                  </div>
                  <div className="text-xs text-gray-600">شبکه عصبی</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-lg font-bold text-indigo-600">
                    Tailwind
                  </div>
                  <div className="text-xs text-gray-600">استایل‌دهی</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicTacToeAI;
