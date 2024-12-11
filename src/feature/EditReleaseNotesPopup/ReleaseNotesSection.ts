import { getHeaderBySectionType } from "../../parsing/headers";
import { ChangeData, ReleaseNoteData } from "../../parsing/types";
import { createButton, createElement } from "../../utils/dom";
import { createMarkdownField } from "./MarkdownField";

const mutateObject = (obj: any, newObj: any) => {
  // Сначала удаляем все старые свойства
  Object.keys(obj).forEach((key) => {
    delete obj[key];
  });

  // Затем добавляем новые
  Object.assign(obj, newObj);
};

const fixValue = (value: string) => {
  return value.trim().replace(/\n/g, " ").replace(/\s+/g, " ");
};

export const createReleaseNotesItem = ({
  item,
  container,
  onUpdate,
  onDelete,
}: {
  item: ChangeData;
  container: HTMLElement;
  onUpdate: () => void;
  onDelete: (item: ChangeData) => void;
}) => {
  const itemElement = createElement("div", "release-notes-item", container);

  createButton({
    className: "release-notes-item-delete",
    text: "✕",
    title: "Удалить изменение",
    container: itemElement,
    onClick: () => {
      onDelete(item);
    },
  });

  createElement(
    "span",
    "release-notes-item-component-title",
    itemElement,
    (element) => {
      element.textContent = "Компонент:";
    }
  );
  createElement<HTMLInputElement>(
    "input",
    "release-notes-item-component",
    itemElement,
    (element) => {
      if (item.type === "component") {
        element.value = item.component;
      }
      element.addEventListener("change", () => {
        const currentType = item.type;
        const newComponent = element.value;
        if (currentType === "component" && newComponent) {
          item.component = fixValue(newComponent);
        } else if (currentType === "component" && !newComponent) {
          mutateObject(item, {
            type: "unknown",
            description: fixValue(item.description),
            additionalInfo: fixValue(item.additionalInfo || ""),
          });
        } else if (currentType === "unknown" && newComponent) {
          mutateObject(item, {
            type: "component",
            component: fixValue(newComponent),
            description: fixValue(item.description),
            additionalInfo: fixValue(item.additionalInfo || ""),
          });
        }

        onUpdate();
      });
    }
  );

  createElement(
    "span",
    "release-notes-item-description-title",
    itemElement,
    (element) => {
      element.textContent = "Описание:";
    }
  );

  createMarkdownField({
    container: itemElement,
    className: "release-notes-item-description",
    value: item.description || "",
    onChange: (value: string) => {
      item.description = fixValue(value);
      onUpdate();
    },
  });

  createElement(
    "span",
    "release-notes-item-additional-info-title",
    itemElement,
    (element) => {
      element.textContent = "Доп информация:";
    }
  );

  createMarkdownField({
    container: itemElement,
    className: "release-notes-item-additional-info",
    value: item.additionalInfo || "",
    onChange: (value: string) => {
      item.additionalInfo = value;
      onUpdate();
    },
  });
};

export const createReleaseNotesSection = ({
  releaseNotes,
  container,
  onUpdate,
  onDelete,
}: {
  releaseNotes: ReleaseNoteData;
  container: HTMLElement;
  onUpdate: () => void;
  onDelete: (item: ChangeData) => void;
}) => {
  const section = createElement("div", "release-notes-section", container);
  createElement("span", "release-notes-section-title", section, (element) => {
    element.textContent = getHeaderBySectionType(releaseNotes.type);
  });
  releaseNotes.data.forEach((item, index) => {
    createReleaseNotesItem({
      item,
      container: section,
      onUpdate,
      onDelete,
    });
  });
};
