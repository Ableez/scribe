import { Button } from "@/components/ui/button";
import { FORMAT_TEXT_COMMAND, type LexicalEditor } from "lexical";
import React from "react";
// import { $patchStyleText } from "@lexical/selection";
// import { $getSelection } from "lexical";
import { useNoteStore } from "@/lib/store/noteeditor";
import {
  Bold,
  Highlighter,
  Italic,
  Strikethrough,
  Underline,
} from "lucide-react";
import TextColorSelector from "../text-color-selector";

type Props = {
  editor: LexicalEditor;
};

const TextFormats = ({ editor }: Props) => {
  const { currEditorState, updateEditorState } = useNoteStore();
  const { isBold, isHighlight, isItalic, isStrikethrough, isUnderline } =
    currEditorState;

  // const applyStyleText = useCallback(
  //   (styles: Record<string, string>, skipHistoryStack?: boolean) => {
  //     editor.update(
  //       () => {
  //         const selection = $getSelection();
  //         if (selection !== null) {
  //           $patchStyleText(selection, styles);
  //         }
  //       },
  //       skipHistoryStack ? { tag: "historic" } : {},
  //     );
  //   },
  //   [editor],
  // );

  // const onTextColorText = useCallback(
  //   (value: string, skipHistoryStack: boolean) => {
  //     applyStyleText({ "background-color": value }, skipHistoryStack);
  //   },
  //   [applyStyleText],
  // );

  return (
    <div className="flex place-items-center justify-between gap-2 align-middle">
      <div className="flex w-fit overflow-clip rounded bg-violet-100 align-middle dark:bg-neutral-900">
        <Button
          className={`${isBold ? "bg-violet-200 text-violet-700 dark:bg-violet-400/10 dark:text-violet-600" : ""} h-12 min-w-12 max-w-14 rounded-none`}
          variant={"icon"}
          size={"icon"}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
        >
          <Bold strokeWidth={4.618} size={18} />
        </Button>
        <Button
          className={`${isItalic ? "bg-violet-200 text-violet-700 dark:bg-violet-400/10 dark:text-violet-600" : ""} h-12 min-w-12 max-w-14 rounded-none outline outline-white dark:outline-neutral-800`}
          variant={"icon"}
          size={"icon"}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            if (isItalic) {
              updateEditorState({ isItalic: false });
            } else {
              updateEditorState({ isItalic: true });
            }
          }}
        >
          <Italic size={18} />
        </Button>

        <Button
          className={`${
            isUnderline
              ? "bg-violet-200 text-violet-700 dark:bg-violet-400/10 dark:text-violet-600"
              : ""
          } h-12 min-w-12 max-w-14 rounded-none`}
          variant={"icon"}
          size={"icon"}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");

            if (isStrikethrough) {
              updateEditorState({
                isUnderline: false,
                isStrikethrough: false,
              });
            } else {
              updateEditorState({
                isUnderline: false,
                isStrikethrough: false,
              });
            }
          }}
        >
          <Underline size={18} />
        </Button>
        <Button
          className={`${
            isStrikethrough
              ? "bg-violet-200 text-violet-700 dark:bg-violet-400/10 dark:text-violet-600"
              : ""
          } h-12 min-w-12 max-w-14 rounded-none`}
          variant={"icon"}
          size={"icon"}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            if (isUnderline) {
              updateEditorState({
                isStrikethrough: true,
                isUnderline: false,
              });
            } else {
              updateEditorState({
                isStrikethrough: false,
                isUnderline: false,
              });
            }
          }}
        >
          <Strikethrough size={18} />
        </Button>
      </div>
      <div className="flex w-fit overflow-clip rounded bg-violet-100 align-middle dark:bg-neutral-900">
        <TextColorSelector editor={editor} />
        <Button
          className={`${
            isHighlight
              ? "bg-violet-200 text-violet-700 dark:bg-violet-400/10 dark:text-violet-600"
              : ""
          } h-12 min-w-12 max-w-14 rounded-none outline outline-white dark:outline-neutral-800`}
          variant={"icon"}
          size={"icon"}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
          }}
        >
          <Highlighter size={18} />
        </Button>
      </div>
    </div>
  );
};

export default TextFormats;
