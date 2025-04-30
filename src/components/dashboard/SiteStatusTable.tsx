import React from 'react';
import { SiteStatus } from '@/services/dashboardService';

interface SiteStatusTableProps {
  sites: SiteStatus[];
}

const SiteStatusTable: React.FC<SiteStatusTableProps> = ({ sites }) => {
  return (
    <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          사이트별 요청 현황
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                사이트
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                완료/전체 요청
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                미완료
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
                로그인 아이디
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sites.map(site => (
              <tr key={site.siteCode}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {site.siteName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex">
                    <div className="w-12 text-right text-green-600 font-medium">
                      {site.completedRequests}
                    </div>
                    <div className="mx-1">/</div>
                    <div className="w-12 text-left font-medium text-blue-600">
                      {site.totalRequests}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-orange-600 text-sm text-gray-500">
                  {site.pendingRequests}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(site.lastUpdatedAt).toLocaleString('ko-KR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {site.loginId || '정보 없음'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SiteStatusTable;
