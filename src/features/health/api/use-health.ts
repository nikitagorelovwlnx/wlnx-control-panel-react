import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';

export function useSystemStatus() {
  return useQuery({
    queryKey: ['system', 'status'],
    queryFn: () => apiClient.getSystemStatus(),
    refetchInterval: 30000, // Check every 30 seconds
    staleTime: 20000,
    retry: false,
  });
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.getHealth(),
    refetchInterval: 30000,
    staleTime: 20000,
    retry: false,
  });
}

export function useBotHealth() {
  return useQuery({
    queryKey: ['bot', 'health'],
    queryFn: () => apiClient.getBotHealth(),
    refetchInterval: 30000,
    staleTime: 20000,
    retry: false,
  });
}
