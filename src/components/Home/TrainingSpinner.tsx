import React from "react";

interface TrainingSpinnerProps {
  trainingProgress: number;
}

const TrainingSpinner: React.FC<TrainingSpinnerProps> = ({ trainingProgress }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12">
      <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
      <p className="text-base sm:text-lg text-indigo-700 font-medium text-center px-2">
        هوش مصنوعی در حال آموزش اولیه است...
      </p>
      <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center px-2">
        لطفاً صبر کنید. این فرآیند تنها یک‌بار انجام می‌شود.
      </p>
      <div className="w-full max-w-[250px] sm:max-w-xs mt-4">
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
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
  );
};

export default TrainingSpinner;