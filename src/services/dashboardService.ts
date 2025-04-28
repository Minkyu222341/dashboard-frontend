// 사이트 상태 타입
export interface SiteStatus {
  siteCode: string;
  siteName: string;
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  lastUpdatedAt: string;
  loginId?: string; // 로그인 아이디 추가
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
  };
}

// 백엔드 API 응답 타입
export interface DashBoardResponseDto {
  siteCode: string;
  siteName: string;
  completedCount: number;
  notCompletedCount: number;
  totalCount: number;
  lastUpdatedAt: string;
  loginId?: string; // 로그인 아이디 추가
}

// 계정 정보 응답 타입
export interface AccountInfoResponseDto {
  siteCode: string;
  loginId: string;
}

// 백엔드 API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDashboardSummary(): Promise<DashboardSummary> {
  // 대시보드 데이터 가져오기
  let dashboardData: DashBoardResponseDto[] = [];
  let dashboardError = false;

  try {
    const dashboardResponse = await fetch(`${API_URL}/dashboard`);
    if (dashboardResponse.ok) {
      dashboardData = await dashboardResponse.json();
    } else {
      console.error(`대시보드 API 호출 오류: ${dashboardResponse.status}`);
      dashboardError = true;
    }
  } catch (error) {
    console.error('대시보드 데이터 가져오기 실패:', error);
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
      console.error(`계정 API 호출 오류: ${accountsResponse.status}`);
      accountsError = true;
    }
  } catch (error) {
    console.error('계정 정보 가져오기 실패:', error);
    accountsError = true;
  }

  // 계정 정보로 맵 생성
  const accountMap = new Map<string, string>();
  accountsData.forEach(account => {
    accountMap.set(account.siteCode, account.loginId);
  });

  // 사이트 상태 정보와 계정 정보 조합
  const siteStatuses: SiteStatus[] = dashboardData.map(item => ({
    siteCode: item.siteCode,
    siteName: item.siteName,
    totalRequests: item.totalCount || 0,
    pendingRequests: item.notCompletedCount || 0,
    completedRequests: item.completedCount || 0,
    lastUpdatedAt: item.lastUpdatedAt || new Date().toISOString(),
    loginId:
      accountMap.get(item.siteCode) ||
      (accountsError ? '계정 정보 조회 실패' : '정보 없음'),
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
    errors: {
      dashboard: dashboardError,
      accounts: accountsError,
    },
  };
}

export async function getAccountInfo(): Promise<AccountInfoResponseDto | null> {
  try {
    const response = await fetch(`${API_URL}/account`);

    if (!response.ok) {
      console.error(`API 호출 오류: ${response.status}`);
      return null;
    }

    const data: AccountInfoResponseDto = await response.json();
    return data;
  } catch (error) {
    console.error('계정 정보 가져오기 실패:', error);
    return null;
  }
}
