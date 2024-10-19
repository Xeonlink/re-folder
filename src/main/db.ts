import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { app } from "electron";
import { join } from "path";
import * as schema from "./schema";

const dbPath = app.isPackaged //
  ? join(app.getPath("appData"), "data.db")
  : "./data.db";

// const dbPath = "./data.db";

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
// export const db = drizzle(dbPath)
