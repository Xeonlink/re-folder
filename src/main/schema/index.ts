export type { Rule, Watcher, Log } from "./v0.0.0";

/**
 * 무작위 16진수 색상 코드 생성함.
 *
 * @returns {string} 무작위 16진수 색상 코드 문자열임.
 * @author 오지민
 */
export function getRandomHexColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}
