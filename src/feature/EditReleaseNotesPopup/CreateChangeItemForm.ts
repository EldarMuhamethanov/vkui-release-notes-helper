import { getHeaderBySectionType } from "../../parsing/headers";
import { ChangeData } from "../../parsing/types";
import { ReleaseNoteData } from "../../parsing/types";
import { createRef } from "../../utils/createRef";
import { createElement } from "../../utils/dom";
import { createReleaseNotesItem } from "./ReleaseNotesSection";

function getDefaultChangeData(): ChangeData {
  return {
    type: "component",
    component: "",
    description: "",
    additionalInfo: "",
  };
}

export const createChangeItemForm = ({
  contentContainer,
  notesData,
  onUpdate,
}: {
  contentContainer: HTMLElement;
  notesData: ReleaseNoteData[];
  onUpdate: () => void;
}) => {
  const createNotesChangeItem = createRef<ChangeData>(getDefaultChangeData());
  const createNotesChangeType =
    createRef<ReleaseNoteData["type"]>("improvement");

  const createChangeItemForm = createElement(
    "div",
    "change-item-form",
    contentContainer
  );

  const rerenderCreateChangeItemForm = () => {
    createChangeItemForm.innerHTML = "";
    createElement<HTMLSelectElement>(
      "select",
      "change-item-type",
      createChangeItemForm,
      (element) => {
        element.value = createNotesChangeType.current;
        element.addEventListener("change", () => {
          createNotesChangeType.current =
            element.value as ReleaseNoteData["type"];
        });
        const options: ReleaseNoteData["type"][] = [
          "improvement",
          "fix",
          "new-component",
          "breaking-change",
          "documentation",
          "dependency",
        ];
        options.forEach((option) => {
          createElement<HTMLOptionElement>(
            "option",
            "",
            element,
            (optionElement) => {
              optionElement.value = option;
              optionElement.textContent = getHeaderBySectionType(option);
            }
          );
        });
      }
    );
    createReleaseNotesItem({
      item: createNotesChangeItem.current,
      container: createChangeItemForm,
      onUpdate: () => {},
      onDelete: () => {
        contentContainer.classList.remove("popup-add-change-mode");
        createNotesChangeItem.current = getDefaultChangeData();
        rerenderCreateChangeItemForm();
      },
    });
    createElement(
      "button",
      "submit-add-change-button",
      createChangeItemForm,
      (element) => {
        element.textContent = "Добавить изменение";
        element.addEventListener("click", () => {
          const section = notesData.find(
            (section) => section.type === createNotesChangeType.current
          );
          if (section) {
            section.data.push(createNotesChangeItem.current);
          } else {
            notesData.push({
              type: createNotesChangeType.current,
              data: [createNotesChangeItem.current],
            });
          }
          onUpdate();

          contentContainer.classList.remove("popup-add-change-mode");
          createNotesChangeItem.current = getDefaultChangeData();
          rerenderCreateChangeItemForm();
        });
      }
    );
  };

  rerenderCreateChangeItemForm();
};