import { electronApp, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, shell } from "electron";
import { autoUpdater } from "electron-updater";
import { dialog } from "electron/main";
import { join } from "path";
import icon from "../../resources/icon.png?asset";
import { initializeWatcher } from "./exec";
import { ipcApiDef } from "./ipc";
import { autoMigrate } from "./storage";
import { registIpcs, resolveErrorMessage } from "./utils";

function createWindow(): void {
  const win = new BrowserWindow({
    width: 400,
    height: 700,
    show: false,
    resizable: false,
    title: "ReFolder",
    // titleBarOverlay: false,
    titleBarStyle: "hidden",
    // autoHideMenuBar: true,
    frame: false,
    // icon: process.platform === "linux" ? icon : undefined,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  if (process.platform === "darwin") {
    win.setWindowButtonVisibility(false);
  }

  win.on("ready-to-show", () => {
    win.show();
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });
  // win.webContents.openDevTools();

  if (!app.isPackaged && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

/* Updator ====================================================== */
// const notifier = createNotifier(ipcSubscriptionDef);

// autoUpdater.on("checking-for-update", () => {
//   dialog.showErrorBox("Info", "checking-for-update");
// });

// autoUpdater.on("update-available", () => {
//   dialog.showErrorBox("Info", "update-available");
// });

// autoUpdater.on("update-not-available", () => {
//   dialog.showErrorBox("Info", "update-not-available");
// });

// autoUpdater.on("error", (error) => {
//   const message = resolveErrorMessage(error);
//   dialog.showErrorBox("Info", message);
// });

// autoUpdater.on("download-progress", (progress) => {
//   // dialog.showErrorBox("Info", "update-available");
//   console.log("download-progress", progress);
// });

// autoUpdater.on("update-cancelled", (info) => {
//   dialog.showErrorBox("Info", "update-cancelled");
//   console.log("update-cancelled", info);
// });

// autoUpdater.on("update-downloaded", () => {
//   dialog.showErrorBox("Info", "update-downloaded");
// });

/* Main ========================================================= */
electronApp.setAppUserModelId("com.ohjimin.re-folder");

process.on("uncaughtException", (error) => {
  const message = resolveErrorMessage(error);
  dialog.showErrorBox("Info", message);
  console.log("error", error);
  app.quit();
});

app.on("browser-window-created", (_, window) => {
  optimizer.watchWindowShortcuts(window);
});

app.on("activate", () => {
  const windows = BrowserWindow.getAllWindows();
  if (windows.length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

async function main() {
  try {
    await app.whenReady();
    await autoMigrate();
    registIpcs(ipcApiDef);
    initializeWatcher();
    createWindow();
    autoUpdater.checkForUpdates();
  } catch (error: any) {
    const message = resolveErrorMessage(error);
    dialog.showErrorBox("Error", message);
    app.quit();
  }
}
main();
