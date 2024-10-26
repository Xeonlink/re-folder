import Database from "better-sqlite3";
import { generateSQLiteDrizzleJson, generateSQLiteMigration } from "drizzle-kit/api";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { app } from "electron";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { z } from "zod";
import * as schema_0_0_0 from "./schema/v0.0.0";
import * as schema_0_0_1 from "./schema/v0.0.1";
import { VersionRangeMap } from "./utils";

const dbPath = app.isPackaged //
  ? join(app.getPath("userData"), "data.db")
  : join(cwd(), "dev", "data.db");

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema: schema_0_0_1 });

const schemaMap = new VersionRangeMap({
  "0.0.0 - 0.0.1": schema_0_0_0,
  "0.0.1 - 0.0.2": schema_0_0_1,
  "0.0.2 - 0.0.3": schema_0_0_1
});

export async function autoMigrate() {
  const prevVersion = Settings.data.dbVersion;
  const version = app.getVersion();
  const schemaFrom = prevVersion ? (schemaMap.get(prevVersion) ?? {}) : {};
  const schemaTo = schemaMap.get(version)!;

  const migrateStates = await generateSQLiteMigration(
    await generateSQLiteDrizzleJson(schemaFrom),
    await generateSQLiteDrizzleJson(schemaTo)
  );
  for (const query of migrateStates) {
    db.run(query);
  }

  Settings.data.dbVersion = version;
}

// ------------------------------------------------------------
export class Settings {
  public static PATH = app.isPackaged
    ? join(app.getPath("userData"), "flags")
    : join(cwd(), "dev", "flags.json");

  public static schema = z.object({
    dbVersion: z.string().optional()
  });

  private static _instance: Settings;
  private _data: z.infer<typeof Settings.schema>;
  private _proxy: z.infer<typeof Settings.schema>;

  private constructor() {
    this._data = this.loadData();
    this._proxy = new Proxy(this._data, {
      set: (target, prop, value) => {
        target[prop] = value;
        this.saveData(target);
        return true;
      }
    });
  }

  public static get data(): z.infer<typeof Settings.schema> {
    if (!Settings._instance) {
      Settings._instance = new Settings();
    }
    return Settings._instance._proxy;
  }

  private loadData(): z.infer<typeof Settings.schema> {
    if (!existsSync(Settings.PATH)) {
      const { success, data } = Settings.schema.safeParse({});
      if (success) {
        writeFileSync(Settings.PATH, JSON.stringify(data, null, 2));
        return data;
      }
      throw new Error("Failed to parse default settings");
    }

    const rawData = readFileSync(Settings.PATH, "utf-8");
    const jsonRawData = JSON.parse(rawData);
    const { success, data } = Settings.schema.safeParse(jsonRawData);
    if (success) {
      return data;
    }
    throw new Error("Failed to parse settings");
  }

  private saveData(data: z.infer<typeof Settings.schema>) {
    const { success, data: validatedData } = Settings.schema.safeParse(data);
    if (success) {
      writeFileSync(Settings.PATH, JSON.stringify(validatedData, null, 2));
    }
  }
}
