// 사이트 상태 타입
export interface SiteStatus {
  siteCode: string;
  siteName: string;
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  lastUpdatedAt: string;
  loginId?: string;
  sequence: number;
  enabled: boolean;
}

// 대시보드 요약 정보 타입
export interface DashboardSummary {
  totalSites: number;
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  siteStatuses: SiteStatus[];
  errors?: {
    dashboard: boolean;
    accounts: boolean;
    siteStatuses: boolean;
  };
}

// 백엔드 API 응답 타입
export interface DashBoardResponseDto {
  siteCode: string;
  siteName: string;
  completedCount: number;
  notCompletedCount: number;
  totalCount: number;
  sequence: number;
  lastUpdatedAt: string;
  loginId?: string;
}

// 계정 정보 응답 타입
export interface AccountInfoResponseDto {
  siteCode: string;
  loginId: string;
}

// 사이트 상태 응답 타입
export interface SiteStatusResponseDto {
  siteCode: string;
  siteName: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  sequence: number;
}

// 검색 조건 타입 추가
export interface DashboardSearchParams {
  startDate?: string;
  endDate?: string;
}

// 백엔드 API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function getDashboardSummary(
  searchParams?: DashboardSearchParams,
): Promise<DashboardSummary> {
  // 대시보드 데이터 가져오기
  let dashboardData: DashBoardResponseDto[] = [];
  let dashboardError = false;

  try {
    // 검색 파라미터가 있으면 URL에 추가
    let url = `${API_URL}/dashboard`;

    if (searchParams) {
      const queryParams = new URLSearchParams();

      if (searchParams.startDate) {
        queryParams.append('startDate', searchParams.startDate);
      }

      if (searchParams.endDate) {
        queryParams.append('endDate', searchParams.endDate);
      }

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const dashboardResponse = await fetch(url);
    if (dashboardResponse.ok) {
      dashboardData = await dashboardResponse.json();
    } else {
      dashboardError = true;
    }
  } catch (error) {
    dashboardError = true;
  }

  // 계정 정보 가져오기
  let accountsData: AccountInfoResponseDto[] = [];
  let accountsError = false;

  try {
    const accountsResponse = await fetch(`${API_URL}/accounts`);
    if (accountsResponse.ok) {
      accountsData = await accountsResponse.json();
    } else {
      accountsError = true;
    }
  } catch (error) {
    accountsError = true;
  }

  // 사이트 활성화 상태 가져오기
  let siteStatusesData: SiteStatusResponseDto[] = [];
  let siteStatusesError = false;

  try {
    const siteStatusesResponse = await fetch(
      `${API_URL}/schedule/sites/status`,
    );
    if (siteStatusesResponse.ok) {
      siteStatusesData = await siteStatusesResponse.json();
    } else {
      siteStatusesError = true;
    }
  } catch (error) {
    siteStatusesError = true;
  }

  // 계정 정보로 맵 생성
  const accountMap = new Map<string, string>();
  accountsData.forEach(account => {
    accountMap.set(account.siteCode, account.loginId);
  });

  // 사이트 활성화 상태로 맵 생성
  const siteStatusMap = new Map<string, boolean>();
  siteStatusesData.forEach(status => {
    siteStatusMap.set(status.siteCode, status.enabled);
  });

  // 대시보드 데이터로 맵 생성 (코드 추가)
  const dashboardMap = new Map<string, DashBoardResponseDto>();
  dashboardData.forEach(item => {
    dashboardMap.set(item.siteCode, item);
  });

  // 사이트 상태 정보, 계정 정보, 활성화 상태 조합 (수정)
  // 모든 사이트를 기준으로 변경
  const siteStatuses: SiteStatus[] = siteStatusesData.map(site => {
    // 대시보드 데이터에 해당 사이트가 있는지 확인
    const dashboardItem = dashboardMap.get(site.siteCode);

    console.log(site.sequence);
    // 대시보드 데이터가 있으면 해당 데이터 사용, 없으면 기본값(0) 사용
    return {
      siteCode: site.siteCode,
      siteName: site.siteName,
      totalRequests: dashboardItem?.totalCount || 0,
      pendingRequests: dashboardItem?.notCompletedCount || 0,
      completedRequests: dashboardItem?.completedCount || 0,
      sequence: site.sequence || 9,
      lastUpdatedAt: dashboardItem?.lastUpdatedAt || new Date().toISOString(),
      loginId:
        accountMap.get(site.siteCode) ||
        (accountsError ? '계정 정보 조회 실패' : '정보 없음'),
      enabled: siteStatusesError
        ? true
        : (siteStatusMap.get(site.siteCode) ?? true),
    };
  });

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
    errors: {
      dashboard: dashboardError,
      accounts: accountsError,
      siteStatuses: siteStatusesError,
    },
  };
}
export async function getAccountInfo(): Promise<AccountInfoResponseDto | null> {
  try {
    const response = await fetch(`${API_URL}/account`);

    if (!response.ok) {
      return null;
    }

    const data: AccountInfoResponseDto = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}
