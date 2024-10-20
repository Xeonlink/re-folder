import {
  generateSQLiteMigration,
  generateMigration,
  generateDrizzleJson,
  generateSQLiteDrizzleJson,
  pushSQLiteSchema,
  pushSchema
} from "drizzle-kit/api";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import { migrate } from "drizzle-orm/monomigrator";
import { app, BrowserWindow, shell } from "electron";
import { dialog, ipcMain } from "electron/main";
import { join, resolve } from "path";
import icon from "../../resources/icon.png?asset";
import { db } from "./db";
import { ipcDef } from "./ipc";
import { watcherTable } from "./schema";
import { createWatcher } from "./utils/WatchManager";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { cwd } from "process";
import { createTableRelationsHelpers } from "drizzle-orm";
import * as schema from "./schema";

function readDirectoryRecursively(dirPath: string) {
  const result = {};

  // 폴더 내 파일/디렉토리 읽기
  const items = readdirSync(dirPath, { withFileTypes: true });

  items.forEach((item) => {
    const fullPath = join(dirPath, item.name);

    // 폴더인 경우 재귀 호출
    if (item.isDirectory()) {
      result[item.name] = readDirectoryRecursively(fullPath);
    } else {
      // 파일인 경우, 파일 이름만 저장
      result[item.name] = "file";
    }
  });

  return result;
}

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
  win.webContents.openDevTools();

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

type FlagFile = {
  dbInitialized: boolean;
};

async function main() {
  try {
    await app.whenReady();

    const flagsPath = app.isPackaged
      ? join(app.getPath("userData"), "flags")
      : join(cwd(), "flags.json");

    if (!existsSync(flagsPath)) {
      writeFileSync(flagsPath, JSON.stringify({ dbInitialized: false }, null, 2));
    }

    const flags = JSON.parse(readFileSync(flagsPath, "utf-8")) as FlagFile;

    if (!flags.dbInitialized) {
      const test = await generateSQLiteMigration(
        await generateSQLiteDrizzleJson({}),
        await generateSQLiteDrizzleJson(schema)
      );

      for (const query of test) {
        db.run(query);
      }

      flags.dbInitialized = true;
      writeFileSync(flagsPath, JSON.stringify(flags, null, 2));
    }

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

    // app.emit("activate");
    createWindow();
  } catch (error: any) {
    dialog.showErrorBox(
      "Error",
      JSON.stringify(
        {
          message: error.message,
          name: error.name,
          stack: error.stack
          // others: {
          //   cwd: readdirSync(cwd()),
          //   __dirname: readdirSync(__dirname)
          // }
        },
        null,
        2
      )
    );
  }
}
main();
