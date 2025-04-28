import React, { useState, useEffect } from 'react';
import {
  getScheduleStatus,
  setScheduleStatus,
} from '@/services/scheduleService';

const ScheduleControl: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 초기 상태 로드
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const data = await getScheduleStatus();
        setIsEnabled(data.status);
        setError(null);
      } catch (err) {
        console.error('스케줄링 상태 로드 실패:', err);
        setError('스케줄링 상태를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  // 스케줄링 상태 변경 핸들러
  const handleToggle = async () => {
    try {
      setLoading(true);
      const newStatus = !isEnabled;
      const result = await setScheduleStatus(newStatus);
      setIsEnabled(result.status);
      setError(null);
    } catch (err) {
      console.error('스케줄링 상태 변경 실패:', err);
      setError('스케줄링 상태를 변경하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            크롤링 스케줄링 제어
          </h3>
          <p className="text-sm text-gray-500">
            크롤링 작업 스케줄링을 활성화하거나 비활성화합니다.
          </p>
        </div>

        <div className="flex items-center">
          {loading ? (
            <div className="animate-pulse h-6 w-12 bg-gray-200 rounded"></div>
          ) : (
            <div className="flex items-center">
              <span className="mr-3 text-sm font-medium text-gray-700">
                {isEnabled ? '활성화됨' : '비활성화됨'}
              </span>
              <label
                htmlFor="toggle-schedule"
                className="flex items-center cursor-pointer"
              >
                <div className="relative">
                  <input
                    id="toggle-schedule"
                    type="checkbox"
                    className="sr-only"
                    checked={isEnabled}
                    onChange={handleToggle}
                    disabled={loading}
                  />
                  <div
                    className={`block w-14 h-8 rounded-full ${isEnabled ? 'bg-green-400' : 'bg-gray-400'}`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${isEnabled ? 'transform translate-x-6' : ''}`}
                  ></div>
                </div>
              </label>
            </div>
          )}
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

export default ScheduleControl;
