import { createElement } from "../../utils/dom";

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

  createElement("button", "draggable-popup-close", header, (element) => {
    element.textContent = "×";
    element.onclick = onCancel;
  });

  return header;
};
