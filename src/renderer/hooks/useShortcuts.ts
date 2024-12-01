import { usePlatform } from "@renderer/api/extra";
import { useEffect } from "react";

type Modifier = "ctrl" | "shift" | "alt" | "meta";
type Alphabet =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";
type Arrow = "arrowup" | "arrowdown" | "arrowleft" | "arrowright";
type ExtraKey = "enter" | "escape" | "backspace" | "delete" | "space" | "tab";
type Key = Alphabet | Arrow | ExtraKey;

type KeyCompose1 = `${Modifier}+${Key}`;
type KeyCompose = KeyCompose1;

type Options = Partial<Record<NodeJS.Platform, Partial<Record<KeyCompose, () => any>>>>;

export function useShortcuts(options: Options) {
  const { data: platform } = usePlatform();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyCompose = [
        e.ctrlKey && "ctrl",
        e.shiftKey && "shift",
        e.altKey && "alt",
        e.metaKey && "meta",
        e.key.toLowerCase(),
      ]
        .filter(Boolean)
        .join("+") as KeyCompose;

      if (options[platform] && options[platform][keyCompose]) {
        options[platform][keyCompose]();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}

export function useSimpleShortcuts(platform: NodeJS.Platform, modifier: Modifier, key: Key, callback: () => any) {
  const { data: actualPlatform } = usePlatform();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (platform != actualPlatform) return;
      if (modifier === "ctrl" && !e.ctrlKey) return;
      if (modifier === "shift" && !e.shiftKey) return;
      if (modifier === "alt" && !e.altKey) return;
      if (modifier === "meta" && !e.metaKey) return;
      if (key !== e.key.toLowerCase()) return;
      callback();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}

export function useShortcutTester() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(e);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
