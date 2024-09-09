import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef } from "react";
import TextFormatDrawer from "./text-format-drawer";
import { useNoteStore } from "@/lib/store/noteeditor";
import TextFormats from "./essential-text-format";
import TextstylePicker from "./textstyle-picker";

const LowPriority = 1;

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);

  const { updateEditorState } = useNoteStore();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      updateEditorState({ isBold: selection.hasFormat("bold") });
      updateEditorState({ isItalic: selection.hasFormat("italic") });
      updateEditorState({ isUnderline: selection.hasFormat("underline") });
      updateEditorState({ isCodeblock: selection.hasFormat("code") });
      updateEditorState({ isHighlight: selection.hasFormat("highlight") });
      updateEditorState({ isSubscript: selection.hasFormat("subscript") });
      updateEditorState({ isSuperscript: selection.hasFormat("superscript") });
      updateEditorState({
        isStrikethrough: selection.hasFormat("strikethrough"),
      });
    }
  }, [updateEditorState]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, $updateToolbar]);

  return (
    <div
      className="fixed bottom-6 left-1/2 flex w-screen max-w-screen-sm -translate-x-1/2 place-items-center justify-between gap-2 overflow-y-scroll bg-white/50 px-2 py-1.5 align-middle dark:bg-violet-600/10 md:bottom-0"
      ref={toolbarRef}
    >
      <div className="flex w-fit gap-3 overflow-clip rounded bg-violet-100 align-middle dark:bg-neutral-900">
        <TextstylePicker />
        <TextFormatDrawer editor={editor} />
      </div>
      <TextFormats editor={editor} />
    </div>
  );
}
