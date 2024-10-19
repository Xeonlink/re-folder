import { contextBridge } from "electron";
import type { ipcDef } from "../main/ipc";
import { createApiSelector } from "./utils";
import { ipcRenderer } from "electron/renderer";

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
  deleteRule: true
});

export const dialog = {
  selectFolder: () =>
    ipcRenderer.invoke("dialog:selectFolder") as Promise<Electron.OpenDialogReturnValue>
};

// --------------------------------------------------------------
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("dialog", dialog);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api;
  // @ts-ignore (define in dts)
  windwo.dialog = dialog;
}
