import IconBlack from "../../resources/icon1800_primary.png?asset";
import IconPrimary from "../../resources/icon1800_primary.png?asset";
import { initializeWatcher } from "./exec/watcher";
import { ipcApiDef } from "./ipc";
import { autoMigrate } from "./storage";
import { MenuBuilder, registIpcs, resolveErrorMessage } from "./utils";
import { BrowserWindow, Tray, app, dialog, nativeImage, shell } from "electron";
import { autoUpdater } from "electron-updater";
import { join } from "path";

function createWindow(): void {
  const icon = nativeImage.createFromPath(IconBlack).resize({
    width: 512,
    height: 512,
    quality: "best",
  });

  const win = new BrowserWindow({
    width: 400,
    height: 700,
    show: false,
    resizable: false,
    title: "ReFolder",
    titleBarStyle: "hidden",
    frame: false,
    icon: icon,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
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

  win.webContents.on("before-input-event", (event, input) => {
    if (input.type !== "keyDown") return;

    const disableRefreshWhenPackaged = true;
    if (disableRefreshWhenPackaged && app.isPackaged) {
      if (input.code === "KeyR" && (input.control || input.meta)) {
        event.preventDefault();
      }
      if (input.code === "F5") {
        event.preventDefault();
      }
    }

    const enableDevToolsWhenDev = true;
    if (enableDevToolsWhenDev && !app.isPackaged) {
      if (input.code === "F12") {
        win.webContents.toggleDevTools();
      }
    }

    const escToCloseWindow = false;
    if (escToCloseWindow) {
      if (input.code === "Escape" && input.key !== "Process") {
        window.close();
        event.preventDefault();
      }
    }

    const blockZoom = true;
    if (blockZoom) {
      if (input.code === "Minus" && (input.control || input.meta)) {
        event.preventDefault();
      }
      if (input.code === "Equal" && input.shift && (input.control || input.meta)) {
        event.preventDefault();
      }
    }
  });

  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

function createOrShowWindow() {
  const windows = BrowserWindow.getAllWindows();
  if (windows.length === 0) {
    createWindow();
  } else {
    windows.forEach((win) => win.show());
  }
}

/* Tray ========================================================= */
function createTrayIcon() {
  if (process.platform === "darwin") {
    const trayIcon = nativeImage.createFromPath(IconBlack).resize({
      width: 20,
      height: 20,
      quality: "best",
    });
    trayIcon.setTemplateImage(true);
    return trayIcon;
  }

  const trayIcon = nativeImage.createFromPath(IconPrimary).resize({
    width: 20,
    height: 20,
    quality: "best",
  });
  return trayIcon;
}

function createTrayMenu() {
  const menu = new MenuBuilder();
  menu.addLabel(`ReFolder ${app.getVersion()}`);
  if (process.platform === "darwin") {
    menu.addSeparator();
  }
  menu.addButton("Open", createOrShowWindow);
  if (process.platform === "darwin") {
    menu.addSeparator();
  }
  menu.addButton("Quit", app.quit);
  return menu.build();
}

function createTray() {
  const trayIcon = createTrayIcon();
  const tray = new Tray(trayIcon);

  const menu = createTrayMenu();
  tray.setContextMenu(menu);
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
app.setAppUserModelId("com.ohjimin.re-folder");

app.on("activate", () => {
  createOrShowWindow();
});

app.on("window-all-closed", () => {
  if (process.platform === "darwin") {
    app.dock.hide();
  }
});

async function main() {
  try {
    await app.whenReady();
    await autoMigrate();
    registIpcs(ipcApiDef);
    initializeWatcher();
    createTray();
    createWindow();
    if (process.env.NODE_ENV !== "development") {
      autoUpdater.checkForUpdates();
    }
  } catch (error: any) {
    const message = resolveErrorMessage(error);
    dialog.showErrorBox("Error", message);
    app.quit();
  }
}
main();
