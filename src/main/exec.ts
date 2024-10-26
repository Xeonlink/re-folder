import { eq } from "drizzle-orm";
import type { FSWatcher } from "fs";
import { existsSync, readdirSync, rename, watch } from "fs";
import { basename, extname, join } from "path";
import { Rule, ruleTable, watcherTable } from "./schema/v0.0.0";
import { db } from "./storage";

/**
 * 규칙 객체를 정규 표현식으로 변환합니다.
 *
 * 정규 표현식은 규칙에 정의된 prefix, suffix, extensions를 기반으로 구성됩니다.
 * 이 배열 중 어느 하나라도 비어 있으면 와일드카드 패턴 (.*)이 대신 사용됩니다.
 *
 * @param rule - prefix, suffix, extensions 배열을 포함하는 규칙 객체.
 * @returns 규칙을 기반으로 파일 이름과 일치하는 RegExp 객체.
 *
 * @author 오지민
 */
// function rule2RegEx(rule: Rule) {
//   const prefix = rule.prefix.length > 0 ? rule.prefix.join("|") : ".*";
//   const suffix = rule.suffix.length > 0 ? rule.suffix.join("|") : ".*";
//   const extensions = rule.extensions.length > 0 ? rule.extensions.join("|") : ".*";
//   return new RegExp(`^(${prefix}).*(${suffix})\\.(${extensions})$`);
// }

function createRuleTester(rule: Rule) {
  return (filePath: string): boolean => {
    // 확장자와 파일 이름 분리
    const extension = extname(filePath).slice(1); // .을 제거한 확장자
    const baseName = basename(filePath, extname(filePath)); // 확장자 제외한 파일명

    const prefixMatch = rule.prefix.some(baseName.startsWith);
    const suffixMatch = rule.suffix.some((s) => baseName.endsWith(s));
    const extensionMatch = rule.extensions.includes(extension);

    // 모든 조건을 만족하면 true 반환
    return prefixMatch && suffixMatch && extensionMatch;
  };
}

// ----------------------------------------------------------------
// 현재 활성화된 감시자들을 저장하는 Map 객체.
const watcherMap = new Map<string, FSWatcher>();

/**
 * 주어진 감시자 ID에 해당하는 감시자를 비활성화합니다.
 *
 * @param {string} watcherId - 비활성화할 감시자의 ID.
 * @returns {boolean} 감시자가 성공적으로 비활성화되었는지 여부.
 * @author 오지민
 */
export function removeWatcher(watcherId: string): boolean {
  if (!watcherMap.has(watcherId)) {
    console.log("watcher does not exist");
    // TODO: save error log to db
    return false;
  }

  const fsWatcher = watcherMap.get(watcherId);
  if (!fsWatcher) {
    console.log("fsWatcher is falsy");
    // TODO: save error log to db - fsWatcher is undefined
    return false;
  }
  fsWatcher.close();

  watcherMap.delete(watcherId);
  return true;
}

/**
 * 주어진 감시자 ID에 해당하는 감시자를 활성화합니다.
 *
 * @param {string} watcherId - 활성화할 감시자의 ID.
 * @returns {boolean} 감시자가 성공적으로 활성화되었는지 여부.
 * @author 오지민
 */
export function createWatcher(watcherId: string): boolean {
  if (watcherMap.has(watcherId)) {
    console.log("watcher already exists");
    // TODO: save error log to db
    return false;
  }

  const results = db
    .select()
    .from(watcherTable)
    .leftJoin(ruleTable, eq(watcherTable.id, ruleTable.watcherId))
    .where(eq(watcherTable.id, watcherId))
    .all();

  const watcher = results[0].watcher;
  const rules = results.map((result) => result.rule);

  if (!watcher.enabled) {
    console.log("watcher is not enabled");
    return false;
  }

  const fsWatcher = watch(watcher.path);
  fsWatcher.on("change", (eventType, rawfilename) => {
    if (eventType !== "rename") {
      console.log("eventType is not rename");
      // TODO: save error log to db
      return;
    }
    if (!rawfilename) {
      console.log("filename is falsy");
      // TODO: save error log to db
      return;
    }
    const filename = rawfilename.toString();
    const fullPath = join(watcher.path, filename);
    if (!existsSync(fullPath)) {
      console.log("file does not exist");
      // TODO: save error log to db
      return;
    }

    for (const rule of rules) {
      if (rule === null) continue;
      if (!rule.enabled) continue;

      const ruleTester = createRuleTester(rule);
      console.log(filename);
      if (ruleTester(filename.normalize("NFC"))) {
        console.log("filename is matched");
        const exportedFilename = join(rule.path, filename);
        rename(fullPath, exportedFilename, (err) => {
          if (err) {
            console.error(err);
            // TODO: save error log to db
          }
        });
        break;
      } else {
        console.log("filename is not matched");
      }
    }
  });

  watcherMap.set(watcherId, fsWatcher);

  const readResults = readdirSync(watcher.path);
  for (const filename of readResults) {
    const fullPath = join(watcher.path, filename);

    for (const rule of rules) {
      if (rule === null) continue;
      if (!rule.enabled) continue;

      const ruleTester = createRuleTester(rule);
      console.log(filename);
      if (ruleTester(filename.normalize("NFC"))) {
        console.log("filename is matched");
        const exportedFilename = join(rule.path, filename);
        rename(fullPath, exportedFilename, (err) => {
          if (err) {
            console.error(err);
            // TODO: save error log to db
          }
        });
        break;
      } else {
        console.log("filename is not matched");
      }
    }
  }

  // TODO: save success to db log
  return true;
}

export function invalidateWatcher(watcherId: string): boolean {
  if (!watcherMap.has(watcherId)) {
    return false;
  }

  // 모든 결과가 true일 때만, true를 반환
  return removeWatcher(watcherId) && createWatcher(watcherId);
}

export async function initializeWatcher() {
  const results = await db.select().from(watcherTable);
  for (const watcher of results) {
    if (watcher.enabled) {
      createWatcher(watcher.id);
    }
  }
}
