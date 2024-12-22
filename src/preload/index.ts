import type { ipcApiDef } from "../main/ipc";
import { createApiSelector } from "./utils";
import { contextBridge } from "electron";

export const api = createApiSelector<typeof ipcApiDef>()({
  // watcher ----------------
  createWatcher: true,
  copyWatcher: true,
  getWatchers: true,
  getWatcher: true,
  updateWatcher: true,
  deleteWatcher: true,
  // rule ----------------
  createRule: true,
  copyRule: true,
  getRules: true,
  getRule: true,
  updateRule: true,
  updateRuleOrder: true,
  deleteRule: true,
  // folderPreset ----------------
  createFolderPreset: true,
  copyFolderPreset: true,
  getFolderPresets: true,
  getFolderPreset: true,
  updateFolderPreset: true,
  deleteFolderPreset: true,
  applyFolderPreset: true,
  // window ----------------
  closeSelf: true,
  minimizeSelf: true,
  selectFolder: true,
  // info ----------------
  getVersion: true,
  getOpenAiApiKey: true,
  getOpenAiModel: true,
  updateOpenAiApiKey: true,
  updateOpenAiModel: true,
  getPlatform: true,
  getUpdateCheckPolicy: true,
  setUpdateCheckPolicy: true,
  getUpdateDownloadPolicy: true,
  setUpdateDownloadPolicy: true,
  getUpdateInstallPolicy: true,
  setUpdateInstallPolicy: true,
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
