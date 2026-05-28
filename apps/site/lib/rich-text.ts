export const emptyRichTextDocument = {
  root: {
    children: [
      {
        children: [],
        direction: null,
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1
      }
    ],
    direction: null,
    format: "",
    indent: 0,
    type: "root",
    version: 1
  }
};

export function htmlEditorSeed(html: string) {
  return {
    format: "html",
    html
  };
}

export function renderRichTextHtml(content: unknown, fallbackHtml = ""): string {
  if (!content || typeof content !== "object") return fallbackHtml;
  if ("html" in content && typeof content.html === "string") return content.html;
  return fallbackHtml;
}
