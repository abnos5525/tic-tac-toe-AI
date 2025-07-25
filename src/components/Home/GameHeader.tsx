import React from "react";
import { Typography } from "antd";
import { RobotOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const GameHeader: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <Title level={2} className="!text-indigo-800 !mb-2 !text-3xl sm:!text-4xl flex items-center justify-center">
        <RobotOutlined className="mr-2 text-2xl sm:text-3xl" />
        Tic Tac Toe AI
      </Title>
      <Text type="secondary" className="text-base sm:text-lg">
        بازی با هوش مصنوعی مبتنی بر یادگیری تقویتی
      </Text>
    </header>
  );
};

export default GameHeader;