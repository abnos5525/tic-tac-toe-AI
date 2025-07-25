import React from "react";
import { Button, Space } from "antd";
import type { AiLevel } from "./types";

interface DifficultySelectorProps {
  aiLevel: AiLevel;
  changeAiLevel: (level: AiLevel) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ aiLevel, changeAiLevel }) => {
  return (
    <div className="mb-5">
      <label className="block text-gray-700 text-sm sm:text-base mb-2">سطح دشواری هوش مصنوعی</label>
      <Space direction="vertical" className="w-full">
        <Button.Group className="grid grid-cols-3 gap-2 w-full">
          <Button
            type={aiLevel === "easy" ? "primary" : "default"}
            onClick={() => changeAiLevel("easy")}
            className={`
              ${aiLevel === "easy" 
                ? "!bg-green-500 !border-green-500 hover:!bg-green-600" 
                : "hover:!bg-gray-100"}
              !text-xs sm:!text-sm
            `}
          >
            آسان
          </Button>
          <Button
            type={aiLevel === "medium" ? "primary" : "default"}
            onClick={() => changeAiLevel("medium")}
            className={`
              ${aiLevel === "medium" 
                ? "!bg-yellow-500 !border-yellow-500 hover:!bg-yellow-600" 
                : "hover:!bg-gray-100"}
              !text-xs sm:!text-sm
            `}
          >
            متوسط
          </Button>
          <Button
            type={aiLevel === "hard" ? "primary" : "default"}
            onClick={() => changeAiLevel("hard")}
            className={`
              ${aiLevel === "hard" 
                ? "!bg-red-500 !border-red-500 hover:!bg-red-600" 
                : "hover:!bg-gray-100"}
              !text-xs sm:!text-sm
            `}
          >
            سخت
          </Button>
        </Button.Group>
      </Space>
    </div>
  );
};

export default DifficultySelector;