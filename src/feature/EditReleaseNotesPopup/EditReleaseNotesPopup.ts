import {
  getPullRequestReleaseNotesBody,
  getUpdatedPullRequestReleaseNotesBody,
} from "../../parsing/getPullRequestReleaseNotesBody";
import { releaseNotesUpdater } from "../../parsing/releaseNotesUpdater";
import { createElement } from "../../utils/dom";
import { createChangeItemForm } from "./CreateChangeItemForm";
import { createFooter } from "./Footer";
import { createHeader } from "./Header";
import { popupDnD } from "./popupDnd";
import { createReleaseNotesContainer } from "./ReleaseNotesContainer";

interface DraggablePopupProps {
  width: number;
  height: number;
  textarea: HTMLTextAreaElement;
  onClose: () => void;
  onSave: (newBody: string) => void;
}

const getUpdatedTextareaValue = (
  textarea: HTMLTextAreaElement,
  newNotesBody: string
) => {
  const textareaValue = textarea.value;
  return getUpdatedPullRequestReleaseNotesBody(textareaValue, newNotesBody);
};

export const createEditReleaseNotesPopup = ({
  width,
  height,
  textarea,
  onClose,
  onSave,
}: DraggablePopupProps): HTMLElement | null => {
  const content = textarea.value;
  const releaseNotes = getPullRequestReleaseNotesBody(content);
  const notesUpdater = releaseNotesUpdater(releaseNotes || "");
  const notesData = notesUpdater.getReleaseNotesData();
  notesUpdater.updateReleaseNotes(notesData);

  const popup = createElement("div", "draggable-popup", null, (element) => {
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.position = "absolute";
    element.style.resize = "both";
    element.style.overflow = "auto";
  });

  const header = createHeader({
    popup,
    onCancel: () => {
      popup.remove();
      onClose();
    },
  });

  const contentContainer = createElement(
    "div",
    "draggable-popup-content",
    popup
  );

  createElement("button", "add-change-button", contentContainer, (element) => {
    element.textContent = "Добавить изменение";
    element.addEventListener("click", () => {
      contentContainer.classList.add("popup-add-change-mode");
    });
  });

  const onRerenderReleaseNotes = () => {
    notesUpdater.updateReleaseNotes(notesData);
    renderReleaseNotes();
  };

  createChangeItemForm({
    contentContainer,
    notesData,
    onUpdate: onRerenderReleaseNotes,
  });

  const renderReleaseNotes = createReleaseNotesContainer({
    contentContainer,
    notesData,
    onUpdate: onRerenderReleaseNotes,
  });

  createFooter({
    popup,
    onSave: () => {
      onSave(getUpdatedTextareaValue(textarea, notesUpdater.getBody()));
    },
    onCancel: () => {
      popup.remove();
      onClose();
    },
  });

  popupDnD({ popup, header, width, height });
  return popup;
};
