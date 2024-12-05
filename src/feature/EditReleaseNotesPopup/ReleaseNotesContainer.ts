import { ReleaseNoteData } from "../../parsing/types";
import { createElement } from "../../utils/dom";
import { createReleaseNotesSection } from "./ReleaseNotesSection";

export const createReleaseNotesContainer = ({
  contentContainer,
  notesData,
  onUpdate,
}: {
  contentContainer: HTMLElement;
  notesData: ReleaseNoteData[];
  onUpdate: () => void;
}) => {
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
        onUpdate,
        onDelete: (item) => {
          const index = section.data.indexOf(item);
          if (index !== -1) {
            section.data.splice(index, 1);
            if (section.data.length === 0) {
              notesData.splice(notesData.indexOf(section), 1);
            }
            onUpdate();
          }
        },
      });
    });
  };

  renderReleaseNotes();

  return renderReleaseNotes;
};
