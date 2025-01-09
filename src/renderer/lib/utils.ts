import { type ClassValue, clsx } from "clsx";
import { SyntheticEvent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function invertHexColor(hex: string) {
  // HEX 색상 코드에서 '#'를 제거
  hex = hex.replace("#", "");

  // 3자리 HEX 코드를 6자리로 변환
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // 6자리로 맞추지 못하면 잘못된 HEX 코드이므로 에러 처리
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }

  // HEX를 각각 R, G, B로 분리
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // 각각의 색상 값을 반전시킴
  const invertedR = (255 - r).toString(16).padStart(2, "0");
  const invertedG = (255 - g).toString(16).padStart(2, "0");
  const invertedB = (255 - b).toString(16).padStart(2, "0");

  // 반전된 R, G, B 값을 다시 HEX로 결합
  return `#${invertedR}${invertedG}${invertedB}`;
}

export function testPromise<T>(promise: Promise<T>, delay: number = 3000, fail: boolean = false): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(new Error("Promise rejected after delay"));
      } else {
        promise.then(resolve).catch(reject);
      }
    }, delay);
  });
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const on =
  <T extends SyntheticEvent>(...args: (((e: T) => any) | undefined)[]) =>
  (e: T) => {
    for (const arg of args) {
      arg?.(e);
    }
  };
