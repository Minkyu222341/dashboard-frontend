import {
  DashboardSummary,
  SiteStatus,
  AccountInfoResponseDto,
} from '@/services/dashboardService';

export const mockScheduleStatus = {
  status: true, // 기본적으로 스케줄링 활성화 상태
};

export const mockSiteStatuses: SiteStatus[] = [
  {
    siteCode: 'site_a',
    siteName: '부산학교',
    totalRequests: 145,
    pendingRequests: 23,
    completedRequests: 122,
    lastUpdatedAt: new Date().toISOString(),
    sequence: 1,
  },
  {
    siteCode: 'site_b',
    siteName: '부산행정',
    totalRequests: 89,
    pendingRequests: 12,
    completedRequests: 77,
    lastUpdatedAt: new Date().toISOString(),
    sequence: 2,
  },
  {
    siteCode: 'site_c',
    siteName: '부산본청',
    totalRequests: 56,
    pendingRequests: 8,
    completedRequests: 48,
    lastUpdatedAt: new Date().toISOString(),
    sequence: 3,
  },
  {
    siteCode: 'site_d',
    siteName: '경남행정',
    totalRequests: 200,
    pendingRequests: 50,
    completedRequests: 150,
    lastUpdatedAt: new Date().toISOString(),
    sequence: 4,
  },
  {
    siteCode: 'site_e',
    siteName: '창원대',
    totalRequests: 300,
    pendingRequests: 100,
    completedRequests: 200,
    lastUpdatedAt: new Date().toISOString(),
    sequence: 5,
  },
  {
    siteCode: 'site_f',
    siteName: '해양대',
    totalRequests: 400,
    pendingRequests: 150,
    completedRequests: 250,
    lastUpdatedAt: new Date().toISOString(),
    sequence: 6,
  },
  {
    siteCode: 'site_g',
    siteName: '경상대',
    totalRequests: 500,
    pendingRequests: 200,
    completedRequests: 300,
    lastUpdatedAt: new Date().toISOString(),
    sequence: 7,
  },
  {
    siteCode: 'site_h',
    siteName: '서울교대',
    totalRequests: 350,
    pendingRequests: 130,
    completedRequests: 220,
    lastUpdatedAt: new Date().toISOString(),
    sequence: 8,
  },
  {
    siteCode: 'site_i',
    siteName: '늘봄서비스',
    totalRequests: 210,
    pendingRequests: 40,
    completedRequests: 170,
    lastUpdatedAt: new Date().toISOString(),
    sequence: 9,
  },
];

export const mockDashboardSummary: DashboardSummary = {
  totalSites: mockSiteStatuses.length,
  totalRequests: mockSiteStatuses.reduce(
    (sum, site) => sum + site.totalRequests,
    0,
  ),
  pendingRequests: mockSiteStatuses.reduce(
    (sum, site) => sum + site.pendingRequests,
    0,
  ),
  completedRequests: mockSiteStatuses.reduce(
    (sum, site) => sum + site.completedRequests,
    0,
  ),
  siteStatuses: mockSiteStatuses,
};

// 계정 정보 mock 데이터 추가
export const mockAccountsData: AccountInfoResponseDto[] = [
  { siteCode: 'site_a', loginId: '부산교육청행정_아이디' },
  { siteCode: 'site_b', loginId: '경상국립대학교_아이디' },
  { siteCode: 'site_c', loginId: '부산교육청본청_아이디' },
  { siteCode: 'site_d', loginId: '창원대학교_아이디' },
  { siteCode: 'site_e', loginId: '늘봄학교서비스_아이디' },
  { siteCode: 'site_f', loginId: '서울교대헬프센터_아이디' },
  { siteCode: 'site_g', loginId: '경상남도교육청_아이디' },
  { siteCode: 'site_h', loginId: '부산교육청학교_아이디' },
  { siteCode: 'site_i', loginId: '한국해양대학교_아이디' },
];
