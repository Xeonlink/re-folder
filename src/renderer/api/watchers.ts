import type { Watcher } from "@/main/schema";
import { wait } from "@/renderer/lib/utils";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { type Variables, api } from "./utils";

export function useWatchers() {
  return useSuspenseQuery<Watcher[]>({
    queryKey: ["watchers"],
    queryFn: () => api.getWatchers(),
  });
}

export function useWatcher(watcherId: string) {
  return useSuspenseQuery<Watcher>({
    queryKey: ["watchers", watcherId],
    queryFn: () => api.getWatcher(watcherId),
  });
}

export function useCreateWatcher() {
  const queryClient = useQueryClient();
  const queryKey = ["watchers"];

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

export function useCopyWatcher(watcherId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["watchers"];

  return useMutation({
    mutationFn: (_: Variables) => {
      return api.copyWatcher(watcherId);
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

export function useUpdateWatcher(watcherId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["watchers", watcherId];

  return useMutation({
    mutationFn: (variables: Variables<{ data: Partial<Watcher> }>) => {
      return api.updateWatcher(watcherId, variables.data);
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<Watcher>(queryKey);
      if (!prev) {
        return;
      }

      queryClient.setQueryData<Watcher>(queryKey, () => {
        return { ...prev, ...data };
      });
      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) {
        return;
      }
      queryClient.setQueryData<Watcher>(queryKey, context.prev);
      variables.onError?.(error);
    },
    onSuccess: (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}

export function useDeleteWatcher(watcherId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["watchers"];

  return useMutation({
    mutationFn: (_: Variables) => api.deleteWatcher(watcherId),
    onMutate: async (_) => {
      queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<Watcher[]>(queryKey);
      if (!prev) {
        return;
      }

      queryClient.setQueryData<Watcher[]>(queryKey, () => {
        return prev.filter((watcher) => watcher.id !== watcherId);
      });
      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) {
        return;
      }
      queryClient.setQueryData<Watcher[]>(queryKey, context.prev);
      variables.onError?.(error);
    },
    onSuccess: async (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey, exact: true });
      variables.onSuccess?.();
      await wait(1000);
      queryClient.removeQueries({ queryKey: [...queryKey, watcherId] });
    },
  });
}

export function useRunWatcher(watcherId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["watchers", watcherId];

  return useMutation({
    mutationFn: (_: Variables) => api.runWatcher(watcherId),
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}
