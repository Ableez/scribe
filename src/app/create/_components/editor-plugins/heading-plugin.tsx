import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from "lexical";
import {
  $createHeadingNode,
  HeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import { useEffect } from "react";

// Create a custom command for changing text to headers
export const FORMAT_HEADER_COMMAND: LexicalCommand<HeadingTagType | null> =
  createCommand("FORMAT_HEADER_COMMAND");

// Create a custom plugin to handle header formatting
export function HeaderFormattingPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([HeadingNode])) {
      throw new Error("HeadingNode plugin is not registered on the editor");
    }

    return editor.registerCommand<HeadingTagType | null>(
      FORMAT_HEADER_COMMAND,
      (payload) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          if (payload === null) {
            $setBlocksType(selection, () => $createParagraphNode());
          } else {
            $setBlocksType(selection, () => $createHeadingNode(payload));
          }
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
