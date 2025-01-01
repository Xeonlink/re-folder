import { type Variables, api } from "./utils";
import { wait } from "@renderer/lib/utils";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { Watcher } from "src/main/schema";

export function useAIWatchers() {
  return useSuspenseQuery<Watcher[]>({
    queryKey: ["ai-watchers"],
    queryFn: () => api.getWatchers(),
  });
}

export function useAIWatcher(aiwatcherId: string) {
  return useSuspenseQuery<Watcher>({
    queryKey: ["ai-watchers", aiwatcherId],
    queryFn: () => api.getWatcher(aiwatcherId),
  });
}

export function useCreateAIWatcher() {
  const queryClient = useQueryClient();
  const queryKey = ["ai-watchers"];

  return useMutation({
    mutationFn: (_: Variables) => {
      return api.createWatcher();
    },
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}

export function useCopyAIWatcher(aiwatcherId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["ai-watchers"];

  return useMutation({
    mutationFn: (_: Variables) => {
      return api.copyWatcher(aiwatcherId);
    },
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}

export function useUpdateAIWatcher(aiwatcherId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["ai-watchers", aiwatcherId];

  return useMutation({
    mutationFn: (variables: Variables<{ data: Partial<Watcher> }>) => {
      return api.updateWatcher(aiwatcherId, variables.data);
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<Watcher>(queryKey);
      if (!prev) return;

      queryClient.setQueryData<Watcher>(queryKey, () => {
        return { ...prev, ...data };
      });
      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) return;
      queryClient.setQueryData<Watcher>(queryKey, context.prev);
      variables.onError?.(error);
    },
    onSuccess: (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}

export function useDeleteAIWatcher(aiwatcherId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["ai-watchers"];

  return useMutation({
    mutationFn: (_: Variables) => api.deleteWatcher(aiwatcherId),
    onMutate: async (_) => {
      queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<Watcher[]>(queryKey);
      if (!prev) return;

      queryClient.setQueryData<Watcher[]>(queryKey, () => {
        return prev.filter((watcher) => watcher.id !== aiwatcherId);
      });
      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) return;
      queryClient.setQueryData<Watcher[]>(queryKey, context.prev);
      variables.onError?.(error);
    },
    onSuccess: async (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey, exact: true });
      variables.onSuccess?.();
      await wait(1000);
      queryClient.removeQueries({ queryKey: [...queryKey, aiwatcherId] });
    },
  });
}

export function useRunAIWatcher(aiwatcherId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["ai-watchers", aiwatcherId];

  return useMutation({
    mutationFn: (_: Variables) => api.runWatcher(aiwatcherId),
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}
