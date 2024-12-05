import { createEditReleaseNotesButton } from "./feature/editReleaseNotesButton";
import "./styles/content.css";
import { createEditReleaseNotesPopup } from "./feature/EditReleaseNotesPopup/EditReleaseNotesPopup";

const getCommentBox = (prDescriptionBlock: HTMLElement): HTMLElement => {
  return prDescriptionBlock.querySelector<HTMLElement>(
    ".CommentBox-container"
  )!;
};

const getTextarea = (container: HTMLElement): HTMLTextAreaElement => {
  return container.querySelector<HTMLTextAreaElement>("textarea")!;
};

const getCommentBoxAsync = (
  prDescriptionBlock: HTMLElement
): Promise<HTMLElement> => {
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const commentBox = getCommentBox(prDescriptionBlock);
      if (commentBox) {
        resolve(commentBox);
        observer.disconnect();
      }
    });
    observer.observe(prDescriptionBlock, {
      subtree: true,
      childList: true,
      attributes: true,
    });
  });
};

const initExtension = async () => {
  const prDescriptionBlock =
    document.querySelector<HTMLElement>('[id^="pullrequest-"]') ||
    document.querySelector<HTMLElement>("#new_pull_request");

  if (!prDescriptionBlock) {
    console.log("PR description block not found");
    return;
  }

  const commentBox = await getCommentBoxAsync(prDescriptionBlock);
  const textarea = getTextarea(commentBox);

  const popup: HTMLElement | null = createEditReleaseNotesPopup({
    width: 500,
    height: 600,
    textarea,
    onClose: () => {},
    onSave: (newTextAreaValue) => {
      textarea.value = newTextAreaValue;
    },
  });

  createEditReleaseNotesButton({
    container: commentBox,
    onClick: () => popup && document.body.appendChild(popup),
  });
};

initExtension();
