import {
  getPullRequestReleaseNotesBody,
  getUpdatedPullRequestReleaseNotesBody,
} from "../../parsing/getPullRequestReleaseNotesBody";
import { releaseNotesUpdater } from "../../parsing/releaseNotesUpdater";
import { ReleaseNoteData } from "../../parsing/types";
import { createElement } from "../../utils/dom";
import { createChangeItemForm } from "./CreateChangeItemForm";
import { createFooter } from "./Footer";
import { createHeader } from "./Header";
import { popupDnD } from "./popupDnd";
import { createReleaseNotesContainer } from "./ReleaseNotesContainer";
import { createButton } from "../../utils/dom";
import { createRef } from "../../utils/createRef";

interface DraggablePopupProps {
  width: number;
  height: number;
  textareaValue: string;
  onClose: () => void;
  onSave: (newBody: string) => void;
}

export const createEditReleaseNotesPopup = ({
  width,
  height,
  textareaValue,
  onClose,
  onSave,
}: DraggablePopupProps): {
  popup: HTMLElement;
  onOpen: () => void;
  updateTextareaValue: (textareaValue: string, forceRerender?: boolean) => void;
} => {
  const textareaValueRef = createRef(textareaValue);
  const prevReleaseNotesBodyRef = createRef<string>("");
  const notesUpdater = releaseNotesUpdater("");
  const notesData: ReleaseNoteData[] = [];

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

  createButton({
    className: "add-change-button primary-button",
    text: "Добавить изменение",
    container: contentContainer,
    onClick: () => {
      contentContainer.classList.add("popup-add-change-mode");
    },
  });

  const onRerenderReleaseNotes = (forceRerender = true) => {
    notesUpdater.updateReleaseNotes(notesData);
    if (forceRerender) {
      renderReleaseNotes();
    }
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
      onSave(
        getUpdatedPullRequestReleaseNotesBody(
          textareaValueRef.current,
          notesUpdater.getBody()
        )
      );
    },
    onCancel: () => {
      popup.remove();
      onClose();
    },
  });

  const updateNotesData = (newTextareaValue: string, forceRerender = false) => {
    textareaValueRef.current = newTextareaValue;

    const releaseNotes = getPullRequestReleaseNotesBody(newTextareaValue);
    if (releaseNotes === prevReleaseNotesBodyRef.current && !forceRerender) {
      return;
    }
    prevReleaseNotesBodyRef.current = releaseNotes || "";
    notesUpdater.setBody(releaseNotes || "");
    notesData.splice(
      0,
      notesData.length,
      ...notesUpdater.getReleaseNotesData()
    );

    onRerenderReleaseNotes(true);
  };

  updateNotesData(textareaValue);

  const { onOpen } = popupDnD({ popup, header, width, height });
  return {
    popup,
    onOpen,
    updateTextareaValue: updateNotesData,
  };
};
