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
  } catch (error) {
    console.error('API proxy error:', error);
    res
      .status(500)
      .json({ error: 'Failed to fetch account data from backend' });
  }
}
