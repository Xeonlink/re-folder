import { Menu, MenuItem } from "electron";
import { BrowserWindow, ipcMain } from "electron/main";

type IpcDef = Record<string, (...args: any[]) => Promise<any>>;

export function registIpcs(ipcDef: IpcDef) {
  for (const channel in ipcDef) {
    ipcMain.handle(channel, async (_, ...args: any[]) => {
      try {
        const result = await ipcDef[channel](...args);
        return [true, result];
      } catch (error: any) {
        if (error instanceof Error) {
          return [false, { name: error.name, message: error.message }];
        } else {
          return [false, { ...error }];
        }
      }
    });
  }
}

export function resolveErrorMessage(error: any): string {
  if (error instanceof Error) {
    // Error 객체인 경우
    return JSON.stringify({
      type: "Error",
      message: error.message,
      stack: error.stack
    });
  } else if (typeof error === "object" && error !== null) {
    // 객체인 경우
    return JSON.stringify({
      type: "Object",
      ...error // 객체 자체를 복사
    });
  } else {
    // 그 이외의 경우 (문자열, 숫자 등)
    return JSON.stringify({
      type: "Other",
      value: String(error)
    });
  }
}

type IpcSubscriptionDef = Record<string, (...args: any[]) => void>;

export function createNotifier<TDef extends IpcSubscriptionDef>(ipcDef: TDef) {
  const notifier = {} as any;
  for (const channel in ipcDef) {
    notifier[channel] = (...args: any[]) => {
      const wins = BrowserWindow.getAllWindows();
      for (const win of wins) {
        win.webContents.send(channel, ...args);
      }
    };
  }
  return {
    notify: notifier as { [P in keyof TDef]: TDef[P] }
  };
}

/**
 * 버전 범위를 관리하는 Map 클래스입니다.
 * 각 버전은 x.y.z 형식의 문자열이며, x, y, z는 각각 0-1023 범위의 숫자여야 합니다.
 */
export class VersionRangeMap<T = any> extends Map<[string, string], T> {
  private static readonly MAJOR_SHIFT = 20;
  private static readonly MINOR_SHIFT = 10;

  /**
   * 버전 문자열을 비트 연산을 위한 숫자로 변환합니다.
   * @param version semver 형식의 버전 문자열
   * @returns 비트 연산으로 인코딩된 버전 숫자
   * @throws 유효하지 않은 버전 형식이거나 버전 번호가 1024 이상인 경우
   */
  private static versionToNumber(version: string): number {
    const trimmedVersion = version.trim();
    const parts = trimmedVersion.split(".").map((part) => parseInt(part.trim(), 10));

    if (parts.length !== 3 || parts.some(isNaN))
      throw new Error('유효하지 않은 버전 형식입니다. "x.y.z" 형식이어야 합니다.');

    const [major, minor, patch] = parts;

    if (major >= 1024 || minor >= 1024 || patch >= 1024)
      throw new Error("버전 번호는 각각 1024 미만이어야 합니다.");

    return (major << this.MAJOR_SHIFT) | (minor << this.MINOR_SHIFT) | patch;
  }

  /**
   * 새로운 VersionRangeMap 인스턴스를 생성합니다.
   * @param entries 버전 범위와 값을 매핑한 객체입니다. 키는 "시작버전-끝버전" 형식입니다.
   */
  constructor(entries?: Record<string, T>) {
    super();

    if (!entries) return;

    for (const [range, value] of Object.entries(entries)) {
      if (value === undefined) continue;

      const [start, end] = range.split("-").map((v) => v.trim());

      if (!start || !end)
        throw new Error('유효하지 않은 버전 범위 형식입니다. "시작버전-끝버전" 형식이어야 합니다.');

      this.set([start, end], value);
    }
  }

  /**
   * 주어진 버전 범위에 대한 값을 설정합니다.
   * @param range [시작버전, 끝버전] 형태의 범위를 나타내는 튜플
   * @param value 범위에 저장할 값
   * @returns this (메서드 체이닝을 위해)
   * @throws 시작버전이 끝버전보다 크거나 같은 경우 에러
   */
  public set([startVer, endVer]: [string, string], value: T): this {
    if (value === undefined) return this;

    const startNum = VersionRangeMap.versionToNumber(startVer);
    const endNum = VersionRangeMap.versionToNumber(endVer);

    if (startNum > endNum)
      throw new Error("유효하지 않은 범위: 시작 버전이 끝 버전보다 작아야 합니다");

    return super.set([startVer.trim(), endVer.trim()], value);
  }

  /**
   * 주어진 버전 또는 버전 범위에 해당하는 값을 반환합니다.
   * 단일 버전이 주어진 경우 해당 버전을 포함하는 범위의 값을 반환합니다.
   * @param key 버전 문자열 또는 버전 범위 튜플
   * @returns 해당하는 값 또는 undefined
   */
  public get(key: [string, string]): T | undefined;
  public get(key: string): T | undefined;
  public get(key: [string, string] | string): T | undefined {
    if (typeof key !== "string") return super.get([key[0].trim(), key[1].trim()]);

    const versionNum = VersionRangeMap.versionToNumber(key);

    for (const [[startVer, endVer], value] of this) {
      const startNum = VersionRangeMap.versionToNumber(startVer);
      const endNum = VersionRangeMap.versionToNumber(endVer);

      if (versionNum < startNum || versionNum > endNum) continue;

      return value;
    }

    return undefined;
  }

  /**
   * 주어진 버전 또는 버전 범위가 존재하는지 확인합니다.
   * 단일 버전이 주어진 경우 해당 버전을 포함하는 범위가 있는지 확인합니다.
   * @param key 버전 문자열 또는 버전 범위 튜플
   * @returns 존재하면 true, 아니면 false
   */
  public has(key: [string, string]): boolean;
  public has(key: string): boolean;
  public has(key: [string, string] | string): boolean {
    if (typeof key !== "string") return super.has([key[0].trim(), key[1].trim()]);

    const versionNum = VersionRangeMap.versionToNumber(key);

    for (const [[startVer, endVer]] of this) {
      const startNum = VersionRangeMap.versionToNumber(startVer);
      const endNum = VersionRangeMap.versionToNumber(endVer);

      if (versionNum < startNum || versionNum > endNum) continue;

      return true;
    }

    return false;
  }
}

export class MenuBuilder {
  private items: MenuItem[];

  public constructor() {
    this.items = [];
  }

  public addSeparator(): this {
    this.items.push(new MenuItem({ type: "separator" }));
    return this;
  }

  public addLabel(label: string): this {
    this.items.push(new MenuItem({ label, enabled: false }));
    return this;
  }

  public addButton(label: string, click?: () => void): this {
    this.items.push(new MenuItem({ label, click }));
    return this;
  }

  public build(): Menu {
    return Menu.buildFromTemplate(this.items);
  }
}

type BrowserWindowConstructorOptions = Partial<
  Record<NodeJS.Platform | "all", Electron.BrowserWindowConstructorOptions | undefined>
>;

export function createBrowserWindow(options: BrowserWindowConstructorOptions): BrowserWindow {
  const platform = process.platform;
  const all = options.all ?? {};
  const platformOptions = options[platform] ?? {};

  return new BrowserWindow({ ...all, ...platformOptions });
}
