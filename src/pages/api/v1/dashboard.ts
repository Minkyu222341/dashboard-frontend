// pages/api/dashboard.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { mockSiteStatuses } from '@/utils/mockData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // 백엔드 API 응답 형식에 맞게 mockSiteStatuses를 반환
    // dashboardService.ts의 DashBoardResponseDto[] 형식으로 변환해야 함
    const mockResponseData = mockSiteStatuses.map(site => ({
      siteCode: site.siteCode,
      siteName: site.siteName,
      completedCount: site.completedRequests,
      notCompletedCount: site.pendingRequests,
      totalCount: site.totalRequests,
      lastUpdatedAt: site.lastUpdatedAt,
    }));

    // 백엔드 호출 대신 목업 데이터 사용
    res.status(200).json(mockResponseData);
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch data from backend' });
  }
}
