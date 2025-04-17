// src/services/dashboardService.ts
export interface SiteStatus {
  siteCode: string;
  siteName: string;
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  lastUpdated: string;
}

export interface DashboardSummary {
  totalSites: number;
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  siteStatuses: SiteStatus[];
}

// 백엔드 API 응답 타입
export interface DashBoardResponseDto {
  siteCode: string;
  siteName: string;
  completedCount: number;
  notCompletedCount: number;
  totalCount: number;
  crawlDate: string;
}

// 백엔드 API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const response = await fetch(`${API_URL}/dashboard`);

    if (!response.ok) {
      throw new Error(`API 호출 오류: ${response.status}`);
    }

    const data: DashBoardResponseDto[] = await response.json();

    // 백엔드 응답을 프론트엔드 모델로 변환
    const siteStatuses: SiteStatus[] = data.map(item => ({
      siteCode: item.siteCode,
      siteName: item.siteName,
      totalRequests: item.totalCount,
      pendingRequests: item.notCompletedCount,
      completedRequests: item.completedCount,
      lastUpdated: item.crawlDate, // 날짜 형식이 필요하면 여기서 변환
    }));

    // 요약 정보 계산
    const totalSites = siteStatuses.length;
    const totalRequests = siteStatuses.reduce(
      (sum, site) => sum + site.totalRequests,
      0,
    );
    const pendingRequests = siteStatuses.reduce(
      (sum, site) => sum + site.pendingRequests,
      0,
    );
    const completedRequests = siteStatuses.reduce(
      (sum, site) => sum + site.completedRequests,
      0,
    );

    return {
      totalSites,
      totalRequests,
      pendingRequests,
      completedRequests,
      siteStatuses,
    };
  } catch (error) {
    console.error('대시보드 데이터 가져오기 실패:', error);
    throw error;
  }
}
