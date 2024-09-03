import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { EditorState } from "lexical";

type Props = {
  onChange: (editorState: EditorState) => void;
};

const OnChangePlugin = ({ onChange }: Props) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);

  return null;
};

export default OnChangePlugin;
