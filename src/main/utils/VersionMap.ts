/**
 * 버전 범위를 관리하는 Map 클래스입니다.
 * 각 버전은 x.y.z 형식의 문자열이며, x, y, z는 각각 0-1023 범위의 숫자여야 합니다.
 *
 * @author 오지민
 */
export class VersionMap<T = any> extends Map<string, T> {
  private static parseVersion(version: string): string {
    const versions = version.split(".").map((t) => parseInt(t, 10));

    if (versions.length !== 3) throw new Error('유효하지 않은 버전 형식입니다. "x.y.z" 형식이어야 합니다.');
    if (versions.some(isNaN)) throw new Error("유효하지 않은 버전 형식입니다. 버전은 숫자로 이루어져야 합니다.");

    return versions.join(".");
  }

  /**
   * 새로운 VersionMap 인스턴스를 생성합니다.
   * @param entries 버전과 값을 매핑한 객체입니다. 키는 "x.y.z" 형식입니다. x, y, z는 각각 0-1023 범위의 숫자여야 합니다.
   */
  constructor(entries?: Record<string, T>) {
    super();
    if (!entries) return;

    for (const [key, value] of Object.entries(entries)) {
      this.set(key, value);
    }
  }

  /**
   * 주어진 버전에 대한 값을 설정합니다.
   * @param key x.y.z 형식의 버전 문자열
   * @param value 범위에 저장할 값
   * @returns this (메서드 체이닝을 위해)
   * @throws 유효하지 않은 버전인 경우
   */
  public set(key: string, value: T): this {
    if (value === undefined) return this;
    const version = VersionMap.parseVersion(key);
    return super.set(version, value);
  }

  /**
   * 주어진 버전에 대한 값을 반환합니다.
   * @param key x.y.z 형식의 버전 문자열
   * @returns 해당하는 값 또는 undefined
   * @throws 유효하지 않은 버전인 경우
   */
  public get(key: string): T | undefined {
    const version = VersionMap.parseVersion(key);
    return super.get(version);
  }

  /**
   * 주어진 버전에 대한 값이 존재하는지 확인합니다.
   * @param key x.y.z 형식의 버전 문자열
   * @returns 존재하면 true, 아니면 false
   * @throws 유효하지 않은 버전인 경우
   */
  public has(key: string): boolean {
    const version = VersionMap.parseVersion(key);
    return super.has(version);
  }
}
