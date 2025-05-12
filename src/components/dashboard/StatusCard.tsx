import React from 'react';

interface StatusCardProps {
  title: string;
  value: number;
  bgColor: string;
  textColor: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const StatusCard = React.memo(function StatusCard({
  title,
  value,
  bgColor,
  textColor,
  icon,
  isLoading = false,
}: StatusCardProps) {
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };
  return (
    <div
      className={`${bgColor} rounded-lg shadow-md p-5 relative overflow-hidden`}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div>
          <p className={`text-sm ${textColor}`}>{title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">
            {formatNumber(value)}
          </p>
        </div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
    </div>
  );
});

export default StatusCard;
