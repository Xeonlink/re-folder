import { getRandomHexColor } from ".";
import { AnySQLiteColumn, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferSelectModel } from "drizzle-orm/table";
import { app } from "electron";
import { v4 as uuid } from "uuid";

export const watcherTable = sqliteTable("watcher", {
  id: text("id", { mode: "text" })
    .primaryKey()
    .$defaultFn(() => uuid())
    .notNull(),
  createdAt: integer("test", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
  name: text("name", { mode: "text" })
    .$defaultFn(() => "my-watcher")
    .notNull(),
  description: text("description", { mode: "text" })
    .$defaultFn(() => "this is new my-watcher.")
    .notNull(),
  path: text("path", { mode: "text" })
    .$defaultFn(() => app.getPath("home"))
    .notNull(),
  color: text("color", { mode: "text" })
    .$defaultFn(() => getRandomHexColor())
    .notNull(),
  enabled: integer("enabled", { mode: "boolean" }) //
    .$defaultFn(() => false)
    .notNull(),
  extras: text("extras", { mode: "json" })
    .$type<Record<string, string>>()
    .$defaultFn(() => ({}))
    .notNull(),
});

export const ruleTable = sqliteTable("rule", {
  id: text("id", { mode: "text" })
    .primaryKey()
    .$defaultFn(() => uuid())
    .notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
  name: text("name", { mode: "text" })
    .$defaultFn(() => "my-rule")
    .notNull(),
  description: text("description", { mode: "text" })
    .$defaultFn(() => "this is new my-rule.")
    .notNull(),
  color: text("color", { mode: "text" })
    .$defaultFn(() => getRandomHexColor())
    .notNull(),
  enabled: integer("enabled", { mode: "boolean" }) //
    .$defaultFn(() => false)
    .notNull(),
  prefix: text("prefix", { mode: "json" })
    .$type<string[]>()
    .$defaultFn(() => [])
    .notNull(),
  suffix: text("suffix", { mode: "json" })
    .$type<string[]>()
    .$defaultFn(() => [])
    .notNull(),
  extensions: text("extensions", { mode: "json" })
    .$type<string[]>()
    .$defaultFn(() => [])
    .notNull(),
  path: text("path", { mode: "text" })
    .$defaultFn(() => app.getPath("home"))
    .notNull(),
  order: integer("order", { mode: "number" }) //
    .notNull(),
  watcherId: text("watcherId", { mode: "text" })
    .notNull()
    .references(() => watcherTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const logTable = sqliteTable("log", {
  id: text("id", { mode: "text" })
    .primaryKey()
    .$defaultFn(() => uuid())
    .notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
  message: text("message", { mode: "text" }) //
    .notNull(),
  level: text("level", { mode: "text" }) //
    .notNull(),
  // 0 : main process log, other : 감시자 로그
  watcherId: text("watcherId", { mode: "text" })
    .notNull()
    .references(() => watcherTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

// root folder의 parentId는 null
export const folderPresetTable = sqliteTable("folder_preset", {
  id: text("id", { mode: "text" })
    .primaryKey()
    .$defaultFn(() => uuid())
    .notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
  type: text("type", { mode: "text" })
    .$type<"preset">()
    .$defaultFn(() => "preset")
    .notNull(),
  name: text("name", { mode: "text" })
    .$defaultFn(() => "untitled folder")
    .notNull(),
  description: text("description", { mode: "text" })
    .$defaultFn(() => "this is folder desciption.")
    .notNull(),
  parentId: text("parentId", { mode: "text" }).references((): AnySQLiteColumn => folderPresetTable.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

export const aiwatcherTable = sqliteTable("aiwatcher", {
  id: text("id", { mode: "text" })
    .primaryKey()
    .$defaultFn(() => uuid())
    .notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
  name: text("name", { mode: "text" })
    .$defaultFn(() => "my-watcher")
    .notNull(),
  description: text("description", { mode: "text" })
    .$defaultFn(() => "this is new my-watcher.")
    .notNull(),
  path: text("path", { mode: "text" })
    .$defaultFn(() => app.getPath("home"))
    .notNull(),
  color: text("color", { mode: "text" })
    .$defaultFn(() => getRandomHexColor())
    .notNull(),
  enabled: integer("enabled", { mode: "boolean" }) //
    .$defaultFn(() => false)
    .notNull(),
  extras: text("extras", { mode: "json" })
    .$type<Record<string, string>>()
    .$defaultFn(() => ({}))
    .notNull(),
});

export const categoryTable = sqliteTable("category", {
  id: text("id", { mode: "text" })
    .primaryKey()
    .$defaultFn(() => uuid())
    .notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
  name: text("name", { mode: "text" })
    .$defaultFn(() => "my-category")
    .notNull(),
  description: text("description", { mode: "text" })
    .$defaultFn(() => "")
    .notNull(),
  path: text("path", { mode: "text" })
    .$defaultFn(() => app.getPath("home"))
    .notNull(),
  order: integer("order", { mode: "number" }) //
    .notNull(),
  aiwatcherId: text("aiwatcherId", { mode: "text" })
    .notNull()
    .references(() => aiwatcherTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

// Type ------------------------------------------------------------
export type Watcher = InferSelectModel<typeof watcherTable>;
export type Rule = InferSelectModel<typeof ruleTable>;
export type Log = InferSelectModel<typeof logTable>;
export type FolderPreset = InferSelectModel<typeof folderPresetTable>;
export type AIWatcher = InferSelectModel<typeof aiwatcherTable>;
export type Category = InferSelectModel<typeof categoryTable>;
