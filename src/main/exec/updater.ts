import { Settings } from "../storage";
import { CancellationToken, autoUpdater } from "electron-updater";

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;
autoUpdater.autoRunAppAfterInstall = true;

type UpdateInfo = {
  state: "idle" | "checking" | "available" | "not-available" | "error" | "downloading" | "ready";
  checking: boolean;
  availableVersion: string | null;
  errorMessage: string | null;
  downloading: boolean;
  downloadPercent: number;
  readyToInstall: boolean;
};

let updateInfo: UpdateInfo = {
  state: "idle",
  checking: false,
  availableVersion: null,
  errorMessage: null,
  downloading: false,
  downloadPercent: 0,
  readyToInstall: false,
};

const defaultUpdateInfo: UpdateInfo = {
  state: "idle",
  checking: false,
  availableVersion: null,
  errorMessage: null,
  downloading: false,
  downloadPercent: 0,
  readyToInstall: false,
};

let cancelToken: CancellationToken | null = null;

autoUpdater.on("checking-for-update", () => {
  updateInfo = { ...defaultUpdateInfo };
  updateInfo.state = "checking";
  updateInfo.errorMessage = null;
  updateInfo.checking = true;
});

autoUpdater.on("update-available", (info) => {
  updateInfo.state = "available";
  updateInfo.checking = false;
  updateInfo.availableVersion = info.version;

  Settings.get("updateDownloadPolicy").then((policy) => {
    if (policy === "auto") {
      updater.downloadUpdate();
    }
  });
});

autoUpdater.on("update-not-available", () => {
  updateInfo.state = "not-available";
  updateInfo.checking = false;
});

autoUpdater.on("error", (error, message) => {
  updateInfo = { ...defaultUpdateInfo };
  updateInfo.state = "error";
  updateInfo.errorMessage = message ?? error.message;
});

autoUpdater.on("download-progress", (progress) => {
  updateInfo.state = "downloading";
  updateInfo.downloading = true;
  updateInfo.downloadPercent = progress.percent;
});

autoUpdater.on("update-downloaded", (_) => {
  updateInfo.state = "ready";
  updateInfo.downloading = false;
  updateInfo.readyToInstall = true;

  Settings.get("updateInstallPolicy").then((policy) => {
    if (policy === "auto") {
      updater.installUpdate();
    }
  });
});

autoUpdater.on("update-cancelled", (_) => {
  updateInfo.state = "available";
  updateInfo.downloading = false;
  cancelToken = null;
});

export const updater = {
  info: updateInfo,
  checkForUpdates: async () => {
    if (updateInfo.checking) return;
    if (updateInfo.downloading) return;
    const result = await autoUpdater.checkForUpdates();
    if (!result) return;
    if (!result.cancellationToken) return;
    cancelToken = result.cancellationToken;
  },
  downloadUpdate: async () => {
    cancelToken = new CancellationToken();
    await autoUpdater.downloadUpdate(cancelToken);
  },
  cancelUpdate: () => {
    cancelToken?.cancel();
  },
  installUpdate: () => {
    autoUpdater.quitAndInstall();
  },
};
