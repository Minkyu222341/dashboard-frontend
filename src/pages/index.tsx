import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import StatusCard from '@/components/dashboard/StatusCard';
import SiteStatusTable from '@/components/dashboard/SiteStatusTable';
import StatusChart from '@/components/dashboard/StatusChart';
import {
  getDashboardSummary,
  DashboardSummary,
} from '@/services/dashboardService';

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardSummary();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchData();

    // 3분마다 데이터 새로고침
    const interval = setInterval(fetchData, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
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

  if (error) {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            title="전체 사이트"
            value={dashboardData.totalSites}
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <StatusCard
            title="전체 요청"
            value={dashboardData.totalRequests}
            bgColor="bg-indigo-50"
            textColor="text-indigo-600"
          />
          <StatusCard
            title="미완료 요청"
            value={dashboardData.pendingRequests}
            bgColor="bg-yellow-50"
            textColor="text-yellow-600"
          />
          <StatusCard
            title="완료 요청"
            value={dashboardData.completedRequests}
            bgColor="bg-green-50"
            textColor="text-green-600"
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
