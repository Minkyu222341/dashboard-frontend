import React from 'react';

interface DateRangeSelectorProps {
  startDate: string | null;
  endDate: string | null;
  onStartDateChange: (date: string | null) => void;
  onEndDateChange: (date: string | null) => void;
  onSearch: () => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
}) => {
  // 날짜 기간 버튼 핸들러
  const handlePeriodClick = (period: 'all' | 'month' | 'week' | 'today') => {
    const today = new Date();
    const endDateStr = today.toISOString().split('T')[0]; // 종료일은 항상 오늘

    let startDateStr: string | null = null;

    switch (period) {
      case 'all':
        startDateStr = null; // 시작일을 null로 설정하여 전체 기간 조회
        break;
      case 'month':
        // 한 달 전
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        startDateStr = monthAgo.toISOString().split('T')[0];
        break;
      case 'week':
        // 일주일 전
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        startDateStr = weekAgo.toISOString().split('T')[0];
        break;
      case 'today':
        // 오늘
        startDateStr = endDateStr;
        break;
    }

    onStartDateChange(startDateStr);
    onEndDateChange(endDateStr);

    // 즉시 검색 실행
    setTimeout(onSearch, 0);
  };

  return (
    <div className="flex flex-col w-full gap-3">
      {/* 기간 단축 버튼 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">기간 검색</h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handlePeriodClick('all')}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            전체
          </button>
          <button
            onClick={() => handlePeriodClick('month')}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            한달
          </button>
          <button
            onClick={() => handlePeriodClick('week')}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            일주일
          </button>
          <button
            onClick={() => handlePeriodClick('today')}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            오늘
          </button>
        </div>
      </div>

      {/* 날짜 선택기 */}
      <div className="flex items-center justify-end gap-3">
        <div>
          <input
            type="date"
            id="startDate"
            className="border rounded px-2 py-1"
            value={startDate || ''}
            onChange={e => onStartDateChange(e.target.value || null)}
          />
        </div>
        <span>-</span>
        <div>
          <input
            type="date"
            id="endDate"
            className="border rounded px-2 py-1"
            value={endDate || ''}
            onChange={e => onEndDateChange(e.target.value || null)}
          />
        </div>
        <button
          onClick={onSearch}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          검색
        </button>
      </div>
    </div>
  );
};

export default DateRangeSelector;
