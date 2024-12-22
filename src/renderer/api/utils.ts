export type Variables<T = object> = {
  onError?: (error: Error) => any;
  onSuccess?: () => any;
} & T;

export const api = window.api;
