import { eq } from "drizzle-orm";
import { folderPresetTable } from "../schema/v1.0.0";
import { db } from "../storage";
import { mkdirSync } from "fs";
import { join } from "path";

/**
 * 폴더프리셋을 적용한다.
 * @author 오지민
 */
export async function applyFolderPreset(folderPresetId: string, path: string) {
  const raw = await db
    .select()
    .from(folderPresetTable)
    .where(eq(folderPresetTable.id, folderPresetId))
    .limit(1);

  const result = raw[0];
  if (!result) return;

  const { name } = result;
  const folderPath = join(path, name);
  mkdirSync(folderPath);

  const raw2 = await db
    .select()
    .from(folderPresetTable)
    .where(eq(folderPresetTable.parentId, folderPresetId));

  for (const child of raw2) {
    await applyFolderPreset(child.id, folderPath);
  }
}
