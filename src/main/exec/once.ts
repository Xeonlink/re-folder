import { Settings } from "../storage";
import { VersionMap } from "../utils/VersionMap";
import { app } from "electron";

const versionMap = new VersionMap<() => Promise<boolean>>({
  "1.0.1": verifyUpdate,
});

async function verifyUpdate() {
  const targetVersion = await Settings.get("targetVersion");
  const currentVersion = app.getVersion();
  const result = targetVersion === currentVersion;
  if (result) {
    await Settings.set("isUpdateReady", false);
  }
  return result;
}

export async function executeOnce() {
  const once = await Settings.get("once");
  if (once) {
    await Settings.set("once", true);
    return;
  }
  const onceFn = versionMap.get(app.getVersion());
  if (!onceFn) {
    await Settings.set("once", true);
    return;
  }
  const result = await onceFn();
  if (result) {
    await Settings.set("once", true);
    return;
  }
}
