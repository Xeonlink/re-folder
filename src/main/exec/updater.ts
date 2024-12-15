import { Settings } from "../storage";
import { autoUpdater } from "electron-updater";

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.autoRunAppAfterInstall = true;

autoUpdater.on("checking-for-update", () => {
  console.log("checking-for-update");
});

autoUpdater.on("update-available", () => {
  console.log("update-available");
});

autoUpdater.on("update-not-available", () => {
  console.log("update-not-available");
});

autoUpdater.on("error", (error, message) => {
  console.error("error", error, message);
});

autoUpdater.on("download-progress", (progress) => {
  console.log("download-progress", progress);
});

autoUpdater.on("update-downloaded", (event) => {
  console.log("update-downloaded");
  Settings.set("isUpdateReady", true);
  Settings.set("targetVersion", event.version);
});

autoUpdater.on("update-cancelled", (info) => {
  console.log("update-cancelled", info);
});

export const updater = {
  checkForUpdates: () => {
    autoUpdater.checkForUpdates();
  },
  downloadUpdate: () => {
    autoUpdater.downloadUpdate();
  },
  installUpdate: async () => {
    autoUpdater.quitAndInstall();
  },
};
