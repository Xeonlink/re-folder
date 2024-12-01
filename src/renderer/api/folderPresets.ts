import { QueryClient, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { FolderPreset } from "src/main/schema";

type FolderPresetWithChildren = FolderPreset & { children: string[] };

const api = window.api;

export function useRootFolderPresets() {
  return useSuspenseQuery<FolderPreset[]>({
    queryKey: ["folderPresets", null],
    queryFn: () => api.getFolderPresets(null),
  });
}

export function useFolderPreset(id: string) {
  return useSuspenseQuery<FolderPresetWithChildren>({
    queryKey: ["folderPresets", id],
    queryFn: () => api.getFolderPreset(id),
  });
}

export function useCreateFolderPreset(parentId: string | null) {
  const queryClient = useQueryClient();
  const queryKey = ["folderPresets", parentId];

  return useMutation({
    mutationFn: (_: { onError?: (error: Error) => any; onSuccess?: () => any }) => {
      return api.createFolderPreset(parentId);
    },
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}

export function useCopyFolderPreset(parentId: string | null, id: string) {
  const queryClient = useQueryClient();
  const queryKey = ["folderPresets", parentId];

  return useMutation({
    mutationFn: (_: { onError?: (error: Error) => any }) => {
      return api.copyFolderPreset(parentId, id);
    },
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useUpdateFolderPreset(id: string) {
  const queryClient = useQueryClient();
  const queryKey = ["folderPresets", id];

  return useMutation({
    mutationFn: (variables: { data: Partial<FolderPreset>; onError?: (error: Error) => any }) => {
      return api.updateFolderPreset(id, variables.data);
    },
    onMutate: async (variables) => {
      const prev = queryClient.getQueryData<FolderPreset>(["folderPresets", id]);
      if (!prev) return;

      queryClient.setQueryData<FolderPreset>(["folderPresets", id], () => {
        return { ...prev, ...variables.data };
      });
      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) return;
      queryClient.setQueryData<FolderPreset>(["folderPresets", id], context.prev);
      variables.onError?.(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useDeleteFolderPreset(parentId: string | null, id: string) {
  const queryClient = useQueryClient();
  const queryKey = ["folderPresets", parentId];

  return useMutation({
    mutationFn: (_: { onError?: (error: Error) => any }) => {
      return api.deleteFolderPreset(id);
    },
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey, exact: true });
      remove(queryClient, id);
    },
  });
}

export function useDeleteFolderPresetById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { parentId: string | null; id: string; onError?: (error: Error) => any }) => {
      return api.deleteFolderPreset(variables.id);
    },
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["folderPresets", variables.parentId],
        exact: true,
      });
      remove(queryClient, variables.id);
    },
  });
}

/**
 * DFS를 하면서 자기자신과 하위의 folderPreset에 대한 쿼리를 모두 제거한다.
 * @author 오지민
 */
function remove(queryClient: QueryClient, id: string) {
  const folderPreset = queryClient.getQueryData<FolderPresetWithChildren>(["folderPresets", id]);
  if (!folderPreset) return;

  for (const childId of folderPreset.children) {
    remove(queryClient, childId);
  }

  queryClient.removeQueries({ queryKey: ["folderPresets", id], exact: true });
}

export function useApplyFolderPreset(id: string) {
  return useMutation({
    mutationFn: (_: { onError?: (error: Error) => any; onSuccess?: () => any }) => {
      return api.applyFolderPreset(id);
    },
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: (_, variables) => {
      variables.onSuccess?.();
    },
  });
}
