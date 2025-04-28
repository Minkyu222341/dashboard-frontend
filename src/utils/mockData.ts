import {
  DashboardSummary,
  SiteStatus,
  AccountInfoResponseDto,
} from '@/services/dashboardService';

export const mockSiteStatuses: SiteStatus[] = [
  {
    siteCode: 'site_a',
    siteName: 'A 사이트',
    totalRequests: 145,
    pendingRequests: 23,
    completedRequests: 122,
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    siteCode: 'site_b',
    siteName: 'B 사이트',
    totalRequests: 89,
    pendingRequests: 12,
    completedRequests: 77,
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    siteCode: 'site_c',
    siteName: 'C 사이트',
    totalRequests: 56,
    pendingRequests: 8,
    completedRequests: 48,
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    siteCode: 'site_d',
    siteName: 'D 사이트',
    totalRequests: 200,
    pendingRequests: 50,
    completedRequests: 150,
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    siteCode: 'site_e',
    siteName: 'E 사이트',
    totalRequests: 300,
    pendingRequests: 100,
    completedRequests: 200,
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    siteCode: 'site_f',
    siteName: 'F 사이트',
    totalRequests: 400,
    pendingRequests: 150,
    completedRequests: 250,
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    siteCode: 'site_g',
    siteName: 'G 사이트',
    totalRequests: 500,
    pendingRequests: 200,
    completedRequests: 300,
    lastUpdatedAt: new Date().toISOString(),
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
  { siteCode: 'site_a', loginId: '임시로그인아이디te_a' },
  { siteCode: 'site_b', loginId: '임시로그인아이디te_b' },
  { siteCode: 'site_c', loginId: '임시로그인아이디te_c' },
  { siteCode: 'site_d', loginId: '임시로그인아이디te_d' },
  { siteCode: 'site_e', loginId: '임시로그인아이디te_e' },
  { siteCode: 'site_f', loginId: '임시로그인아이디te_f' },
  { siteCode: 'site_g', loginId: '임시로그인아이디te_g' },
];
