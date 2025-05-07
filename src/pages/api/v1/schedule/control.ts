// pages/api/v1/schedule/control.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { mockScheduleStatus } from '@/utils/mockData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // 요청 본문에서 status 값 가져오기
    const { status } = req.body;

    if (typeof status !== 'boolean') {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    // 상태 업데이트 (실제로는 서버에서 상태를 저장해야 함)
    mockScheduleStatus.status = status;

    // 업데이트된 상태 반환
    res.status(200).json(mockScheduleStatus);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to update scheduling status' });
  }
}
