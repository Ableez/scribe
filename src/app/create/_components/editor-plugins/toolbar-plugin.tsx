import { Button } from "@/components/ui/button";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { DividerVerticalIcon } from "@radix-ui/react-icons";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  PlusIcon,
  Strikethrough,
  Underline,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import TextFormatDrawer from "./text-format-drawer";
import { useNoteStore } from "@/lib/store/noteeditor";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const LowPriority = 1;

function Divider() {
  return <DividerVerticalIcon />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);

  const { currEditorState, updateEditorState } = useNoteStore();

  const { isUnderline, isBold, isItalic, isStrikethrough } = currEditorState;

  console.log("CURR STATE", currEditorState);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      updateEditorState({ isBold: selection.hasFormat("bold") });
      updateEditorState({ isItalic: selection.hasFormat("italic") });
      updateEditorState({ isUnderline: selection.hasFormat("underline") });
      updateEditorState({
        isStrikethrough: selection.hasFormat("strikethrough"),
      });
    }
  }, []);

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
      className="fixed bottom-0 flex w-screen place-items-center justify-between gap-2 overflow-y-scroll bg-white px-2 align-middle dark:bg-neutral-900"
      ref={toolbarRef}
    >
      <div className="mx-2 flex place-items-center gap-0.5 rounded-2xl border border-violet-100 bg-violet-100/80 align-middle">
        <Button
          variant={"icon"}
          size={"icon"}
          className={`h-10 w-12`}
          title="More options"
        >
          <PlusIcon size={18} />
        </Button>
      </div>
      <TextFormatDrawer editor={editor} />
      <div className="flex w-fit overflow-clip rounded bg-violet-100 align-middle">
        <Button
          className={`${isBold ? "bg-violet-200 text-violet-700" : ""} h-10 w-12 rounded-none`}
          variant={"icon"}
          size={"icon"}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
        >
          <Bold strokeWidth={4.618} size={18} />
        </Button>
        <Button
          className={`${isItalic ? "bg-violet-200 text-violet-700" : ""} h-10 w-12 rounded-none outline outline-white`}
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
            isUnderline ? "bg-violet-200 text-violet-700" : ""
          } h-10 w-12 rounded-none`}
          variant={"icon"}
          size={"icon"}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");

            if (isStrikethrough) {
              updateEditorState({ isUnderline: false, isStrikethrough: false });
            } else {
              updateEditorState({ isUnderline: false, isStrikethrough: false });
            }
          }}
        >
          <Underline size={18} />
        </Button>
        <Button
          className={`${
            isStrikethrough ? "bg-violet-200 text-violet-700" : ""
          } h-10 w-12 rounded-none`}
          variant={"icon"}
          size={"icon"}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            if (isUnderline) {
              updateEditorState({ isStrikethrough: true, isUnderline: false });
            } else {
              updateEditorState({ isStrikethrough: false, isUnderline: false });
            }
          }}
        >
          <Strikethrough size={18} />
        </Button>
      </div>
    </div>
  );
}
