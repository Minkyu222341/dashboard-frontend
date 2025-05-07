// pages/api/v1/schedule/status.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { mockScheduleStatus } from '@/utils/mockData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // 스케줄링 상태 조회 API
    res.status(200).json(mockScheduleStatus);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch scheduling status' });
  }
}
