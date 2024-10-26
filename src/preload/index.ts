import { contextBridge } from "electron";
import type { ipcApiDef, ipcSubscriptionDef } from "../main/ipc";
import { createApiSelector, createSubscriptionSelector } from "./utils";

export const api = createApiSelector<typeof ipcApiDef>()({
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

export const subscribe = createSubscriptionSelector<typeof ipcSubscriptionDef>()({
  checkingForUpdate: true
});

// --------------------------------------------------------------
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("subscribe", subscribe);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api;
  // @ts-ignore (define in dts)
  window.subscribe = subscribe;
}
