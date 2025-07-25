interface TrainingProgressProps {
  progress: number;
  status: 'idle' | 'training' | 'completed';
}

const TrainingProgress : React.FC<TrainingProgressProps> = ({ progress, status }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-gray-700 font-medium">پیشرفت آموزش</span>
        <span className="text-indigo-600 font-medium">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {status === 'training' && <span className="flex items-center"><span className="animate-spin mr-2">🌀</span> در حال آموزش مدل...</span>}
        {status === 'completed' && <span className="text-green-600">✅ آموزش تکمیل شد!</span>}
      </div>
    </div>
  );
};

export default TrainingProgress;