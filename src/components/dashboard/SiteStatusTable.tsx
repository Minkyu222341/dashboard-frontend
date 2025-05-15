import React, { useMemo, useState, useEffect } from 'react';
import { SiteStatus } from '@/services/dashboardService';
import { setSiteStatus } from '@/services/scheduleService';

interface SiteStatusTableProps {
  sites: SiteStatus[];
  isLoading?: boolean;
  onStatusChange?: () => void; // 상태 변경 후 호출될 콜백 함수
}

const SiteStatusTable = React.memo(function SiteStatusTable({
  sites,
  isLoading = false,
  onStatusChange,
}: SiteStatusTableProps) {
  // 로컬 상태로 사이트 데이터 관리
  const [localSites, setLocalSites] = useState<SiteStatus[]>(sites);
  const [updatingStates, setUpdatingStates] = useState<Record<string, boolean>>(
    {},
  );
  const [error, setError] = useState<string | null>(null);

  // sites prop이 변경되면 로컬 상태 업데이트
  useEffect(() => {
    setLocalSites(sites);
  }, [sites]);

  // sequence 필드를 기준으로 정렬 - 메모이제이션 적용
  const sortedSites = useMemo(
    () => [...localSites].sort((a, b) => a.sequence - b.sequence),
    [localSites],
  );

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  // 사이트별 활성화 상태 변경 처리
  const handleToggleStatus = async (
    siteCode: string,
    currentStatus: boolean,
  ) => {
    try {
      setUpdatingStates(prev => ({ ...prev, [siteCode]: true }));
      setError(null);

      // 1. 먼저 로컬 상태 즉시 업데이트 (UI 반응성 향상)
      setLocalSites(prevSites =>
        prevSites.map(site =>
          site.siteCode === siteCode
            ? { ...site, enabled: !currentStatus }
            : site,
        ),
      );

      // 2. 서버에 상태 변경 요청
      await setSiteStatus(siteCode, !currentStatus);

      // 3. 선택적으로 부모 컴포넌트에 알림 (전체 데이터 새로고침)
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (err) {
      console.error(`사이트 ${siteCode} 상태 변경 실패:`, err);
      setError(`상태 변경 중 오류가 발생했습니다. 다시 시도해 주세요.`);

      // 오류 발생 시 원래 상태로 롤백
      setLocalSites(prevSites =>
        prevSites.map(site =>
          site.siteCode === siteCode
            ? { ...site, enabled: currentStatus }
            : site,
        ),
      );
    } finally {
      setUpdatingStates(prev => ({ ...prev, [siteCode]: false }));
    }
  };

  return (
    <div className="mt-6 bg-white shadow rounded-lg overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          사이트별 요청 현황
        </h3>
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
              >
                번호
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pl-20"
              >
                사이트
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center space-x-1">
                  <span className="w-12 text-right">완료</span>
                  <span>/</span>
                  <span className="w-12 text-left">전체</span>
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                마지막 업데이트
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                아이디
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-start">
                  <span>수집</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedSites.map((site, index) => (
              <tr key={site.siteCode}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center w-20">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap pl-20">
                  <div className="text-sm font-medium text-gray-900">
                    {site.siteName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center space-x-1">
                    <span className="w-12 text-right font-medium">
                      {formatNumber(site.completedRequests)}
                    </span>
                    <span>/</span>
                    <span className="w-12 text-left font-medium">
                      {formatNumber(site.totalRequests)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(site.lastUpdatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {site.loginId || '정보 없음'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-start justify-start">
                    {updatingStates[site.siteCode] ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    ) : (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={site.enabled}
                          onChange={() =>
                            handleToggleStatus(site.siteCode, site.enabled)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default SiteStatusTable;
