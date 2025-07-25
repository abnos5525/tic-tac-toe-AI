import React from "react";
import { Card, Typography, Row, Col, Divider } from "antd";
import { 
  PartitionOutlined, 
  BugOutlined, 
  ExperimentOutlined, 
  ApiOutlined,
  DeploymentUnitOutlined,
  RocketOutlined,
  CodeOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const TechnicalDetails: React.FC = () => {
  return (
    <div className="mt-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-5 sm:p-6">
        <Title level={3} className="!text-gray-800 !mb-5 !text-xl sm:!text-2xl !font-bold flex items-center">
          <CodeOutlined className="mr-3 text-blue-500" />
          جزئیات فنی پروژه
        </Title>
        
        <Row gutter={[20, 20]}>
          {/* معماری شبکه عصبی */}
          <Col xs={24} lg={12}>
            <Card 
              className="h-full shadow-sm hover:shadow-md transition-shadow rounded-xl border border-blue-100 bg-white"
              bodyStyle={{ padding: '20px' }}
            >
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <DeploymentUnitOutlined className="text-blue-600 text-xl" />
                </div>
                <Title level={5} className="!mb-0 !text-blue-800">معماری شبکه عصبی</Title>
              </div>
              <ul className="space-y-3">
                {[
                  { icon: '🧠', text: 'لایه ورودی: 9 نورون (هر خانه صفحه)' },
                  { icon: '🔗', text: 'لایه‌های پنهان: 128 و 64 نورون' },
                  { icon: '🎯', text: 'لایه خروجی: 9 نورون (احتمال هر حرکت)' },
                  { icon: '⚡', text: 'تابع فعال‌ساز: Leaky ReLU' },
                  { icon: '⚙️', text: 'نرخ یادگیری: 0.01' },
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-lg mr-2">{item.icon}</span>
                    <Text className="text-gray-700">{item.text}</Text>
                  </li>
                ))}
              </ul>
            </Card>
          </Col>

          {/* فرآیند یادگیری تقویتی */}
          <Col xs={24} lg={12}>
            <Card 
              className="h-full shadow-sm hover:shadow-md transition-shadow rounded-xl border border-purple-100 bg-white"
              bodyStyle={{ padding: '20px' }}
            >
              <div className="flex items-start mb-4">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <BugOutlined className="text-purple-600 text-xl" />
                </div>
                <Title level={5} className="!mb-0 !text-purple-800">فرآیند یادگیری تقویتی</Title>
              </div>
              <ol className="space-y-3 list-decimal pr-5">
                {[
                  'شروع با مدل تصادفی بدون دانش اولیه',
                  'شبیه‌سازی 2000 بازی برای آموزش',
                  'به‌روزرسانی وزن‌ها بر اساس پاداش حرکات',
                  'ذخیره مدل آموزش‌دیده در localStorage',
                  'استفاده از مدل آموزش‌دیده در بازی واقعی'
                ].map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ol>
            </Card>
          </Col>
        </Row>

        <Divider className="!my-7" />

        {/* تکنولوژی‌های استفاده شده */}
        <div className="text-center">
          <Title level={3} className="!text-gray-800 !mb-6 !text-xl sm:!text-2xl !font-bold flex items-center justify-center">
            <RocketOutlined className="mr-3 text-green-500" />
            تکنولوژی‌های استفاده شده
          </Title>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { 
                name: 'React', 
                description: 'رابط کاربری', 
                icon: <ExperimentOutlined className="text-blue-500 text-2xl" />,
                color: 'from-blue-50 to-blue-100',
                border: 'border-blue-200'
              },
              { 
                name: 'Brain.js', 
                description: 'شبکه عصبی', 
                icon: <ApiOutlined className="text-cyan-500 text-2xl" />,
                color: 'from-cyan-50 to-cyan-100',
                border: 'border-cyan-200'
              },
              { 
                name: 'Ant Design', 
                description: 'کامپوننت‌ها', 
                icon: <PartitionOutlined className="text-purple-500 text-2xl" />,
                color: 'from-purple-50 to-purple-100',
                border: 'border-purple-200'
              },
            ].map((tech, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${tech.color} p-5 rounded-xl border ${tech.border} shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1`}
              >
                <div className="flex flex-col items-center">
                  <div className="mb-3 p-3 bg-white rounded-full shadow-inner">
                    {tech.icon}
                  </div>
                  <Title level={4} className="!mb-1 !text-gray-800 !text-lg">
                    {tech.name}
                  </Title>
                  <Text type="secondary" className="!text-sm">
                    {tech.description}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDetails;