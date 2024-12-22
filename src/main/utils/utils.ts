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
      stack: error.stack,
    });
  } else if (typeof error === "object" && error !== null) {
    // 객체인 경우
    return JSON.stringify({
      type: "Object",
      ...error, // 객체 자체를 복사
    });
  } else {
    // 그 이외의 경우 (문자열, 숫자 등)
    return JSON.stringify({
      type: "Other",
      value: String(error),
    });
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
