import { Variables, api } from "./utils";
import { wait } from "@renderer/lib/utils";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { Rule } from "src/main/schema";

export function useCreateRule(watcherId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["watchers", watcherId, "rules"];

  return useMutation({
    mutationFn: (_: Variables) => api.createRule(watcherId),
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}

export function useCopyRule(watcherId: string, ruleId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["watchers", watcherId, "rules"];

  return useMutation({
    mutationFn: (_: Variables) => api.copyRule(ruleId),
    onError: (error, variables) => {
      variables.onError?.(error);
    },
    onSuccess: (_, variables, __) => {
      queryClient.invalidateQueries({ queryKey });
      variables.onSuccess?.();
    },
  });
}

export function useRules(watcherId: string) {
  return useSuspenseQuery({
    queryKey: ["watchers", watcherId, "rules"],
    queryFn: () => api.getRules(watcherId),
  });
}

export function useRule(ruleId: string) {
  return useSuspenseQuery({
    queryKey: ["rules", ruleId],
    queryFn: () => api.getRule(ruleId),
    retry: false,
  });
}

export function useUpdateRule(ruleId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["rules", ruleId];

  return useMutation({
    mutationFn: (variables: Variables<{ data: Partial<Rule> }>) => {
      return api.updateRule(ruleId, variables.data);
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

export function useUpdateRuleOrder(watcherId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["watchers", watcherId, "rules"];

  return useMutation({
    mutationFn: (variables: Variables<{ data: Record<string, number> }>) => {
      return api.updateRuleOrder(watcherId, variables.data);
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

export function useDeleteRule(watcherId: string, ruleId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["watchers", watcherId, "rules"];

  return useMutation({
    mutationFn: async (_: Variables) => {
      return await api.deleteRule(ruleId);
    },
    onMutate: async (_) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<Rule[]>(queryKey);
      if (!prev) return;

      queryClient.setQueryData<Rule[]>(queryKey, () => {
        return prev.filter((rule) => rule.id !== ruleId);
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
      queryClient.removeQueries({ queryKey: [...queryKey, ruleId] });
    },
  });
}
