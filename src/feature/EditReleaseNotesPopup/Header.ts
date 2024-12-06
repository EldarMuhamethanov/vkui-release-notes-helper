import { createButton, createElement } from "../../utils/dom";

export const createHeader = ({
  popup,
  onCancel,
}: {
  popup: HTMLElement;
  onCancel: () => void;
}) => {
  const header = createElement("div", "draggable-popup-header", popup);

  createElement("span", "draggable-popup-title", header, (element) => {
    element.textContent = "Редактирование Release Notes";
  });

  createButton({
    className: "draggable-popup-close",
    text: "×",
    container: header,
    onClick: onCancel
  });

  return header;
};
