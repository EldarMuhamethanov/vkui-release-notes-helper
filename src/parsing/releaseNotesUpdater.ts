import { ReleaseNoteData } from "./types";
import {
  getHeaderBySectionType,
  getSectionTypeByHeader,
} from "./headers";
import { parseChanges } from "./parseChanges";
import { convertChangesToString } from "./convertChangesToString";

export function releaseNotesUpdater(currentBody: string) {
  let body = currentBody.trim();

  const setBody = (newBody: string) => {
    body = newBody.trim();
  };

  const getReleaseNotesData = (): ReleaseNoteData[] => {
    const releaseNotesData: ReleaseNoteData[] = [];
    const sectionRegex = /## (.+)\r?\n([\s\S]*?)(?=##|$)/g;
    const matches = body.matchAll(sectionRegex);
    for (const match of matches) {
      const [, header, content] = match;
      const trimmedHeader = header.trim();
      const trimmedContent = content.trim();
      const typeByHeader = getSectionTypeByHeader(trimmedHeader);
      if (!typeByHeader) {
        continue;
      }

      releaseNotesData.push({
        type: typeByHeader,
        data: parseChanges(trimmedContent),
      });
    }

    return releaseNotesData;
  };

  const updateReleaseNotes = (newReleaseNotes: ReleaseNoteData[]) => {
    newReleaseNotes = newReleaseNotes.reduce((acc, section) => {
      const existedSection = acc.find((item) => item.type === section.type);
      if (existedSection) {
        existedSection.data.push(...section.data);
      } else {
        acc.push(section);
      }
      return acc;
    }, [] as ReleaseNoteData[]);

    body = newReleaseNotes
      .map((section) => {
        return `## ${getHeaderBySectionType(
          section.type
        )}\n${convertChangesToString(section.data)}`;
      })
      .join("\n");
  };

  return {
    getBody: () => body,
    getReleaseNotesData,
    updateReleaseNotes,
    setBody,
  };
}
