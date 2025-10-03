import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { ConversationStage, Prompt } from '@/shared/types/api';

export const PROMPTS_CONFIG_KEY = ['prompts', 'configuration'];
export const STAGES_KEY = ['prompts', 'stages'];
export const PROMPTS_KEY = ['prompts'];

export function usePromptsConfiguration() {
  return useQuery({
    queryKey: PROMPTS_CONFIG_KEY,
    queryFn: () => apiClient.getPromptsConfiguration(),
    staleTime: 10000,
  });
}

export function useStages() {
  return useQuery({
    queryKey: STAGES_KEY,
    queryFn: () => apiClient.getStages(),
    staleTime: 10000,
  });
}

export function useCreateStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stage: Omit<ConversationStage, 'id'>) => apiClient.createStage(stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAGES_KEY });
      queryClient.invalidateQueries({ queryKey: PROMPTS_CONFIG_KEY });
    },
  });
}

export function useUpdateStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: Partial<ConversationStage> }) =>
      apiClient.updateStage(id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAGES_KEY });
      queryClient.invalidateQueries({ queryKey: PROMPTS_CONFIG_KEY });
    },
  });
}

export function useDeleteStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteStage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAGES_KEY });
      queryClient.invalidateQueries({ queryKey: PROMPTS_CONFIG_KEY });
    },
  });
}

export function usePrompts() {
  return useQuery({
    queryKey: PROMPTS_KEY,
    queryFn: () => apiClient.getPrompts(),
    staleTime: 10000,
  });
}

export function useCreatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prompt: Omit<Prompt, 'id'>) => apiClient.createPrompt(prompt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMPTS_KEY });
      queryClient.invalidateQueries({ queryKey: PROMPTS_CONFIG_KEY });
    },
  });
}

export function useUpdatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, prompt }: { id: string; prompt: Partial<Prompt> }) =>
      apiClient.updatePrompt(id, prompt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMPTS_KEY });
      queryClient.invalidateQueries({ queryKey: PROMPTS_CONFIG_KEY });
    },
  });
}

export function useDeletePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deletePrompt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMPTS_KEY });
      queryClient.invalidateQueries({ queryKey: PROMPTS_CONFIG_KEY });
    },
  });
}
