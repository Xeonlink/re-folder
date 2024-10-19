import type { api, dialog } from "./index";

declare global {
  interface Window {
    api: typeof api;
    dialog: typeof dialog;
  }
}
