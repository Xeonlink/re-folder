import { Variables, api } from "./utils";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

export function useVersion() {
  return useSuspenseQuery({
    queryKey: ["version"],
    queryFn: () => api.getVersion(),
    staleTime: Infinity,
  });
}

export function usePlatform() {
  return useSuspenseQuery({
    queryKey: ["platform"],
    queryFn: () => api.getPlatform(),
    staleTime: Infinity,
  });
}

// update ---------------------------------
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
