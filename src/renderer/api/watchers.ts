import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
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
  const router = useRouter();

  return useMutation({
    mutationFn: () => api.createWatcher(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchers"]
      });
      router.invalidate();
    }
  });
}

export function useUpdateWatcher(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: Partial<Watcher>) => api.updateWatcher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchers", id]
      });
      router.invalidate();
    }
  });
}

export function useDeleteWatcher(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => api.deleteWatcher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchers"]
      });
      router.invalidate();
    }
  });
}
