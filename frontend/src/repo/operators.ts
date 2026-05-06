import type { Operator } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getOperators(): Promise<Operator[]> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/reports/operators`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error('Failed to fetch operators:', response.status);
    return [];
  }

  return response.json();
}

export async function getOperatorsCached(): Promise<Operator[]> {
  const cacheKey = 'operators_cache';
  const cacheTimeKey = 'operators_cache_time';
  const CACHE_DURATION = 5 * 60 * 1000;

  const cached = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(cacheTimeKey);

  if (cached && cachedTime) {
    const elapsed = Date.now() - parseInt(cachedTime);
    if (elapsed < CACHE_DURATION) {
      return JSON.parse(cached);
    }
  }

  const operators = await getOperators();
  localStorage.setItem(cacheKey, JSON.stringify(operators));
  localStorage.setItem(cacheTimeKey, Date.now().toString());

  return operators;
}

export function clearOperatorsCache() {
  localStorage.removeItem('operators_cache');
  localStorage.removeItem('operators_cache_time');
}