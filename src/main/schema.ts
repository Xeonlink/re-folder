import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferSelectModel } from "drizzle-orm/table";
import { app } from "electron";
import { v4 as uuid } from "uuid";

/**
 * 무작위 16진수 색상 코드 생성함.
 *
 * @returns {string} 무작위 16진수 색상 코드 문자열임.
 * @author 오지민
 */
function getRandomHexColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

// ------------------------------------------------------------
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
    .default(false)
    .notNull(),
  extras: text("extras", { mode: "json" })
    .$type<Record<string, string>>()
    .$defaultFn(() => ({}))
    .notNull()
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
  order: integer("order", { mode: "number" }).notNull(),
  watcherId: text("watcherId", { mode: "text" }).notNull()
  // .references(() => watcherTable.id)
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
  message: text("message", { mode: "text" }).notNull(),
  level: text("level", { mode: "text" }).notNull(),
  // 0 : main process log, other : 감시자 로그
  watcherId: text("watcherId", { mode: "text" })
    .notNull()
    .references(() => watcherTable.id)
});

// Type ------------------------------------------------------------
export type Watcher = InferSelectModel<typeof watcherTable>;
export type Rule = InferSelectModel<typeof ruleTable>;
export type Log = InferSelectModel<typeof logTable>;

// Relations ------------------------------------------------------------
// export const watcherRelation = relations(watcherTable, ({ many }) => ({
//   rules: many(ruleTable)
// }));

// export const ruleRelation = relations(ruleTable, ({ one }) => ({
//   watcher: one(watcherTable, {
//     fields: [ruleTable.id],
//     references: [watcherTable.id]
//   })
// }));
