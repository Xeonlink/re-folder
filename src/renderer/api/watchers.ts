import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Watcher } from "src/main/schema";

const api = window.api;

export function useWatchers() {
  return useQuery<Watcher[]>({
    queryKey: ["watchers"],
    queryFn: () => api.getWatchers()
  });
}

export function useWatcher(id: string) {
  return useQuery<Watcher>({
    queryKey: ["watchers", id],
    queryFn: async () => await api.getWatcher(id)
  });
}

export function useCreateWatcher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.createWatcher(),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["watchers"]
      })
  });
}

export function useUpdateWatcher(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Watcher>) => api.updateWatcher(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["watchers", id]
      })
  });
}

export function useDeleteWatcher(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.deleteWatcher(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["watchers"]
      })
  });
}
