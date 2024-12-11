import { createElement } from "../../utils/dom";
import EasyMDE from "easymde";
import "./MarkdownField.css";

export const createMarkdownField = ({
  container,
  value,
  onChange,
  className,
}: {
  container: HTMLElement;
  className?: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const textarea = createElement<HTMLTextAreaElement>(
    "textarea",
    `markdown-editor ${className}`,
    container,
    (element) => {
      element.value = value;
    }
  );

  const simplemde = new EasyMDE({
    element: textarea,
    initialValue: value,
    autoDownloadFontAwesome: false,
    toolbar: false,
    status: false,
    maxHeight: "80px",
    minHeight: "60px",
    spellChecker: false,
    autoRefresh: true,
    forceSync: true,
    lineWrapping: true,
    shortcuts: {
      drawTable: "Cmd-Alt-T",
      toggleCodeBlock: "Cmd-E",
      cleanBlock: null,
    },
    previewRender: () => null,
  });

  simplemde.codemirror.on("change", () => {
    const newValue = simplemde.value();
    textarea.value = newValue;
    onChange(newValue);
  });

  return simplemde;
};
