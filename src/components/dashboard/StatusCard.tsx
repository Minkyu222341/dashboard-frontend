import React from 'react';

interface StatusCardProps {
  title: string;
  value: number;
  bgColor: string;
  textColor: string;
  icon?: React.ReactNode;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  bgColor,
  textColor,
  icon,
}) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-md p-5`}>
      <div className="flex justify-between items-center">
        <div>
          <p className={`text-sm ${textColor}`}>{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
    </div>
  );
};

export default StatusCard;
