import { api } from "./utils";
import { useSuspenseQuery } from "@tanstack/react-query";

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
