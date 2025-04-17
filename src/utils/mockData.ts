import { DashboardSummary, SiteStatus } from '@/services/dashboardService';

export const mockSiteStatuses: SiteStatus[] = [
  {
    siteCode: 'site_a',
    siteName: 'A 사이트',
    totalRequests: 145,
    pendingRequests: 23,
    completedRequests: 122,
    lastUpdated: new Date().toISOString(),
  },
  {
    siteCode: 'site_b',
    siteName: 'B 사이트',
    totalRequests: 89,
    pendingRequests: 12,
    completedRequests: 77,
    lastUpdated: new Date().toISOString(),
  },
  {
    siteCode: 'site_c',
    siteName: 'C 사이트',
    totalRequests: 56,
    pendingRequests: 8,
    completedRequests: 48,
    lastUpdated: new Date().toISOString(),
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
