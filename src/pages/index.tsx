import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import StatusCard from '@/components/dashboard/StatusCard';
import SiteStatusTable from '@/components/dashboard/SiteStatusTable';
import StatusChart from '@/components/dashboard/StatusChart';
import ScheduleIntervalSelector from '@/components/dashboard/ScheduleControl';

import {
  getDashboardSummary,
  DashboardSummary,
} from '@/services/dashboardService';

// DashboardSummary 인터페이스에 errors 속성 추가
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

  // 대시보드 데이터 가져오기 함수 (초기 로드 및 주기적 갱신용)
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDashboardSummary();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading && !dashboardData) {
    // 최초 로딩 시에만 로딩 화면 표시 (갱신 시에는 이전 데이터 유지)
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
    // 최초 로드 시 오류가 발생한 경우에만 오류 화면 표시
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

  // dashboardData가 null인 경우 처리
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

        {/* API 에러 알림 표시 */}
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

        {/* 갱신 중 오류 표시 */}
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

        {/* 스케줄링 제어 컴포넌트 - 데이터 갱신 함수 전달 */}
        <ScheduleIntervalSelector onDataRefresh={fetchDashboardData} />

        {/* 로딩 중 표시 (이미 데이터가 있는 상태에서 갱신 중인 경우) */}
        {loading && dashboardData && (
          <div className="bg-blue-50 p-2 rounded-md mb-4 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            <p className="text-sm text-blue-700">
              데이터를 갱신하는 중입니다...
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <StatusCard
            title="미처리"
            value={dashboardData.pendingRequests}
            bgColor="bg-yellow-50"
            textColor="text-yellow-600"
          />
          <StatusCard
            title="완료"
            value={dashboardData.completedRequests}
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <StatusCard
            title="전체"
            value={dashboardData.totalRequests}
            bgColor="bg-indigo-50"
            textColor="text-indigo-600"
          />
        </div>

        {/* 차트 컴포넌트 */}
        {dashboardData.siteStatuses.length > 0 && (
          <StatusChart sites={dashboardData.siteStatuses} />
        )}

        {/* 테이블 컴포넌트 */}
        {dashboardData.siteStatuses.length > 0 && (
          <SiteStatusTable sites={dashboardData.siteStatuses} />
        )}
      </div>
    </Layout>
  );
}
