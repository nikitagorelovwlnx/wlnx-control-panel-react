import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';

export const USERS_QUERY_KEY = ['users'];

export function useUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => apiClient.getUsers(),
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 3000,
  });
}

export function useUserSessions(email: string | null) {
  return useQuery({
    queryKey: ['users', email, 'sessions'],
    queryFn: () => apiClient.getUserSessions(email!),
    enabled: !!email,
    refetchInterval: 5000,
    staleTime: 3000,
  });
}

export function useDeleteAllUserSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => apiClient.deleteAllUserSessions(email),
    onSuccess: (_, email) => {
      // Invalidate users list and specific user sessions
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['users', email, 'sessions'] });
    },
  });
}
