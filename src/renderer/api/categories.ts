import { Variables, api } from "./utils";
import { wait } from "@renderer/lib/utils";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { Rule } from "src/main/schema";

export function useCreateCategory(aiwatcherId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["ai-watchers", aiwatcherId, "categories"];

  return useMutation({
    mutationFn: (_: Variables) => api.createCategory(aiwatcherId),
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}

export function useCopyCategory(aiwatcherId: string, categoryId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["ai-watchers", aiwatcherId, "categories"];

  return useMutation({
    mutationFn: (_: Variables) => api.copyRule(categoryId),
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}

export function useCategories(aiwatcherId: string) {
  return useSuspenseQuery({
    queryKey: ["ai-watchers", aiwatcherId, "categories"],
    queryFn: () => api.getRules(aiwatcherId),
  });
}

export function useCategory(categoryId: string) {
  return useSuspenseQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => api.getRule(categoryId),
    retry: false,
  });
}

export function useUpdateCategory(categoryId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["categories", categoryId];

  return useMutation({
    mutationFn: (variables: Variables<{ data: Partial<Rule> }>) => {
      return api.updateRule(categoryId, variables.data);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<Rule>(queryKey);
      if (!prev) return;

      queryClient.setQueryData<Rule>(queryKey, () => {
        return { ...prev, ...variables.data };
      });
      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) return;
      queryClient.setQueryData<Rule>(queryKey, context.prev);
      variables.onError?.(error);
    },
    onSuccess: (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}

export function useUpdateCategoryOrder(categoryId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["ai-watchers", categoryId, "categories"];

  return useMutation({
    mutationFn: (variables: Variables<{ data: Record<string, number> }>) => {
      return api.updateRuleOrder(categoryId, variables.data);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<Rule[]>(queryKey);
      if (!prev) return;

      queryClient.setQueryData<Rule[]>(queryKey, () => {
        return prev
          .map((rule) => ({ ...rule, order: variables.data[rule.id] ?? rule.order }))
          .sort((a, b) => a.order - b.order);
      });
      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) return;
      queryClient.setQueryData<Rule[]>(queryKey, context.prev);
      variables.onError?.(error);
    },
    onSuccess: (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}

export function useDeleteCategory(aiwatcherId: string, categoryId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["ai-watchers", aiwatcherId, "categories"];

  return useMutation({
    mutationFn: async (_: Variables) => {
      return await api.deleteRule(categoryId);
    },
    onMutate: async (_) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<Rule[]>(queryKey);
      if (!prev) return;

      queryClient.setQueryData<Rule[]>(queryKey, () => {
        return prev.filter((rule) => rule.id !== categoryId);
      });
      return { prev };
    },
    onError: (error, variables, context) => {
      if (!context?.prev) return;
      queryClient.setQueryData<Rule[]>(queryKey, context.prev);
      variables.onError?.(error);
    },
    onSuccess: async (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
      await wait(1000);
      queryClient.removeQueries({ queryKey: [...queryKey, categoryId] });
    },
  });
}
