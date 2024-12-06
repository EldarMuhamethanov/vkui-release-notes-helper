import { createButton } from "../utils/dom";

const initEditButton = (container: HTMLElement): HTMLButtonElement => {
  const button = createButton({
    text: "Редактировать Release Note",
    className: "edit-pr-button primary-button",
    container,
    custom: () => {
      container.style.position = "relative";
    }
  });
  return button;
};

export const createEditReleaseNotesButton = ({
  container,
  onClick,
}: {
  container: HTMLElement;
  onClick: () => void;
}): HTMLButtonElement => {
  const button = initEditButton(container);

  button.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });
  button.addEventListener("click", (e) => {
    e.preventDefault();
    onClick();
  });

  return button;
};
