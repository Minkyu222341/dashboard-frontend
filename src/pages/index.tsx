import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import Layout from '@/components/layout/Layout';
import StatusCard from '@/components/dashboard/StatusCard';
import SiteStatusTable from '@/components/dashboard/SiteStatusTable';
import StatusChart from '@/components/dashboard/StatusChart';
import ScheduleIntervalSelector from '@/components/dashboard/ScheduleControl';

import {
  getDashboardSummary,
  DashboardSummary,
} from '@/services/dashboardService';

export interface DashboardSummaryWithErrors extends DashboardSummary {
  errors?: {
    dashboard: boolean;
    accounts: boolean;
  };
}

export default function Home() {
  const [dashboardData, setDashboardData] =
    useState<DashboardSummaryWithErrors | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updateCount, setUpdateCount] = useState<number>(0);
  const isInitialMount = useRef(true);
  const dataFetchingRef = useRef(false);

  // 대시보드 데이터 가져오기 함수
  const fetchDashboardData = useCallback(async () => {
    if (dataFetchingRef.current) return; // 이미 데이터를 가져오는 중이면 중복 호출 방지

    try {
      dataFetchingRef.current = true;

      // 첫 로딩이 아닌 업데이트인 경우에만 로딩 상태 표시
      if (!isInitialMount.current) {
        setLoading(true);
      }

      const data = await getDashboardSummary();

      // 이전 데이터와 비교하여 변경된 경우에만 상태 업데이트
      setDashboardData(prevData => {
        if (!prevData) {
          isInitialMount.current = false;
          return data;
        }

        // 전체 숫자 비교
        if (
          prevData.totalRequests !== data.totalRequests ||
          prevData.pendingRequests !== data.pendingRequests ||
          prevData.completedRequests !== data.completedRequests
        ) {
          // 데이터가 변경되면 업데이트 카운트 증가
          setUpdateCount(count => count + 1);
          return data;
        }

        // 사이트별 데이터 비교
        const hasChanges = data.siteStatuses.some((newSite, index) => {
          const prevSite = prevData.siteStatuses[index];
          return (
            !prevSite ||
            prevSite.pendingRequests !== newSite.pendingRequests ||
            prevSite.totalRequests !== newSite.totalRequests ||
            prevSite.completedRequests !== newSite.completedRequests
          );
        });

        if (hasChanges) {
          setUpdateCount(count => count + 1);
          return data;
        }

        return prevData;
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      dataFetchingRef.current = false;
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // 메모이제이션된 컴포넌트들 - 깜빡임 최소화를 위해 개선
  const statusCards = useMemo(
    () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <StatusCard
          title="요청"
          value={dashboardData?.pendingRequests ?? 0}
          bgColor="bg-yellow-50"
          textColor="text-yellow-600"
          isLoading={loading && !isInitialMount.current}
        />
        <StatusCard
          title="완료"
          value={dashboardData?.completedRequests ?? 0}
          bgColor="bg-green-50"
          textColor="text-green-600"
          isLoading={loading && !isInitialMount.current}
        />
        <StatusCard
          title="전체"
          value={dashboardData?.totalRequests ?? 0}
          bgColor="bg-indigo-50"
          textColor="text-indigo-600"
          isLoading={loading && !isInitialMount.current}
        />
      </div>
    ),
    [
      dashboardData?.pendingRequests,
      dashboardData?.completedRequests,
      dashboardData?.totalRequests,
      loading,
      // isInitialMount.current 제거됨
    ],
  );

  const statusChart = useMemo(() => {
    if (!dashboardData) return null;

    return (
      <StatusChart
        key={`chart-${updateCount}`}
        sites={dashboardData.siteStatuses}
        isLoading={loading && !isInitialMount.current}
      />
    );
  }, [dashboardData, updateCount, loading]); // isInitialMount.current 제거됨

  const statusTable = useMemo(() => {
    if (!dashboardData) return null;

    return (
      <SiteStatusTable
        key={`table-${updateCount}`}
        sites={dashboardData.siteStatuses}
        isLoading={loading && !isInitialMount.current}
      />
    );
  }, [dashboardData, updateCount, loading]); // isInitialMount.current 제거됨

  if (loading && !dashboardData) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">데이터를 불러오는 중입니다...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !dashboardData) {
    return (
      <Layout>
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">오류 발생</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout>
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-700">데이터가 없습니다.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6"></h2>

        {dashboardData.errors?.dashboard && (
          <div className="bg-red-50 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  대시보드 데이터 오류
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    대시보드 데이터를 불러오는 중 오류가 발생했습니다. 일부
                    정보가 정확하지 않을 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {dashboardData.errors?.accounts && (
          <div className="bg-yellow-50 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  계정 정보 오류
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    계정 정보를 불러오는 중 오류가 발생했습니다. 로그인 아이디
                    정보가 정확하지 않을 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && dashboardData && (
          <div className="bg-yellow-50 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  갱신 오류
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <ScheduleIntervalSelector onDataRefresh={fetchDashboardData} />

        {loading && !isInitialMount.current && (
          <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
            <span>데이터 갱신 중...</span>
          </div>
        )}

        {statusCards}
        {statusChart}
        {statusTable}
      </div>
    </Layout>
  );
}
