import { apiFetch } from '@/lib/api';
import type { Operator } from '@/types';

export async function getOperators(): Promise<Operator[]> {
  try {
    return await apiFetch<Operator[]>('/reports/operators');
  } catch (error) {
    console.error('Failed to fetch operators:', error);
    return [];
  }
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