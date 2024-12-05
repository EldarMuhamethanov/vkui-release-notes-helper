export const createElement = <T extends HTMLElement>(
  tagName: string,
  className: string,
  container: HTMLElement | null,
  custom?: (element: T) => void
) => {
  const element = document.createElement(tagName) as T;
  element.className = className;
  custom?.(element);

  container?.appendChild(element);
  return element;
};
