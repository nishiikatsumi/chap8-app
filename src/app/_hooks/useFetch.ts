import useSWR from 'swr';
import { useSupabaseSession } from './useSupabaseSession';

// 汎用fetcher関数
const fetcher = async (url: string, token?: string): Promise<unknown> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = token;
  }

  const res = await fetch(url, {
    headers,
    cache: 'no-store',
  });

  // 404の場合はnullを返す
  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${url}`);
  }

  const data: unknown = await res.json();
  return data;
};

// 認証が必要なエンドポイント用のuseFetch
export function useFetch<T>(endpoint: string | null, requireAuth: boolean = true) {
  const { token, isLoading: isTokenLoading } = useSupabaseSession();

  // 認証が必要な場合、tokenがない、またはtokenが読み込み中の場合はnullを返す
  const key = endpoint && (!requireAuth || (token && !isTokenLoading))
    ? requireAuth
      ? [endpoint, token]
      : endpoint
    : null;

  const { data, error, isLoading, mutate } = useSWR<T | null>(
    key,
    requireAuth
      ? ([url, tkn]: [string, string]) => fetcher(url, tkn) as Promise<T | null>
      : (url: string) => fetcher(url) as Promise<T | null>
  );

  return {
    data: data ?? null,
    error,
    isLoading: requireAuth ? isLoading || isTokenLoading : isLoading,
    mutate,
    token: requireAuth ? token : null,
  };
}

// 認証不要なエンドポイント用のuseFetch（パブリックAPI）
export function usePublicFetch<T>(endpoint: string | null) {
  return useFetch<T>(endpoint, false);
}
