import type { api } from "./index";

declare global {
  interface Window {
    api: typeof api;
  }
}
