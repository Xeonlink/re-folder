import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { FolderPreset } from "src/main/schema";

const api = window.api;

export function useFolderPresets(parentId: string | null) {
  return useSuspenseQuery<FolderPreset[]>({
    queryKey: ["folderPresets"],
    queryFn: () => api.getFolderPresets(parentId)
  });
}

export function useFolderPreset(id: string) {
  return useSuspenseQuery<FolderPreset>({
    queryKey: ["folderPresets", id],
    queryFn: () => api.getFolderPreset(id)
  });
}

export function useCreateFolderPreset() {
  const queryClient = useQueryClient();
  const queryKey = ["folderPresets"];

  return useMutation({
    mutationFn: (_: { onError?: (error: Error) => any }) => {
      return api.createFolderPreset();
    },
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });
}

export function useUpdateFolderPreset(id: string) {
  const queryClient = useQueryClient();
  const queryKey = ["folderPresets", id];

  return useMutation({
    mutationFn: (variables: {
      id: string;
      data: Partial<FolderPreset>;
      onError?: (error: Error) => any;
    }) => {
      return api.updateFolderPreset(variables.id, variables.data);
    },
    onMutate: async (variables) => {
      const prev = queryClient.getQueryData<FolderPreset>(["folderPresets", variables.id]);
      if (!prev) return;

      queryClient.setQueryData<FolderPreset>(["folderPresets", variables.id], () => {
        return { ...prev, ...variables.data };
      });
      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) return;
      queryClient.setQueryData<FolderPreset>(["folderPresets", variables.id], context.prev);
      variables.onError?.(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });
}

export function useDeleteWatcher(id: string) {
  const queryClient = useQueryClient();
  const queryKey = ["folderPresets"];

  return useMutation({
    mutationFn: (_: { onError: (error: Error) => any }) => {
      return api.deleteFolderPreset(id);
    },
    onMutate: async (_) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<FolderPreset[]>(queryKey);
      if (!prev) return;

      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) return;
      queryClient.setQueryData<FolderPreset[]>(queryKey, context.prev);
      variables.onError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.removeQueries({ queryKey: [...queryKey, id] });
    }
  });
}
