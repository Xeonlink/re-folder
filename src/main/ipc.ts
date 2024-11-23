import { and, asc, count, eq, gt, isNull } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { app, BrowserWindow, dialog } from "electron/main";
import OpenAI from "openai";
import { createWatcher, invalidateWatcher, removeWatcher } from "./exec/watcher";
import type { FolderPreset, Rule, Watcher } from "./schema/v1.0.0";
import { folderPresetTable, ruleTable, watcherTable } from "./schema/v1.0.0";
import { db, Settings } from "./storage";
import { applyFolderPreset } from "./exec/folderPreset";
import { v4 as uuid } from "uuid";

type IpcDef = Record<string, (...args: any[]) => Promise<any>>;
type IpcSubscriptionDef = Record<string, (...args: any[]) => void>;

export const ipcSubscriptionDef = {
  checkingForUpdate: (_: boolean) => {}
} satisfies IpcSubscriptionDef;

export const ipcApiDef = {
  // watcher table -----------------------------------------------------
  createWatcher: async (): Promise<string> => {
    const results = await db.insert(watcherTable).values([{}]).returning({
      id: watcherTable.id
    });
    return results[0].id;
  },
  getWatchers: async (): Promise<Watcher[]> => {
    return await db.select().from(watcherTable);
  },
  getWatcher: async (watcherId: string): Promise<Watcher> => {
    const results = await db.select().from(watcherTable).where(eq(watcherTable.id, watcherId));
    return results[0];
  },
  updateWatcher: async (watcherId: string, data: Partial<Watcher>): Promise<number> => {
    if (Object.keys(data).length === 0) {
      return 0;
    }

    const results = await db.update(watcherTable).set(data).where(eq(watcherTable.id, watcherId));

    if (data.enabled !== undefined && typeof data.enabled === "boolean") {
      if (data.enabled) {
        createWatcher(watcherId);
      } else {
        removeWatcher(watcherId);
      }
    }

    return results.changes;
  },
  deleteWatcher: async (watcherId: string): Promise<number> => {
    removeWatcher(watcherId);
    const results = await db.delete(watcherTable).where(eq(watcherTable.id, watcherId));
    return results.changes;
  },
  // rule table -----------------------------------------------------
  createRule: async (watcherId: string) => {
    const [{ order }] = await db
      .select({ order: count() })
      .from(ruleTable)
      .where(eq(ruleTable.watcherId, watcherId));

    const results = await db.insert(ruleTable).values([{ order, watcherId }]).returning({
      id: ruleTable.id
    });

    invalidateWatcher(watcherId);

    return results[0].id;
  },
  getRules: async (watcherId: string) => {
    return await db
      .select()
      .from(ruleTable)
      .where(eq(ruleTable.watcherId, watcherId))
      .orderBy(asc(ruleTable.order));
  },
  getRule: async (ruleId: string) => {
    const results = await db.select().from(ruleTable).where(eq(ruleTable.id, ruleId));
    return results[0];
  },
  updateRule: async (ruleId: string, data: Partial<Rule>) => {
    if (Object.keys(data).length === 0) {
      return 0;
    }

    const results = await db
      .update(ruleTable)
      .set(data)
      .where(eq(ruleTable.id, ruleId))
      .returning({ watcherId: ruleTable.watcherId });
    const [{ watcherId }] = results;

    invalidateWatcher(watcherId);

    return results.length;
  },
  updateRuleOrder: async (watcherId: string, data: Record<string, number>) => {
    const changes = await db.transaction(async (tx) => {
      let changes = 0;
      for (const id in data) {
        const result = await tx
          .update(ruleTable)
          .set({ order: data[id] })
          .where(eq(ruleTable.id, id));
        changes += result.changes;
      }
      return changes;
    });

    invalidateWatcher(watcherId);

    return changes;
  },
  deleteRule: async (ruleId: string) => {
    const results = await db
      .delete(ruleTable)
      .where(eq(ruleTable.id, ruleId))
      .returning({ watcherId: ruleTable.watcherId, order: ruleTable.order });
    const [{ watcherId, order }] = results;

    const reOrderTargets = await db
      .select()
      .from(ruleTable)
      .where(and(eq(ruleTable.watcherId, watcherId), gt(ruleTable.order, order)));

    for (const target of reOrderTargets) {
      await db
        .update(ruleTable)
        .set({ order: target.order - 1 })
        .where(eq(ruleTable.id, target.id));
    }

    invalidateWatcher(watcherId);

    return results.length;
  },
  // folder -----------------------------------------------------
  createFolderPreset: async (parentId: string | null) => {
    const result = await db
      .insert(folderPresetTable)
      .values([
        {
          parentId,
          name: `folder (${uuid().split("-")[0]})`
        }
      ])
      .returning({
        id: folderPresetTable.id
      });
    return result[0].id;
  },
  getFolderPresets: async (parentId: string | null): Promise<FolderPreset[]> => {
    const builder = db.select().from(folderPresetTable).orderBy(asc(folderPresetTable.name));

    if (parentId === null) {
      return await builder.where(isNull(folderPresetTable.parentId));
    } else {
      return await builder.where(eq(folderPresetTable.parentId, parentId));
    }
  },
  getFolderPreset: async (folderPresetId: string) => {
    const child = alias(folderPresetTable, "child");
    const rows = await db
      .select()
      .from(folderPresetTable)
      .leftJoin(child, eq(child.parentId, folderPresetTable.id))
      .where(eq(folderPresetTable.id, folderPresetId));

    const raw1 = rows.reduce<Record<string, FolderPreset & { children: string[] }>>((acc, row) => {
      const { folder_preset, child } = row;
      if (!acc[folder_preset.id]) {
        acc[folder_preset.id] = { ...folder_preset, children: [] };
      }
      if (child) {
        acc[folder_preset.id].children.push(child.id);
      }
      return acc;
    }, {});

    const result = Object.values(raw1);
    return result[0];
  },
  updateFolderPreset: async (folderPresetId: string, data: Partial<FolderPreset>) => {
    if (Object.keys(data).length === 0) {
      return 0;
    }

    if (data.name) {
      const [{ parentId }] = await db
        .select({ parentId: folderPresetTable.parentId })
        .from(folderPresetTable)
        .where(eq(folderPresetTable.id, folderPresetId))
        .limit(1);

      if (parentId !== null) {
        const raw = await db
          .select()
          .from(folderPresetTable)
          .where(eq(folderPresetTable.parentId, parentId));

        if (raw.map((r) => r.name).includes(data.name)) {
          console.log(raw.map((r) => r.name));
          throw new Error("이미 존재하는 이름입니다.");
        }
      }
    }

    const result = await db
      .update(folderPresetTable)
      .set(data)
      .where(eq(folderPresetTable.id, folderPresetId));

    return result.changes;
  },
  deleteFolderPreset: async (folderPresetId: string) => {
    const result = await db
      .delete(folderPresetTable)
      .where(eq(folderPresetTable.id, folderPresetId));
    return result.changes;
  },
  applyFolderPreset: async (folderPresetId: string) => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory", "createDirectory", "dontAddToRecent"]
    });
    if (result.canceled) return;
    const path = result.filePaths[0];
    await applyFolderPreset(folderPresetId, path);
    return path;
  },
  // window -----------------------------------------------------
  closeSelf: async () => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) {
      throw new Error("no focused window");
    }
    win.close();
  },
  minimizeSelf: async () => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) {
      throw new Error("no focused window");
    }
    win.minimize();
  },
  selectFolder: async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory", "createDirectory", "dontAddToRecent"]
    });
    return result;
  },
  // info -----------------------------------------------------
  getVersion: async () => {
    return app.getVersion();
  },
  getOpenAiApiKey: async () => {
    return Settings.data.openaiApiKey;
  },
  getOpenAiModel: async () => {
    return Settings.data.openaiModel;
  },
  updateOpenAiApiKey: async (apiKey: string) => {
    const client = new OpenAI({ apiKey });
    await client.models.list();
    Settings.data.openaiApiKey = apiKey;
  },
  updateOpenAiModel: async (model: string) => {
    Settings.data.openaiModel = model;
  }
} satisfies IpcDef;
