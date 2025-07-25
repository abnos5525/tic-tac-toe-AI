import React from "react";
import { Card, Typography, Descriptions, Tag, Button } from "antd";
import { RobotOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import DifficultySelector from "./DifficultySelector";
import TrainingStatusComponent from "./TrainingStatus";
import type { AiLevel, TrainingStatus } from "./types";

const { Text } = Typography;

interface GameControlsProps {
  aiLevel: AiLevel;
  changeAiLevel: (level: AiLevel) => void;
  trainingProgress: number;
  trainingStatus: TrainingStatus;
  retrainAI: () => void;
  showStats: boolean;
  setShowStats: (show: boolean) => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  aiLevel,
  changeAiLevel,
  trainingProgress,
  trainingStatus,
  retrainAI,
  showStats,
  setShowStats,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5">
      <h2 className="text-xl font-bold text-gray-800 mb-4">تنظیمات و اطلاعات</h2>
      
      {/* سطح دشواری */}
      <DifficultySelector aiLevel={aiLevel} changeAiLevel={changeAiLevel} />

      {/* وضعیت آموزش */}
      <TrainingStatusComponent
        trainingProgress={trainingProgress}
        trainingStatus={trainingStatus}
        retrainAI={retrainAI}
      />

      {/* اطلاعات یادگیری تقویتی */}
      <Card 
        size="small" 
        className="bg-indigo-50 border-indigo-100 mb-5"
        title={
          <span className="font-bold text-indigo-800 flex items-center text-sm sm:text-base">
            <RobotOutlined className="mr-2" />
            یادگیری تقویتی (RL)
          </span>
        }
      >
        <Text type="secondary" className="mb-3 block text-xs sm:text-sm">
          هوش مصنوعی با آزمون و خطا یاد می‌گیرد و برای هر حرکت پاداش دریافت می‌کند.
        </Text>
        <Descriptions column={1} size="small" className="space-y-2">
          <Descriptions.Item label="برد هوش مصنوعی">
            <Tag color="green">+1</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="باخت هوش مصنوعی">
            <Tag color="red">-1</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="مساوی">
            <Tag color="orange">+0.5</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="حرکت معتبر">
            <Tag color="default">+0.01</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Button
        type="primary"
        icon={showStats ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        onClick={() => setShowStats(!showStats)}
        block
        className="!bg-purple-600 hover:!bg-purple-700 !text-sm sm:!text-base"
      >
        {showStats ? "پنهان کردن جزئیات" : "نمایش جزئیات یادگیری"}
      </Button>
    </div>
  );
};

export default GameControls;