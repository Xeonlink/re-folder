import { electronApp, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, shell } from "electron";
import { dialog } from "electron/main";
import { join } from "path";
import icon from "../../resources/icon.png?asset";
import { initializeWatcher } from "./exec";
import { ipcDef } from "./ipc";
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

// main --------------------------------------------------------
electronApp.setAppUserModelId("com.electron");

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
    registIpcs(ipcDef);
    initializeWatcher();
    createWindow();
  } catch (error: any) {
    const message = resolveErrorMessage(error);
    dialog.showErrorBox("Error", message);
  }
}
main();
