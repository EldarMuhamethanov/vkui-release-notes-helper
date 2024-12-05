import { ChangeData } from "./types";

export const convertChangesToString = (changes: ChangeData[]): string => {
  let result = "";
  const filteredChanges: ChangeData[] = [];
  const mapComponentToChanges: Map<string, ChangeData[]> = new Map();

  // Группируем пункты одинаковых компонентов в элемент мапы
  changes.forEach((change) => {
    if (change.type === "component") {
      const componentChanges = mapComponentToChanges.get(change.component);
      if (!componentChanges) {
        filteredChanges.push(change);
        mapComponentToChanges.set(change.component, [change]);
      } else {
        componentChanges.push(change);
      }
    } else {
      filteredChanges.push(change);
    }
  });

  const addAdditionalInfo = (change: ChangeData, offsetLevel: number) => {
    const offsetStr = " ".repeat(offsetLevel * 2);
    if (change.additionalInfo) {
      change.additionalInfo.split(/\r?\n/).forEach((line) => {
        result += `${offsetStr}${line}\n`;
      });
    }
  };

  filteredChanges.forEach((change) => {
    if (change.type === "component") {
      const componentChanges = mapComponentToChanges.get(change.component);
      if (!componentChanges) {
        return;
      }
      result += `- ${change.component}:`;
      if (componentChanges.length > 1) {
        result += "\n";
        componentChanges.forEach((changeItem) => {
          result += `  - ${changeItem.description}\n`;
          addAdditionalInfo(changeItem, 2);
        });
      } else {
        result += ` ${change.description}\n`;
        addAdditionalInfo(change, 1);
      }
    } else {
      result += `- ${change.description}\n`;
      addAdditionalInfo(change, 1);
    }
  });

  return result;
};
