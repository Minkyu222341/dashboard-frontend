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
}) => (
  <div className="flex items-center justify-between w-full">
    {/* 왼쪽: 날짜검색 텍스트 */}
    <div>
      <h3 className="text-lg font-medium text-gray-900">기간 검색</h3>
    </div>

    {/* 오른쪽: 달력 필드들 */}
    <div className="inline-flex items-center gap-3">
      <div>
        <label
          htmlFor="startDate"
          className="text-sm text-gray-600 mr-1"
        ></label>
        <input
          type="date"
          id="startDate"
          className="border rounded px-2 py-1"
          value={startDate || ''}
          onChange={e => onStartDateChange(e.target.value || null)}
        />
      </div>
      -
      <div>
        <label htmlFor="endDate" className="text-sm text-gray-600 mr-1"></label>
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

export default DateRangeSelector;
