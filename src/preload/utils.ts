import { ipcRenderer } from "electron/renderer";

type IpcDef = Record<string, (...args: any[]) => Promise<any>>;

type TrueKeys<T extends Record<string, boolean>> = {
  [K in keyof T]: T[K] extends true ? (K extends string ? K : never) : never;
}[keyof T];

export function createApiSelector<TDef extends IpcDef>() {
  return <TMap extends { [key in keyof TDef]: boolean }>(map: TMap) => {
    const api = {} as any;
    for (const channel in map) {
      if (map[channel]) {
        api[channel] = (...args: any[]) => ipcRenderer.invoke(channel, ...args);
      }
    }

    return api as { [P in TrueKeys<TMap>]: TDef[P] };
  };
}
