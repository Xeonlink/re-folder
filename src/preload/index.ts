import { contextBridge } from "electron";
import type { ipcDef } from "../main/ipc";
import { createApiSelector } from "./utils";

export const api = createApiSelector<typeof ipcDef>()({
  // watcher ----------------
  createWatcher: true,
  getWatchers: true,
  getWatcher: true,
  updateWatcher: true,
  deleteWatcher: true,
  // rule ----------------
  createRule: true,
  getRules: true,
  getRule: true,
  updateRule: true,
  updateRuleOrder: true,
  deleteRule: true,
  // dialog ----------------
  selectFolder: true,
  // window ----------------
  closeSelf: true,
  minimizeSelf: true
});

// --------------------------------------------------------------
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api;
}
