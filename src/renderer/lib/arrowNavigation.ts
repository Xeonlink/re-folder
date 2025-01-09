/**
 * 키를 눌렀을 때 특정 tabIndex를 가진 엘리멘트로 포커스를 이동시키는 함수를 반환하는 함수
 *
 * @param key 반응할 키
 * @param targetTabIndex 이동할 대상 엘리멘트의 tabIndex
 * @returns 키를 눌렀을 때 포커스를 이동시키는 함수
 * @author 오지민
 */
export const Key2FocusIndex =
  <T extends HTMLElement>(key: string, targetTabIndex: number) =>
  (e: React.KeyboardEvent<T>) => {
    if (e.key !== key) return;

    const target = document.querySelector(`[tabindex="${targetTabIndex}"]`) as HTMLElement;
    target?.focus();
  };
