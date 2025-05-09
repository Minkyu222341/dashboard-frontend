import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getDashboardSummary } from '@/services/dashboardService';
import {
  getScheduleStatus,
  setScheduleStatus,
} from '@/services/scheduleService';

const INTERVAL_OPTIONS = [
  { value: 10000, label: '10초' },
  { value: 20000, label: '20초' },
  { value: 30000, label: '30초' },
  { value: 60000, label: '1분' },
  { value: 600000, label: '10분' },
];

interface ScheduleIntervalSelectorProps {
  onDataRefresh: () => void;
}

const ScheduleIntervalSelector: React.FC<ScheduleIntervalSelectorProps> = ({
  onDataRefresh,
}) => {
  // 기본 선택 값을 60000(1분)으로 변경
  const [selectedInterval, setSelectedInterval] = useState<number>(60000);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [toggleLoading, setToggleLoading] = useState<boolean>(false);
  const [schedulingEnabled, setSchedulingEnabled] = useState<boolean | null>(
    null,
  );
  const timerRef = useRef<number | null>(null);
  const initialLoadDone = useRef<boolean>(false);

  // 초기 상태 가져오기
  const fetchInitialStatus = useCallback(async () => {
    if (initialLoadDone.current) return;

    try {
      setLoading(true);
      const statusResponse = await getScheduleStatus();
      setSchedulingEnabled(statusResponse.status);
      initialLoadDone.current = true;
      setError(null);
    } catch (err) {
      console.error('스케줄링 상태 조회 실패:', err);
      setError('스케줄링 상태를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 초기 상태 조회
  useEffect(() => {
    fetchInitialStatus();
  }, [fetchInitialStatus]);

  // API 호출 함수
  const callScheduleAPI = useCallback(async () => {
    if (schedulingEnabled === false || schedulingEnabled === null) return;

    try {
      onDataRefresh();
      setError(null);
    } catch (err) {
      console.error('API 호출 실패:', err);
      setError('갱신 간격을 변경하는 중 오류가 발생했습니다.');
    }
  }, [onDataRefresh, schedulingEnabled]);

  // 타이머 설정 함수
  const setupTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (schedulingEnabled === true) {
      callScheduleAPI(); // 즉시 한 번 호출
      timerRef.current = window.setInterval(callScheduleAPI, selectedInterval);
    }
  }, [callScheduleAPI, selectedInterval, schedulingEnabled]);

  // 스케줄링 상태 또는 간격이 변경될 때마다 타이머 재설정
  useEffect(() => {
    if (schedulingEnabled !== null) {
      setupTimer();
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [setupTimer, schedulingEnabled]);

  // 시간 간격 변경 핸들러
  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newInterval = parseInt(e.target.value, 10);
    setSelectedInterval(newInterval);
  };

  // 스케줄링 활성화 상태 토글 핸들러
  const handleSchedulingToggle = async () => {
    if (schedulingEnabled === null) return;

    try {
      // 토글 로딩 상태 시작
      setToggleLoading(true);
      setError(null);

      // 1. 즉시 UI 업데이트 (낙관적 업데이트)
      const newStatus = !schedulingEnabled;
      setSchedulingEnabled(newStatus);

      // 2. 서버에 상태 변경 요청
      const response = await setScheduleStatus(newStatus);

      // 3. 서버 응답이 예상과 다르면 UI 롤백 (드물게 발생)
      if (response.status !== newStatus) {
        console.warn('서버 응답이 예상과 다릅니다:', response.status);
        setSchedulingEnabled(response.status);
      }
    } catch (err) {
      // 오류 발생 시 원래 상태로 롤백
      console.error('스케줄링 상태 변경 실패:', err);
      setSchedulingEnabled(!schedulingEnabled);
      setError('스케줄링 상태 변경에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      // 토글 로딩 상태 종료
      setToggleLoading(false);
    }
  };

  const isDisabled = loading || schedulingEnabled === null;
  const isSelectDisabled = isDisabled || schedulingEnabled === false;

  // 로딩 중 스켈레톤 UI
  if (schedulingEnabled === null && loading) {
    return (
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between animate-pulse">
          <div>
            <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center whitespace-nowrap min-w-44">
              <div className="w-20 h-5 bg-gray-200 rounded mr-3"></div>
              <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
            </div>
            <div className="w-24 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">갱신 주기</h3>
          <p className="text-sm text-gray-500">
            API 호출 갱신 간격을 선택합니다.
          </p>
        </div>

        <div className="flex items-center space-x-6">
          {/* 활성화/비활성화 토글 버튼 */}
          <div className="flex items-center whitespace-nowrap min-w-44">
            <span className="mr-3 text-sm font-medium text-gray-700 w-20">
              {schedulingEnabled ? '활성화됨' : '비활성화됨'}
            </span>
            <label
              className={`relative inline-flex items-center ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={schedulingEnabled === true}
                onChange={handleSchedulingToggle}
                disabled={isDisabled || toggleLoading}
              />
              <div
                className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer 
                ${schedulingEnabled ? 'peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-green-500' : ''}
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                ${toggleLoading ? 'after:animate-pulse' : ''} 
                ${isDisabled ? 'opacity-50' : ''}`}
              ></div>
              {toggleLoading && (
                <span className="ml-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                </span>
              )}
            </label>
          </div>

          {/* 갱신 간격 셀렉트박스 */}
          <div className="w-24">
            <select
              id="interval-select"
              value={selectedInterval}
              onChange={handleIntervalChange}
              disabled={isSelectDisabled}
              className={`text-gray-900 w-full h-10 appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight ${
                !isSelectDisabled
                  ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {INTERVAL_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
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
