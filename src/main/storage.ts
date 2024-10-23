import Database from "better-sqlite3";
import { generateSQLiteDrizzleJson, generateSQLiteMigration } from "drizzle-kit/api";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { app } from "electron";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { z } from "zod";
import * as schema from "./schema";

const dbPath = app.isPackaged //
  ? join(app.getPath("userData"), "data.db")
  : join(cwd(), "./data.db");

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

export async function autoMigrate() {
  if (!Settings.data.dbInitialized) {
    const migrateStates = await generateSQLiteMigration(
      await generateSQLiteDrizzleJson({}),
      await generateSQLiteDrizzleJson(schema)
    );

    for (const query of migrateStates) {
      db.run(query);
    }

    Settings.usingSaver((data) => {
      data.dbInitialized = true;
    });
  }
}

// ------------------------------------------------------------
export class Settings {
  public static PATH = app.isPackaged
    ? join(app.getPath("userData"), "flags")
    : join(cwd(), "flags.json");

  public static schema = z.object({
    dbInitialized: z.boolean().default(false),
    dbVersion: z.string().default("0.0.0"),
    isDarkMode: z.boolean().default(false)
  });

  private static _data: z.infer<typeof Settings.schema>;

  public static get data(): Readonly<typeof this._data> {
    if (!this._data) {
      this.init();
    }

    return this._data;
  }

  private static init() {
    if (!existsSync(this.PATH)) {
      const { success, data } = this.schema.safeParse({});
      if (success) {
        writeFileSync(this.PATH, JSON.stringify(data, null, 2));
        this._data = data;
      } else {
        throw new Error("Failed to parse default settings");
      }
    } else {
      const rawData = readFileSync(this.PATH, "utf-8");
      const jsonRawData = JSON.parse(rawData);
      const { success, data } = this.schema.safeParse(jsonRawData);
      if (success) {
        this._data = data;
      } else {
        throw new Error("Failed to parse settings");
      }
    }
  }

  private static save(rawData: z.infer<typeof this.schema>) {
    const { success, data } = this.schema.safeParse(rawData);
    if (success) {
      const jsonRawData = data;
      const rawData = JSON.stringify(jsonRawData, null, 2);
      writeFileSync(this.PATH, rawData);
    }
  }

  public static usingSaver(changer: (data: z.infer<typeof this.schema>) => void) {
    changer(this._data);
    this.save(this._data);
  }
}
