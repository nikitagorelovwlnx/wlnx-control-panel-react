import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { USERS_QUERY_KEY } from '@/features/users/api/use-users';

export function useSession(sessionId: string | null) {
  return useQuery({
    queryKey: ['sessions', sessionId],
    queryFn: () => apiClient.getSession(sessionId!),
    enabled: !!sessionId,
    refetchInterval: 1000, // 1 second for fast transcription updates
    staleTime: 500,
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => apiClient.deleteSession(sessionId),
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}
