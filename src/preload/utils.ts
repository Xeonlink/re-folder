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
        api[channel] = async (...args: any[]) => {
          const [success, resultOrError] = await ipcRenderer.invoke(channel, ...args);
          if (success) {
            return resultOrError;
          } else {
            const error = new Error();
            error.name = resultOrError.name;
            error.message = resultOrError.message;
            throw error;
          }
        };
      }
    }

    return api as { [P in TrueKeys<TMap>]: TDef[P] };
  };
}
