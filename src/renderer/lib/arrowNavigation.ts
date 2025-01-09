type ElementNav = "parent" | "child" | "next" | "prev";

/**
 * 상대경로에 따라 이동한 위치에 있는 엘리멘트를 반환하는 함수 \
 * 이동하는 도중에 null이 나오면 null을 반환
 *
 * @param root 기준이되는 엘리멘트
 * @param elementNavs 기준으로 부터의 상대경로
 * @returns 상대경로에 따라 이동한 위치에 있는 엘리멘트, 없으면 null
 */
export const getRelativeElement = (root: Element | null, elementNavs: ElementNav[] = []): Element | null => {
  let element: Element | null = root;

  for (const elementNav of elementNavs) {
    if (!element) return null;

    switch (elementNav) {
      case "parent":
        element = element.parentElement;
        break;
      case "child":
        element = element.firstElementChild;
        break;
      case "next":
        element = element.nextElementSibling;
        break;
      case "prev":
        element = element.previousElementSibling;
        break;
    }
  }

  return element;
};

/**
 * 키를 눌렀을 때 포커스를 이동시키는 함수를 반환하는 함수
 *
 * @param key 반응할 키
 * @param elementNavs 다음 포커스로 이동할 엘리멘트의 상대경로
 * @returns 키를 눌렀을 때 포커스를 이동시키는 함수
 */
export const keyboardMoveFocus =
  <T extends HTMLElement>(key: string, elementNavs: ElementNav[]) =>
  (e: React.KeyboardEvent<T>) => {
    if (e.key !== key) return;

    const target = getRelativeElement(e.currentTarget, elementNavs) as HTMLElement;

    target?.focus();
  };
