import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const AnalyticsCard = ({ title, current, previous, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  const getTrend = () => {
    if (!previous) return { icon: Minus, text: 'No data', color: 'text-gray-400' };
    
    const diff = current - previous;
    const percentage = ((diff / previous) * 100).toFixed(1);
    
    if (diff > 0) {
      return {
        icon: TrendingUp,
        text: `+${percentage}% from last period`,
        color: 'text-green-600'
      };
    } else if (diff < 0) {
      return {
        icon: TrendingDown,
        text: `${percentage}% from last period`,
        color: 'text-red-600'
      };
    } else {
      return {
        icon: Minus,
        text: 'No change',
        color: 'text-gray-400'
      };
    }
  };

  const trend = getTrend();
  const TrendIcon = trend.icon;

  return (
    <div className={`rounded-lg border-2 p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        {Icon && <Icon className="w-5 h-5" />}
      </div>

      <div className="mb-3">
        <p className="text-3xl font-bold text-gray-900">{current}</p>
      </div>

      <div className={`flex items-center text-xs ${trend.color}`}>
        <TrendIcon className="w-3 h-3 mr-1" />
        <span>{trend.text}</span>
      </div>
    </div>
  );
};

export default AnalyticsCard;