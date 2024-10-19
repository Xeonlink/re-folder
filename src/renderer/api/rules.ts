import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Rule } from "src/main/schema";

const api = window.api;

export function useCreateRule(watcherId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.createRule(watcherId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchers", watcherId, "rules"]
      });
    }
  });
}

export function useRules(watcherId: string) {
  return useQuery({
    queryKey: ["watchers", watcherId, "rules"],
    queryFn: () => api.getRules(watcherId)
  });
}

export function useRule(watcherId: string, ruleId: string) {
  return useQuery({
    queryKey: ["watchers", watcherId, "rules", ruleId],
    queryFn: () => api.getRule(ruleId)
  });
}

export function useUpdateRule(watcherId: string, ruleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Rule>) => api.updateRule(ruleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchers", watcherId, "rules"]
      });
    }
  });
}

export function useUpdateRuleOrder(watcherId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { [key: string]: number }) => api.updateRuleOrder(watcherId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchers", watcherId, "rules"]
      });
    }
  });
}

export function useDeleteRule(watcherId: string, ruleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.deleteRule(ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchers", watcherId, "rules"]
      });
    }
  });
}
