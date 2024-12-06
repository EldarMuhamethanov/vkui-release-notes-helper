import { createButton, createElement } from "../../utils/dom";

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

  createButton({
    className: "secondary-button",
    text: "Отмена",
    container: footer,
    onClick: onCancel
  });

  createButton({
    className: "primary-button",
    text: "Изменить",
    container: footer,
    onClick: () => {
      onSave();
      onCancel();
    }
  });
};
