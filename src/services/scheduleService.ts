import api from './api';

// 스케줄링 상태 응답 타입
export interface ScheduleStatusResponse {
  status: boolean;
}

// 스케줄링 간격 응답 타입
export interface ScheduleIntervalResponse {
  interval: number;
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
