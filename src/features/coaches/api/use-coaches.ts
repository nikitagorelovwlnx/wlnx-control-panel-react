import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { Coach } from '@/shared/types/api';

export const COACHES_KEY = ['coaches'];

export function useCoaches() {
  return useQuery({
    queryKey: COACHES_KEY,
    queryFn: () => apiClient.getCoaches(),
    staleTime: 10000,
  });
}

export function useCreateCoach() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coach: Omit<Coach, 'id' | 'createdAt' | 'updatedAt'>) =>
      apiClient.createCoach(coach),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COACHES_KEY });
    },
  });
}

export function useUpdateCoach() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, coach }: { id: string; coach: Partial<Coach> }) =>
      apiClient.updateCoach(id, coach),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COACHES_KEY });
    },
  });
}

export function useDeleteCoach() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteCoach(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COACHES_KEY });
    },
  });
}
