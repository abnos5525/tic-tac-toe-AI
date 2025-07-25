import React from "react";
import { Button } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import TrainingProgress from "../TrainingProgress";

interface TrainingStatusProps {
  trainingProgress: number;
  trainingStatus: "idle" | "training" | "completed";
  retrainAI: () => void;
}

const TrainingStatusComponent: React.FC<TrainingStatusProps> = ({
  trainingProgress,
  trainingStatus,
  retrainAI,
}) => {
  return (
    <div className="mb-5">
      <TrainingProgress
        progress={trainingProgress}
        status={trainingStatus}
      />
      <Button
        type="dashed"
        icon={<SyncOutlined />}
        onClick={retrainAI}
        disabled={trainingStatus === "training"}
        loading={trainingStatus === "training"}
        block
        className="mt-3 !text-sm sm:!text-base"
      >
        {trainingStatus === "training"
          ? "در حال آموزش..."
          : "آموزش مجدد هوش مصنوعی"}
      </Button>
    </div>
  );
};

export default TrainingStatusComponent;