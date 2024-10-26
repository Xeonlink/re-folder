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
            error.cause = resultOrError.cause;
            error.stack = resultOrError.stack;
            throw error;
          }
        };
      }
    }

    return api as { [P in TrueKeys<TMap>]: TDef[P] };
  };
}

type IpcSubscriptionDef = Record<string, (...args: any[]) => void>;

export function createSubscriptionSelector<TDef extends IpcSubscriptionDef>() {
  return <TMap extends { [key in keyof TDef]: boolean }>(map: TMap) => {
    const subscribeFn = {} as any;
    for (const channel in map) {
      subscribeFn[channel] = (callback: (...args: any[]) => void) => {
        const listener = (_: any, ...args: any[]) => {
          callback(...args);
        };
        ipcRenderer.on(channel, listener);
        return () => {
          ipcRenderer.removeListener(channel, listener);
        };
      };
    }

    return subscribeFn as {
      [P in keyof TDef]: (callback: (...args: Parameters<TDef[P]>) => void) => () => void;
    };
  };
}
