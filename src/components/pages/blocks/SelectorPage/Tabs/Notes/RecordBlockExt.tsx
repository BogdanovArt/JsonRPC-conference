import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { RecordBlock } from "./RecordBlock";

export default Node.create({
  name: "recordBlock",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      id: {
        default: "",
      },
      recordId: {
        default: "",
      },
      savedId: {
        default: "",
      },
      timeStart: {
        default: "",
      },
      timeEnd: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "record-block",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["record-block", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(RecordBlock);
  },
});
