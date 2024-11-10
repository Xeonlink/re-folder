import { useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const api = window.api;

// OpenAI API Key ----------------------------------------------------------
export function useOpenAiApiKey() {
  return useSuspenseQuery({
    queryKey: ["openai", "apikey"],
    queryFn: async () => api.getOpenAiApiKey()
  });
}

export function useUpdateOpenAiApiKey() {
  const queryClient = useQueryClient();
  const queryKey = ["openai", "apikey"];

  return useMutation({
    mutationFn: (variables: { data: string; onError?: (error: Error) => any }) => {
      return api.updateOpenAiApiKey(variables.data);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<string>(queryKey);
      if (!prev) return;

      queryClient.setQueryData<string>(queryKey, () => {
        return variables.data;
      });
      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) return;
      queryClient.setQueryData<string>(queryKey, context.prev);
      variables.onError?.(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });
}

// OpenAI Model ----------------------------------------------------------
export function useOpenAiModel() {
  return useSuspenseQuery({
    queryKey: ["openai", "model"],
    queryFn: async () => api.getOpenAiModel()
  });
}

export function useUpdateOpenAiModel() {
  const queryClient = useQueryClient();
  const queryKey = ["openai", "model"];

  return useMutation({
    mutationFn: (variables: { data: string; onError?: (error: Error) => any }) => {
      return api.updateOpenAiModel(variables.data);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<string>(queryKey);
      if (!prev) return;

      queryClient.setQueryData<string>(queryKey, () => {
        return variables.data;
      });
      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) return;
      queryClient.setQueryData<string>(queryKey, context.prev);
      variables.onError?.(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });
}
