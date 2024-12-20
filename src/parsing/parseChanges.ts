import { ChangeData } from "./types";

const COMPONENT_REGEX = /^-\s(\w+):(.+)?/;
const COMPONENT_WITH_LINK_REGEX = /^-\s\[(\w+)]\(.+\):(.+)?/;
const COMPONENT_SUB_ITEM_REGEX = /^\s{2}-\s(.+)/;
const UNKNOWN_CHANGE_REGEX = /^-\s(.+)/;

function removeLeadingSpaces(str: string, n: number): string {
  const spaceRegex = /^(\s+)/;
  const match = str.match(spaceRegex);
  if (!match || !match[1]) {
    return str;
  }
  const leadingSpacesCount = match[1].length;
  return str.slice(Math.min(leadingSpacesCount, n));
}

export function parseChanges(text: string): ChangeData[] {
  let changes: ChangeData[] = [];
  const lines = text.split(/\r?\n/);
  let currentChange: ChangeData | null = null;
  let subInfoItem = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const componentMatch = line.match(COMPONENT_REGEX);
    const componentWithLinkMatch = line.match(COMPONENT_WITH_LINK_REGEX);
    const componentSubItemMatch = line.match(COMPONENT_SUB_ITEM_REGEX);
    const unknownChangeMatch = line.match(UNKNOWN_CHANGE_REGEX);
    const addToAdditionalInfo = () => {
      if (currentChange) {
        const subInfo = currentChange.type === "component" && subInfoItem;
        currentChange.additionalInfo += `${removeLeadingSpaces(
          line,
          subInfo ? 4 : 2
        )}\n`;
      }
    };

    if (componentMatch || componentWithLinkMatch) {
      const match = componentMatch || componentWithLinkMatch;
      if (match) {
        const component = match[1];
        const description = match[2] || "";
        subInfoItem = false;
        currentChange = {
          type: "component",
          component: component,
          description: description.trim(),
          additionalInfo: "",
        };
        changes.push(currentChange);
      }
    } else if (
      componentSubItemMatch &&
      currentChange &&
      currentChange.type === "component" &&
      !currentChange.description
    ) {
      // Описание для текущего компонента
      const description = componentSubItemMatch[1].trim();
      subInfoItem = true;
      currentChange = {
        type: "component",
        component: currentChange.component,
        description: description,
        additionalInfo: "",
      };
      changes.push(currentChange);
    } else if (unknownChangeMatch) {
      // Неизвестное изменение
      const description = unknownChangeMatch[1].trim();
      currentChange = {
        type: "unknown",
        description: description,
        additionalInfo: "",
      };
      changes.push(currentChange);
    } else if (currentChange) {
      addToAdditionalInfo();
    } else if (line) {
      // Если строка не пустая и не относится к текущему изменению,
      // создаем новое неизвестное изменение
      currentChange = {
        type: "unknown",
        description: line,
        additionalInfo: "",
      };
      changes.push(currentChange);
    }
  }
  changes = changes.filter((change) => !!change.description);
  changes.forEach(
    (change) => (change.additionalInfo = change.additionalInfo?.trim())
  );

  return changes;
}
