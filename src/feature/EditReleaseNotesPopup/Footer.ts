import { createElement } from "../../utils/dom";

export const createFooter = ({
  popup,
  onSave,
  onCancel,
}: {
  popup: HTMLElement;
  onSave: () => void;
  onCancel: () => void;
}) => {
  const footer = createElement("div", "draggable-popup-footer", popup);

  createElement("button", "secondary-button", footer, (element) => {
    element.textContent = "Отмена";
    element.onclick = onCancel;
  });

  createElement("button", "primary-button", footer, (element) => {
    element.textContent = "Изменить";
    element.onclick = () => {
      onSave();
      onCancel();
    };
  });
};
