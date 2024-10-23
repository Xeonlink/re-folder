import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { app } from "electron";
import { join } from "path";
import * as schema from "./schema";
import { createTypedProxy } from "./utils";
import { cwd } from "process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { generateSQLiteDrizzleJson, generateSQLiteMigration } from "drizzle-kit/api";

const dbPath = app.isPackaged //
  ? join(app.getPath("userData"), "data.db")
  : "./data.db";

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

export async function autoMigrate() {
  if (!settings.dbInitialized) {
    const migrateStates = await generateSQLiteMigration(
      await generateSQLiteDrizzleJson({}),
      await generateSQLiteDrizzleJson(schema)
    );

    for (const query of migrateStates) {
      db.run(query);
    }

    settings.dbInitialized = true;
  }
}

// ------------------------------------------------------------

const settingsPath = app.isPackaged
  ? join(app.getPath("userData"), "flags")
  : join(cwd(), "flags.json");

const defaultSettings = {
  dbInitialized: false
};

if (!existsSync(settingsPath)) {
  writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
}

export const settings = createTypedProxy<typeof defaultSettings>(
  JSON.parse(readFileSync(settingsPath, "utf-8")),
  (obj, _, __) => {
    writeFileSync(settingsPath, JSON.stringify(obj, null, 2));
  }
);
