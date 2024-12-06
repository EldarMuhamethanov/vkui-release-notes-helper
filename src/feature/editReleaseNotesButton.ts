const initEditButton = (container: HTMLElement): HTMLButtonElement => {
  const button = document.createElement("button");
  button.textContent = "Редактировать Release Note";
  button.className = "edit-pr-button primary-button";
  container.style.position = "relative";
  container.appendChild(button);
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
