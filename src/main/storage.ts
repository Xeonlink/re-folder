import * as schema_0_0_0 from "./schema/v0.0.0";
import * as schema_1_0_0 from "./schema/v1.0.0";
import * as schema_2_0_0 from "./schema/v2.0.0";
import { VersionRangeMap } from "./utils/VersionRangeMap";
import Database from "better-sqlite3";
import { generateSQLiteDrizzleJson, generateSQLiteMigration } from "drizzle-kit/api";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { app, safeStorage } from "electron";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { cwd } from "process";
import { z } from "zod";

const dbPath = app.isPackaged //
  ? join(app.getPath("userData"), "data.db")
  : join(cwd(), "dev", "data.db");

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema: schema_0_0_0 });

const schemaMap = new VersionRangeMap({
  "0.0.0 - 0.2.0": schema_0_0_0,
  "0.3.0 - 1.3.0": schema_1_0_0,
  "2.0.0 - 2.10.0": schema_2_0_0,
});

export async function autoMigrate() {
  const prevVersion = await Settings.get("dbVersion");
  const version = app.getVersion();
  const schemaFrom = prevVersion ? (schemaMap.get(prevVersion) ?? {}) : {};
  const schemaTo = schemaMap.get(version)!;

  const migrateStates = await generateSQLiteMigration(
    await generateSQLiteDrizzleJson(schemaFrom),
    await generateSQLiteDrizzleJson(schemaTo),
  );
  for (const query of migrateStates) {
    db.run(query);
  }

  await Settings.set("dbVersion", version);
}

// ------------------------------------------------------------
/**
 * depth 1까지 허용하는 설정저장 파일을 생성하고 관리한다.
 *
 * @author 오지민
 */
export class Settings {
  public static PATH = app.isPackaged ? join(app.getPath("userData"), "flags") : join(cwd(), "dev", "flags.json");

  public static schema = z.object({
    dbVersion: z.string().optional(),
    openaiApiKey: z.string().default(""),
    openaiModel: z.string().default("gpt-3.5-turbo"),
    updateCheckPolicy: z.enum(["auto", "manual"]).default("auto"),
    updateDownloadPolicy: z.enum(["auto", "manual"]).default("auto"),
    updateInstallPolicy: z.enum(["auto", "manual"]).default("auto"),
  });

  private static _data: z.infer<typeof Settings.schema>;

  public static async set<K extends keyof z.infer<typeof Settings.schema>>(
    key: K,
    value: z.infer<typeof Settings.schema>[K],
  ) {
    this._data[key] = value;
    await this.saveData(this._data);
  }

  public static async get<K extends keyof z.infer<typeof Settings.schema>>(key: K) {
    if (!this._data) {
      this._data = await this.loadData();
    }
    return this._data[key];
  }

  private static async loadData(): Promise<z.infer<typeof Settings.schema>> {
    if (!existsSync(Settings.PATH)) {
      const { success, data } = Settings.schema.safeParse({});
      if (success) {
        this.saveData(data);
        return data;
      }
      throw new Error("Failed to parse default settings");
    }

    if (safeStorage.isEncryptionAvailable()) {
      const encryptedRawData = await readFile(Settings.PATH);

      let rawData: string;
      try {
        rawData = safeStorage.decryptString(encryptedRawData);
      } catch (e) {
        rawData = encryptedRawData.toString("utf-8");
      }

      return this.parseRawData(rawData);
    } else {
      const rawData = await readFile(Settings.PATH, { encoding: "utf-8" });
      return this.parseRawData(rawData);
    }
  }

  private static parseRawData(rawData: string): z.infer<typeof Settings.schema> {
    const jsonRawData = JSON.parse(rawData);
    const { success, data } = Settings.schema.safeParse(jsonRawData);
    if (success) {
      return data;
    }
    throw new Error("Failed to parse settings");
  }

  private static async saveData(data: z.infer<typeof Settings.schema>) {
    const { success, data: validatedData } = Settings.schema.safeParse(data);
    if (!success) {
      throw new Error("Failed to validate settings");
    }

    const rawData = JSON.stringify(validatedData);
    if (safeStorage.isEncryptionAvailable()) {
      const encryptedRawData = safeStorage.encryptString(rawData);
      await writeFile(Settings.PATH, encryptedRawData);
    } else {
      await writeFile(Settings.PATH, rawData, { encoding: "utf-8" });
    }
  }
}
