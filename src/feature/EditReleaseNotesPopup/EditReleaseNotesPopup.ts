import { getPullRequestReleaseNotesBody } from "../../parsing/getPullRequestReleaseNotesBody";
import { releaseNotesUpdater } from "../../parsing/releaseNotesUpdater";
import { createElement } from "../../utils/dom";
import { popupDnD } from "./popupDnd";
import { createReleaseNotesSection } from "./ReleaseNotesSection";

interface DraggablePopupProps {
  width: number;
  height: number;
  content: string;
  onClose: () => void;
}

export const createEditReleaseNotesPopup = ({
  width,
  height,
  content,
  onClose,
}: DraggablePopupProps): HTMLElement | null => {
  const releaseNotes = getPullRequestReleaseNotesBody(content);
  if (!releaseNotes) {
    return null;
  }
  const notesUpdater = releaseNotesUpdater(releaseNotes);
  const notesData = notesUpdater.getReleaseNotesData();

  const popup = createElement("div", "draggable-popup", null, (element) => {
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
  });
  const header = createElement("div", "draggable-popup-header", popup);

  createElement("span", "draggable-popup-title", header, (element) => {
    element.textContent = "Edit Release Notes";
  });
  const contentContainer = createElement(
    "div",
    "draggable-popup-content",
    popup
  );

  createElement("button", "draggable-popup-close", header, (element) => {
    element.textContent = "×";
    element.onclick = () => {
      popup.remove();
      onClose();
    };
  });

  createElement("button", "add-change-button", contentContainer, (element) => {
    element.textContent = "Добавить изменение";
    element.addEventListener("click", () => {
      contentContainer.classList.add("popup-add-change-mode");
    });
  });
  const releaseNotesContainer = createElement(
    "div",
    "release-notes-container",
    contentContainer
  );
  const renderReleaseNotes = () => {
    releaseNotesContainer.innerHTML = "";
    notesData.forEach((section) => {
      createReleaseNotesSection({
        releaseNotes: section,
        container: releaseNotesContainer,
        onUpdate: () => {
          notesUpdater.updateReleaseNotes(notesData);
          const body = notesUpdater.getBody();
          console.log("newBody", body);
        },
        onDelete: (item) => {
          const index = section.data.indexOf(item);
          if (index !== -1) {
            section.data.splice(index, 1);
            renderReleaseNotes();
            notesUpdater.updateReleaseNotes(notesData);
            const body = notesUpdater.getBody();
            console.log("newBody", body);
          }
        },
      });
    });
  };

  renderReleaseNotes();

  popupDnD({ popup, header, width, height });
  return popup;
};
