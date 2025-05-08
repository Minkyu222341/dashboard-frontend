import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getDashboardSummary } from '@/services/dashboardService';

// 시간 간격 옵션 (밀리초 단위)
const INTERVAL_OPTIONS = [
  { value: 10000, label: '10초' },
  { value: 20000, label: '20초' },
  { value: 30000, label: '30초' },
  { value: 60000, label: '1분' },
  { value: 600000, label: '10분' },
];

// Home 컴포넌트에서 데이터 갱신 함수를 전달받기 위한 props 타입 정의
interface ScheduleIntervalSelectorProps {
  onDataRefresh: () => void;
}

const ScheduleIntervalSelector: React.FC<ScheduleIntervalSelectorProps> = ({
  onDataRefresh,
}) => {
  const [selectedInterval, setSelectedInterval] = useState<number>(10000); // 기본값 10초
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  // API 호출 함수 (메모이제이션)
  const callScheduleAPI = useCallback(async () => {
    try {
      await getDashboardSummary();
      // 상위 컴포넌트의 데이터 갱신 함수 호출
      onDataRefresh();
      setError(null);
    } catch (err) {
      console.error('API 호출 실패:', err);
      setError('갱신 간격을 변경하는 중 오류가 발생했습니다.');
    }
  }, [onDataRefresh]);

  // 타이머 설정 함수
  const setupTimer = useCallback(() => {
    // 이전 타이머 정리
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 새 타이머 설정
    callScheduleAPI(); // 즉시 한 번 호출
    timerRef.current = window.setInterval(callScheduleAPI, selectedInterval);
  }, [callScheduleAPI, selectedInterval]);

  // 컴포넌트 마운트 시 초기 타이머 설정
  useEffect(() => {
    setupTimer();

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [setupTimer]); // setupTimer가 변경될 때마다 타이머 재설정

  // 시간 간격 변경 핸들러
  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newInterval = parseInt(e.target.value, 10);
    setSelectedInterval(newInterval);
    // setupTimer 함수가 의존성 배열에 있기 때문에 selectedInterval이 변경되면 자동으로 타이머가 재설정됨
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">갱신 주기</h3>
          <p className="text-sm text-gray-500">
            API 호출 갱신 간격을 선택합니다.
          </p>
        </div>

        <div className="flex items-center">
          <select
            id="interval-select"
            value={selectedInterval}
            onChange={handleIntervalChange}
            className="block appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {INTERVAL_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-2 p-2 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default ScheduleIntervalSelector;
