import { Rule, Watcher, ruleTable, watcherTable } from "../schema/v2.0.0";
import { db } from "../storage";
import { eq } from "drizzle-orm";
import type { FSWatcher } from "fs";
import { existsSync, readdirSync, rename, watch } from "fs";
// import { basename, extname, join } from "path";
import { join } from "path";

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
function rule2RegEx(rule: Rule) {
  const prefix = rule.prefix.length > 0 ? rule.prefix.join("|") : ".*";
  const suffix = rule.suffix.length > 0 ? rule.suffix.join("|") : ".*";
  const extensions = rule.extensions.length > 0 ? rule.extensions.join("|") : ".*";
  return new RegExp(`^(${prefix}).*(${suffix})\\.(${extensions})$`);
}

/**
 * 주어진 규칙 객체를 테스트하는 함수를 생성합니다.
 *
 * @param rule - 테스트할 규칙 객체.
 * @returns 주어진 규칙 객체를 테스트하는 함수.
 *
 * @author 오지민
 */
// function createRuleTester(rule: Rule) {
//   return (filePath: string): boolean => {
//     // 확장자와 파일 이름 분리
//     const extension = extname(filePath).slice(1); // .을 제거한 확장자
//     const baseName = basename(filePath, extname(filePath)); // 확장자 제외한 파일명

//     const prefixMatch = rule.prefix.length === 0 ? true : rule.prefix.some(baseName.startsWith);
//     const suffixMatch =
//       rule.suffix.length === 0 ? true : rule.suffix.some((s) => baseName.endsWith(s));
//     const extensionMatch =
//       rule.extensions.length === 0 ? true : rule.extensions.includes(extension);

//     // 모든 조건을 만족하면 true 반환
//     return prefixMatch && suffixMatch && extensionMatch;
//   };
// }

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
 * @param {string} watcherId 활성화할 감시자의 ID.
 * @returns {boolean} 감시자가 성공적으로 활성화되었는지 여부.
 * @author 오지민
 */
export function createWatcher(watcherId: string): boolean {
  if (watcherMap.has(watcherId)) {
    console.log("watcher already exists");
    // TODO: save error log to db
    return false;
  }

  const { watcher, rules } = getWatcher(watcherId);

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
      const ruleTester = rule2RegEx(rule);
      if (ruleTester.test(filename.normalize("NFC"))) {
        const exportedFilename = join(rule.path, filename);
        rename(fullPath, exportedFilename, (err) => {
          if (err) {
            console.error(err);
            // TODO: save error log to db
          }
        });
        break;
      }
    }
  });
  watcherMap.set(watcherId, fsWatcher);

  const result = executeOneShot(watcher, rules);

  // TODO: save success to db log
  return result;
}

/**
 * 주어진 감시자 ID에 해당하는 감시자를 1회 실행한다.
 *
 * @param {string} watcherId 활성화할 감시자의 ID.
 * @returns {boolean} 감시자가 성공적으로 실행되었는지 여부.
 * @author 오지민
 */
export function runWatcher(watcherId: string): boolean {
  const { watcher, rules } = getWatcher(watcherId);

  const result = executeOneShot(watcher, rules);

  // TODO: save success to db log
  return result;
}

/**
 * 아래와 같은 일이 순차적으로 실행된다.
 * 1. 감시자가 있으면, 감시자를 제거한다.
 * 2. 감시자를 생성한다. 확성화되어 있지 않다면, 생성하지 않는다.
 *
 * @param watcherId 감시자 ID
 */
export function invalidateWatcher(watcherId: string) {
  removeWatcher(watcherId);
  createWatcher(watcherId);
}

export async function initializeWatcher() {
  const results = await db.select().from(watcherTable);
  for (const watcher of results) {
    if (watcher.enabled) {
      createWatcher(watcher.id);
    }
  }
}

// helper functions ---------------------------------------------------------
/**
 * 감지사의 활성화 여부와 관계없이, 감시자 ID에 맞는 감시자를 DB에서 검색하여 찾음
 *
 * @param {string} watcherId 활성화할 감시자의 ID.
 * @returns 감시자와 규칙들을 반환. 규칙들은 활성화된 것만 반환한다.
 * @author 오지민
 */
function getWatcher(watcherId: string): { watcher: Watcher; rules: (Omit<Rule, "enabled"> & { enabled: true })[] } {
  const results = db
    .select()
    .from(watcherTable)
    .leftJoin(ruleTable, eq(watcherTable.id, ruleTable.watcherId))
    .where(eq(watcherTable.id, watcherId))
    .all();

  const watcher = results[0].watcher;
  const rules = results
    .map((result) => result.rule)
    .filter((rule) => rule !== null)
    .filter((rule) => typeof rule.enabled === "boolean" && rule.enabled === true) as (Omit<Rule, "enabled"> & {
    enabled: true;
  })[];

  return { watcher, rules };
}

/**
 * 감시자를 1회만 실행한다.
 *
 * @param watcher 실행할 감시자의 정보
 * @param rules 실행할 감시자의 규칙들
 * @returns 감시자가 성공적으로 실행되었는지 여부
 * @author 오지민
 */
function executeOneShot(watcher: Watcher, rules: Rule[]): boolean {
  try {
    const readResults = readdirSync(watcher.path);
    for (const filename of readResults) {
      const fullPath = join(watcher.path, filename);

      for (const rule of rules) {
        const ruleTester = rule2RegEx(rule);
        if (ruleTester.test(filename.normalize("NFC"))) {
          const exportedFilename = join(rule.path, filename);
          rename(fullPath, exportedFilename, (err) => {
            if (err) {
              console.error(err);
              // TODO: save error log to db
            }
          });
          break;
        }
      }
    }
    return true;
  } catch (_) {
    return false;
  }
}
