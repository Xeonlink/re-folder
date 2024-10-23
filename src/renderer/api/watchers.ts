import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { Watcher } from "src/main/schema";

const api = window.api;

export function useWatchers() {
  return useSuspenseQuery<Watcher[]>({
    queryKey: ["watchers"],
    queryFn: () => api.getWatchers()
  });
}

export function useWatcher(id: string) {
  return useSuspenseQuery<Watcher>({
    queryKey: ["watchers", id],
    queryFn: () => api.getWatcher(id)
  });
}

export function useCreateWatcher() {
  const queryClient = useQueryClient();
  const queryKey = ["watchers"];

  return useMutation({
    mutationFn: (_: { onError?: (error: Error) => any }) => {
      return api.createWatcher();
    },
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });
}

export function useUpdateWatcher(id: string) {
  const queryClient = useQueryClient();
  const queryKey = ["watchers", id];

  return useMutation({
    mutationFn: (variables: { data: Partial<Watcher>; onError?: (error: Error) => any }) => {
      return api.updateWatcher(id, variables.data);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });
}

export function useDeleteWatcher(watcherId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["watchers"];

  return useMutation({
    mutationFn: (_: { onError: (error: Error) => any }) => api.deleteWatcher(watcherId),
    onMutate: async (_) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<Watcher[]>(queryKey);
      if (!prev) return;

      queryClient.setQueryData<Watcher[]>(queryKey, () => {
        return prev.filter((watcher) => watcher.id !== watcherId);
      });
      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) return;
      queryClient.setQueryData<Watcher[]>(queryKey, context.prev);
      variables.onError?.(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.removeQueries({ queryKey: [...queryKey, watcherId] });
    }
  });
}
