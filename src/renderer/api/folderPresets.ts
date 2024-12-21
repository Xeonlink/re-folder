import { Variables, api } from "./utils";
import { wait } from "@renderer/lib/utils";
import { QueryClient, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { FolderPreset } from "src/main/schema";

type FolderPresetWithChildren = FolderPreset & { children: string[] };

export function useRootFolderPresets() {
  return useSuspenseQuery<FolderPreset[]>({
    queryKey: ["folderPresets", null],
    queryFn: () => api.getFolderPresets(null),
  });
}

export function useFolderPreset(id: string) {
  return useSuspenseQuery<FolderPresetWithChildren>({
    queryKey: ["folderPresets", id],
    // queryFn: () => api.getFolderPreset(id),
    queryFn: () => wait(10000).then(() => api.getFolderPreset(id)),
  });
}

export function useCreateFolderPreset(parentId: string | null) {
  const queryClient = useQueryClient();
  const queryKey = ["folderPresets", parentId];

  return useMutation({
    mutationFn: (_: Variables) => {
      return api.createFolderPreset(parentId);
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

export function useCopyFolderPreset(parentId: string | null, id: string) {
  const queryClient = useQueryClient();
  const queryKey = ["folderPresets", parentId];

  return useMutation({
    mutationFn: (_: Variables) => {
      return api.copyFolderPreset(parentId, id);
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

export function useUpdateFolderPreset(id: string) {
  const queryClient = useQueryClient();
  const queryKey = ["folderPresets", id];

  return useMutation({
    mutationFn: (variables: Variables<{ data: Partial<FolderPreset> }>) => {
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
    onSuccess: (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}

export function useDeleteFolderPreset(parentId: string | null, id: string) {
  const queryClient = useQueryClient();
  const queryKey = ["folderPresets", parentId];

  return useMutation({
    mutationFn: (_: Variables) => {
      return api.deleteFolderPreset(id);
    },
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: async (_, variables, __) => {
      await queryClient.invalidateQueries({ queryKey, exact: true });
      variables.onSuccess?.();
      await wait(1000);
      removeQueries(queryClient, id);
    },
  });
}

export function useDeleteFolderPresetById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: Variables<{ parentId: string | null; id: string }>) => {
      return api.deleteFolderPreset(variables.id);
    },
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: async (_, variables, __) => {
      await queryClient.invalidateQueries({ queryKey: ["folderPresets", variables.parentId], exact: true });
      variables.onSuccess?.();
      await wait(1000);
      removeQueries(queryClient, variables.id);
    },
  });
}

/**
 * DFS를 하면서 자기자신과 하위의 folderPreset에 대한 쿼리를 모두 제거한다.
 *
 * @author 오지민
 */
function removeQueries(queryClient: QueryClient, id: string) {
  const folderPreset = queryClient.getQueryData<FolderPresetWithChildren>(["folderPresets", id]);
  if (!folderPreset) return;

  for (const childId of folderPreset.children) {
    removeQueries(queryClient, childId);
  }

  queryClient.removeQueries({ queryKey: ["folderPresets", id], exact: true });
}

export function useApplyFolderPreset(id: string) {
  return useMutation({
    mutationFn: (_: Variables) => {
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
