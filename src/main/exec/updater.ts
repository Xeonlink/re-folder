import { Settings } from "../storage";
import { app } from "electron";
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
  updater.info = { ...defaultUpdateInfo };
  updater.info.state = "checking";
  updater.info.errorMessage = null;
  updater.info.checking = true;
});

autoUpdater.on("update-available", (info) => {
  updater.info.state = "available";
  updater.info.checking = false;
  updater.info.availableVersion = info.version;

  Settings.get("updateDownloadPolicy").then((policy) => {
    if (policy === "auto") {
      updater.downloadUpdate();
    }
  });
});

autoUpdater.on("update-not-available", () => {
  updater.info.state = "not-available";
  updater.info.checking = false;
});

autoUpdater.on("error", (error, message) => {
  updater.info = { ...defaultUpdateInfo };
  updater.info.state = "error";
  updater.info.errorMessage = message ?? error.message;
});

autoUpdater.on("download-progress", (progress) => {
  updater.info.state = "downloading";
  updater.info.downloading = true;
  updater.info.downloadPercent = progress.percent;
});

autoUpdater.on("update-downloaded", (_) => {
  updater.info.state = "ready";
  updater.info.downloading = false;
  updater.info.readyToInstall = true;

  Settings.get("updateInstallPolicy").then((policy) => {
    if (policy === "auto") {
      updater.installUpdate();
    }
  });
});

autoUpdater.on("update-cancelled", (_) => {
  updater.info.state = "available";
  updater.info.downloading = false;
  cancelToken = null;
});

export const updater = {
  info: {
    state: "idle",
    checking: false,
    availableVersion: null,
    errorMessage: null,
    downloading: false,
    downloadPercent: 0,
    readyToInstall: false,
  } as UpdateInfo,
  checkForUpdates: async () => {
    if (!app.isPackaged) {
      updater.info = { ...defaultUpdateInfo };
      updater.info.state = "error";
      updater.info.errorMessage = "Not available in development";
      return;
    }
    if (updater.info.checking) return;
    if (updater.info.downloading) return;
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
