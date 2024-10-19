import { electronApp, optimizer } from "@electron-toolkit/utils";
import { migrate } from "drizzle-orm/monomigrator";
import { app, BrowserWindow, shell } from "electron";
import { dialog, ipcMain } from "electron/main";
import { join } from "path";
import icon from "../../resources/icon.png?asset";
import { db } from "./db";
import { ipcDef } from "./ipc";
import { watcherTable } from "./schema";
import { createWatcher } from "./utils/WatchManager";

function createWindow(): void {
  const win = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    // icon: process.platform === "linux" ? icon : undefined,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });

  win.on("ready-to-show", () => {
    win.show();
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

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
  await app.whenReady();

  await migrate(db, {
    migrationsFolder: "./src/main/assets/migrate"
  });

  for (const channel in ipcDef) {
    ipcMain.handle(channel, (_, ...args: any[]) => {
      return ipcDef[channel](...args);
    });
  }
  ipcMain.handle("dialog:selectFolder", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory", "createDirectory"]
    });
    return result;
  });

  const results = await db.select().from(watcherTable);
  for (const watcher of results) {
    if (watcher.enabled) {
      createWatcher(watcher.id);
    }
  }

  app.emit("activate");
}
main();
