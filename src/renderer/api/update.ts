import { Variables, api } from "./utils";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

export function useUpdateCheckPolicy() {
  return useSuspenseQuery({
    queryKey: ["update", "check-policy"],
    queryFn: () => api.getUpdateCheckPolicy(),
  });
}

export function useSetUpdateCheckPolicy() {
  const queryClient = useQueryClient();
  const queryKey = ["update", "check-policy"];

  return useMutation({
    mutationFn: (variables: Variables<{ policy: "auto" | "manual" }>) => {
      return api.setUpdateCheckPolicy(variables.policy);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<"auto" | "manual">(queryKey);
      queryClient.setQueryData<string>(queryKey, variables.policy);
      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) return;
      queryClient.setQueryData<"auto" | "manual">(queryKey, context.prev);
      variables.onError?.(error);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}

export function useUpdateDownloadPolicy() {
  return useSuspenseQuery({
    queryKey: ["update", "download-policy"],
    queryFn: () => api.getUpdateDownloadPolicy(),
  });
}

export function useSetUpdateDownloadPolicy() {
  const queryClient = useQueryClient();
  const queryKey = ["update", "download-policy"];

  return useMutation({
    mutationFn: (variables: Variables<{ policy: "auto" | "manual" }>) => {
      return api.setUpdateDownloadPolicy(variables.policy);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<"auto" | "manual">(queryKey);
      queryClient.setQueryData<string>(queryKey, variables.policy);
      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) return;
      queryClient.setQueryData<"auto" | "manual">(queryKey, context.prev);
      variables.onError?.(error);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}

export function useUpdateInstallPolicy() {
  return useSuspenseQuery({
    queryKey: ["update", "install-policy"],
    queryFn: () => api.getUpdateInstallPolicy(),
  });
}

export function useSetUpdateInstallPolicy() {
  const queryClient = useQueryClient();
  const queryKey = ["update", "install-policy"];

  return useMutation({
    mutationFn: (variables: Variables<{ policy: "auto" | "manual" }>) => {
      return api.setUpdateInstallPolicy(variables.policy);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<"auto" | "manual">(queryKey);
      queryClient.setQueryData<string>(queryKey, variables.policy);
      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) return;
      queryClient.setQueryData<"auto" | "manual">(queryKey, context.prev);
      variables.onError?.(error);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}

export function useUpdateInfo(refetchInterval: number = 1000) {
  return useSuspenseQuery({
    queryKey: ["update", "info"],
    queryFn: () => api.getUpdateInfo(),
    refetchInterval,
  });
}
