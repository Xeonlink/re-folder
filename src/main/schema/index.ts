export type { Rule, Watcher, Log, FolderPreset } from "./v1.0.0";

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

/**
 * @authro 오지민
 */
// DB버전관리
// {major}.{minor}.{patch}
// major: db에 테이블이 추가되거나, 삭제된 경우
// minor: db에 기존에 있던 테이블의 컬럼이 추가되거나, 삭제된 경우
// patch: db에 기존에 있던 테이블 컬럼의 상세설정이 바뀐 경우 (drizzle관련 설정이 바뀐 경우도 포함)
