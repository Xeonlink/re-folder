import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { Rule } from "src/main/schema";

const api = window.api;

export function useCreateRule(watcherId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => await api.createRule(watcherId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchers", watcherId, "rules"]
      });
      router.invalidate();
    }
  });
}

export function useRules(watcherId: string) {
  return useQuery({
    queryKey: ["watchers", watcherId, "rules"],
    queryFn: () => api.getRules(watcherId)
  });
}

export function useRule(ruleId: string) {
  return useQuery({
    queryKey: ["rules", ruleId],
    queryFn: () => api.getRule(ruleId)
  });
}

export function useUpdateRule(ruleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Rule>) => api.updateRule(ruleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rules"]
      });
    }
  });
}

export function useUpdateRuleOrder(watcherId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { [key: string]: number }) => api.updateRuleOrder(watcherId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchers", watcherId, "rules"]
      });
      router.invalidate();
    }
  });
}

export function useDeleteRule(ruleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => await api.deleteRule(ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rules"]
      });
    }
  });
}
