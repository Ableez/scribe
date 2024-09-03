import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from "lexical";
import { useCallback, useEffect } from "react";
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $setBlocksType,
} from "@lexical/selection";

type Props = {};
export const TEXT_BACKGROUND_COLOR_COMMAND: LexicalCommand<string> =
  createCommand("TEXT_BACKGROUND_COLOR_COMMAND");

const BackgroundColorPlugin = (props: Props) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand<string>(
      TEXT_BACKGROUND_COLOR_COMMAND,
      (payload) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, { "background-color": payload });
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
};

export default BackgroundColorPlugin;
