import { useSuspenseQuery } from "@tanstack/react-query";

const api = window.api;

export function useVersion() {
  return useSuspenseQuery({
    queryKey: ["version"],
    queryFn: () => api.getVersion()
  });
}
