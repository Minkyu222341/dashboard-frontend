import api from './api';

// 스케줄링 상태 응답 타입
export interface ScheduleStatusResponse {
  status: boolean;
}

// 스케줄링 간격 응답 타입
export interface ScheduleIntervalResponse {
  interval: number;
}

// 사이트별 크롤러 상태 응답 타입
export interface SiteStatusResponse {
  siteCode: string;
  siteName: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// 사이트별 크롤러 상태 요청 타입
export interface SiteStatusRequest {
  enabled: boolean;
}

/**
 * 스케줄링 상태 조회
 * @returns 스케줄링 활성화 상태
 */
export async function getScheduleStatus(): Promise<ScheduleStatusResponse> {
  try {
    const response = await api.get('/schedule/status');
    return response.data;
  } catch (error) {
    console.error('스케줄링 상태 조회 실패:', error);
    throw error;
  }
}

/**
 * 스케줄링 상태 변경
 * @param enabled 활성화 여부
 * @returns 변경된 스케줄링 상태
 */
export async function setScheduleStatus(
  enabled: boolean,
): Promise<ScheduleStatusResponse> {
  try {
    const response = await api.put('/schedule/status', {
      status: enabled,
    });
    return response.data;
  } catch (error) {
    console.error('스케줄링 상태 변경 실패:', error);
    throw error;
  }
}

/**
 * 갱신 간격 조회
 * @returns 현재 설정된 갱신 간격 (밀리초)
 */
export async function getScheduleInterval(): Promise<ScheduleIntervalResponse> {
  try {
    const response = await api.get('/schedule/interval');
    return response.data;
  } catch (error) {
    console.error('갱신 간격 조회 실패:', error);
    throw error;
  }
}

/**
 * 갱신 간격 설정
 * @param interval 간격 (밀리초)
 * @returns 변경된 갱신 간격
 */
export async function setScheduleInterval(
  interval: number,
): Promise<ScheduleIntervalResponse> {
  try {
    const response = await api.post('/schedule/interval', {
      interval: interval,
    });
    return response.data;
  } catch (error) {
    console.error('갱신 간격 설정 실패:', error);
    throw error;
  }
}

/**
 * 모든 사이트의 크롤러 상태 조회
 * @returns 사이트별 크롤러 상태 목록
 */
export async function getAllSitesStatus(): Promise<SiteStatusResponse[]> {
  try {
    const response = await api.get('/schedule/sites/status');
    return response.data;
  } catch (error) {
    console.error('사이트별 크롤러 상태 조회 실패:', error);
    throw error;
  }
}

/**
 * 특정 사이트의 크롤러 상태 조회
 * @param siteCode 사이트 코드
 * @returns 해당 사이트의 크롤러 상태
 */
export async function getSiteStatus(
  siteCode: string,
): Promise<SiteStatusResponse> {
  try {
    const response = await api.get(`/schedule/sites/${siteCode}/status`);
    return response.data;
  } catch (error) {
    console.error(`${siteCode} 크롤러 상태 조회 실패:`, error);
    throw error;
  }
}

/**
 * 특정 사이트의 크롤러 상태 변경
 * @param siteCode 사이트 코드
 * @param enabled 활성화 여부
 * @returns 변경된 사이트의 크롤러 상태
 */
export async function setSiteStatus(
  siteCode: string,
  enabled: boolean,
): Promise<SiteStatusResponse> {
  try {
    const response = await api.put(`/schedule/sites/${siteCode}/status`, {
      enabled: enabled,
    });
    return response.data;
  } catch (error) {
    console.error(`${siteCode} 크롤러 상태 변경 실패:`, error);
    throw error;
  }
}
