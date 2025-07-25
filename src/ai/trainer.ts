const boardToInput = (board) => {
  return board.map(cell => cell === 'X' ? 1 : cell === 'O' ? -1 : 0);
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export const trainModel = async (
  model,
  episodes = 2000,
  updateProgress = () => {}
) => {
  const winReward = 1;
  const loseReward = -1;
  const drawReward = 0.5;
  const stepReward = 0.01;

  // Initialize the network with a dummy training step
  const dummyInput = Array(9).fill(0);
  const dummyOutput = Array(9).fill(0);
  model.train([{ input: dummyInput, output: dummyOutput }], {
    iterations: 1,
    log: false,
  });

  // تابع برای شبیه‌سازی بازی
  const simulateGame = () => {
    let board = Array(9).fill(null);
    let currentPlayer = "X";
    let gameHistory = [];

    // ادامه بازی تا زمانی که برنده‌ای مشخص شود یا مساوی
    while (true) {
      if (currentPlayer === "X") {
        // بازیکن تصادفی (برای تولید داده‌های آموزشی)
        const emptySquares = board
          .map((cell, index) => (cell === null ? index : null))
          .filter((index) => index !== null);

        // Check if game is over
        if (emptySquares.length === 0) break;

        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        const move = emptySquares[randomIndex];
        board[move] = "X";
        gameHistory.push({ board: [...board], move, player: "X" });
        currentPlayer = "O";
      } else {
        // حرکت هوش مصنوعی
        const input = boardToInput(board);
        let output;

        try {
          // Try to get model output
          output = model.run(input);
        } catch (e) {
          // Fallback to random if model fails
          output = Array(9).fill(Math.random());
        }

        // انتخاب بهترین حرکت
        let bestMove = -1;
        let bestValue = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === null && output[i] > bestValue) {
            bestValue = output[i];
            bestMove = i;
          }
        }

        // اگر حرکت نامعتبر بود، حرکت تصادفی انتخاب شود
        if (bestMove === -1 || board[bestMove] !== null) {
          const emptySquares = board
            .map((cell, index) => (cell === null ? index : null))
            .filter((index) => index !== null);

          if (emptySquares.length > 0) {
            bestMove =
              emptySquares[Math.floor(Math.random() * emptySquares.length)];
          } else {
            break;
          }
        }

        board[bestMove] = "O";
        gameHistory.push({ board: [...board], move: bestMove, player: "O" });
        currentPlayer = "X";
      }

      // بررسی وضعیت بازی
      const winner = calculateWinner(board);
      if (winner) {
        return { winner, history: gameHistory };
      }

      if (!board.includes(null)) {
        return { winner: null, history: gameHistory }; // مساوی
      }
    }
    return { winner: null, history: [] };
  };

  // آموزش با بازی‌های شبیه‌سازی شده
  for (let episode = 0; episode < episodes; episode++) {
    const { winner, history } = simulateGame();

    // محاسبه پاداش برای هر حرکت
    for (let i = 0; i < history.length; i++) {
      const { board, move, player } = history[i];
      const input = boardToInput(board);

      try {
        const currentOutput = model.run(input);
        const target = [...currentOutput];

        // محاسبه پاداش
        let reward = 0;
        if (i === history.length - 1) {
          // آخرین حرکت
          if (player === "O") {
            reward =
              winner === "O"
                ? winReward
                : winner === "X"
                ? loseReward
                : drawReward;
          }
        } else {
          reward = stepReward;
        }

        // تنظیم هدف برای حرکت انجام شده
        target[move] = reward;

        // آموزش مدل
        model.train([{ input, output: target }], {
          iterations: 1,
          errorThresh: 0.001,
          log: false,
        });
      } catch (e) {
        console.error("Training error at episode", episode, "step", i, e);
      }
    }

    // به‌روزرسانی پیشرفت
    if (episode % 50 === 0) {
      const progress = Math.round((episode / episodes) * 100);
      updateProgress(progress);
    }
  }

  updateProgress(100);
  return model;
};
