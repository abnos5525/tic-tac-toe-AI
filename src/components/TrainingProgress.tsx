import React from "react";
import { Progress, Typography } from "antd";
import { SyncOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

// تعریف تایپ‌ها
interface TrainingProgressProps {
  progress: number;
  status: 'idle' | 'training' | 'completed';
}

const TrainingProgress: React.FC<TrainingProgressProps> = ({ progress, status }) => {
  return (
    <div className="w-full">
      {/* عنوان و درصد پیشرفت */}
      <div className="flex justify-between items-center mb-1">
        <Text className="!text-gray-700 !font-medium">پیشرفت آموزش</Text>
        <Text className="!text-indigo-600 !font-medium">{progress}%</Text>
      </div>
      
      {/* نوار پیشرفت - ترکیب Ant Design و Tailwind */}
      <Progress 
        percent={progress} 
        showInfo={false} 
        strokeColor="#4f46e5" // رنگ indigo-600 از Tailwind
        trailColor="#e5e7eb"  // رنگ gray-200 از Tailwind
        strokeLinecap="round"
        className="!mb-0"
        size="small"
      />
      
      {/* پیام وضعیت */}
      <div className="mt-2 text-sm">
        {status === 'training' && (
          <Text className="!text-indigo-600 flex items-center">
            <SyncOutlined spin className="mr-2" />
            در حال آموزش مدل...
          </Text>
        )}
        {status === 'completed' && (
          <Text className="!text-green-600 flex items-center">
            <CheckCircleOutlined className="mr-2" />
            آموزش تکمیل شد!
          </Text>
        )}
      </div>
    </div>
  );
};

export default TrainingProgress;