const RELEASE_NOTE_HEADER = "## Release notes";
const COMMENT_START = "<!-- ";

const createReleaseNotesBlock = (notesBody: string) => {
  return `## Release notes\n${notesBody || "-\n"}`;
};

export const getPullRequestReleaseNotesBody = (body: string): string | null => {
  const releaseNotesIndex = body.indexOf(RELEASE_NOTE_HEADER);
  if (releaseNotesIndex === -1) {
    return null;
  }
  const commentStart = body.indexOf(COMMENT_START, releaseNotesIndex);
  const end = commentStart !== -1 ? commentStart : body.length;

  return body.slice(releaseNotesIndex + RELEASE_NOTE_HEADER.length, end).trim();
};

export const getUpdatedPullRequestReleaseNotesBody = (
  body: string,
  newNotesBody: string
): string => {
  const releaseNotesIndex = body.indexOf(RELEASE_NOTE_HEADER);

  if (releaseNotesIndex === -1) {
    return [body, createReleaseNotesBlock(newNotesBody)].join("\n");
  }
  const commentStart = body.indexOf(COMMENT_START, releaseNotesIndex);
  const end = commentStart !== -1 ? commentStart : body.length;

  const head = body.slice(0, releaseNotesIndex);
  const tail = body.slice(end);
  return [head, createReleaseNotesBlock(newNotesBody), tail]
    .filter(Boolean)
    .join("");
};
