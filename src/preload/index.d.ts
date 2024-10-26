import type { api, subscribe } from "./index";

declare global {
  interface Window {
    api: typeof api;
    subscribe: typeof subscribe;
  }
}
