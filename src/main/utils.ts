import { ipcMain } from "electron/main";

type IpcDef = Record<string, (...args: any[]) => Promise<any>>;

export function registIpcs(ipcDef: IpcDef) {
  for (const channel in ipcDef) {
    ipcMain.handle(channel, async (_, ...args: any[]) => {
      try {
        const result = await ipcDef[channel](...args);
        return [true, result];
      } catch (error: any) {
        return [false, { ...error }];
      }
    });
  }
}

export function createTypedProxy<T extends object>(
  target: T,
  onChange: (obj: T, prop: string, value: any) => any
) {
  const handler: ProxyHandler<T> = {
    set(obj, prop, value) {
      if (prop in obj) {
        onChange(obj, String(prop), value);
        obj[prop] = value;
        return true;
      } else {
        // 새로운 속성 추가는 허용하지 않음
        console.error(`Cannot add new property '${String(prop)}' to the object.`);
        return false;
      }
    },

    // 중첩된 객체도 Proxy로 감싸기 위해 get을 감시
    get(obj, prop) {
      const value = obj[prop];
      if (typeof value === "object" && value !== null) {
        return new Proxy(value, handler); // 중첩 객체에 대해 Proxy 적용
      }
      return value;
    },

    // 속성 추가를 막음 (new property 추가 시 에러 처리)
    defineProperty(target, prop, descriptor) {
      if (prop in target) {
        return Reflect.defineProperty(target, prop, descriptor);
      } else {
        console.error(`Cannot define new property '${String(prop)}' on the object.`);
        return false;
      }
    }
  };

  return new Proxy(target, handler);
}
