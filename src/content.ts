import { initEditReleaseNotesButton } from "./feature/editReleaseNotesButton";
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

  let popup: HTMLElement | null = null;

  initEditReleaseNotesButton({
    container: commentBox,
    onClick: () => {
      if (popup) {
        popup.remove();
      }

      popup = createEditReleaseNotesPopup({
        width: 500,
        height: 600,
        textarea,
        onClose: () => {
          popup = null;
        },
        onSave: (newTextAreaValue) => {
          textarea.value = newTextAreaValue;
        },
      });

      popup && document.body.appendChild(popup);
    },
  });
};

initExtension();
