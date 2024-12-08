import { safeStorage } from "electron";

export function encrypt(data: string): string {
  return safeStorage.encryptString(data).toString("utf-8");
}

export function decrypt(data: string): string {
  const encryptedRawData = Buffer.from(data, "utf-8");
  return safeStorage.decryptString(encryptedRawData);
}
