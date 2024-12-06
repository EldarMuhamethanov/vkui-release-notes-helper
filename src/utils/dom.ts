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

export const createButton = ({
  className = '',
  title = '',
  onClick,
  container = null,
  text = '',
  custom,
}: {
  className?: string;
  title?: string;
  onClick?: (e: MouseEvent) => void;
  container?: HTMLElement | null;
  text?: string;
  custom?: (button: HTMLButtonElement) => void;
} = {}) => {
  return createElement<HTMLButtonElement>('button', className, container, (button) => {
    button.textContent = text;
    button.title = title;
    if (onClick) {
      button.addEventListener('click', onClick);
    }
    custom?.(button);
  });
};
