// pages/api/accounts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { mockAccountsData } from '@/utils/mockData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // mockAccountsData를 그대로 반환
    res.status(200).json(mockAccountsData);

    /* 실제 API 호출 코드 (주석 처리)
    const apiUrl = process.env.BACKEND_API_URL;
    
    const response = await fetch(`${apiUrl}/accounts`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    res.status(200).json(data);
    */
  } catch (error) {
    console.error('API proxy error:', error);
    res
      .status(500)
      .json({ error: 'Failed to fetch account data from backend' });
  }
}
