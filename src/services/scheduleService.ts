import api from './api';

// 스케줄링 상태 응답 타입
export interface ScheduleStatusResponse {
  status: boolean;
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
    const response = await api.post('/schedule/control', {
      status: enabled,
    });
    return response.data;
  } catch (error) {
    console.error('스케줄링 상태 변경 실패:', error);
    throw error;
  }
}
