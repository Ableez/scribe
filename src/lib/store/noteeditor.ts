import type { SerializedEditorState, SerializedLexicalNode } from "lexical";
import { create } from "zustand";

type State = {
  currEditorState: {
    isBold: boolean;
    isUnderline: boolean;
    isItalic: boolean;
    isStrikethrough: boolean;
    isHighlight: boolean;
    isCodeblock: boolean;
  };
  editorState: SerializedEditorState<SerializedLexicalNode> | null;
};

type Action = {
  updateEditorState: (obj: Record<string, boolean>) => void;
  setEditorState: (
    editorState: SerializedEditorState<SerializedLexicalNode>,
  ) => void;
};

export const useNoteStore = create<State & Action>((set) => ({
  currEditorState: {
    isBold: false,
    isItalic: false,
    isStrikethrough: false,
    isUnderline: false,
    isCodeblock: false,
    isHighlight: false,
    isSubscript: false,
    isSuperscript: false,
  },
  editorState: null,
  updateEditorState: (obj) =>
    set((state) => ({ currEditorState: { ...state.currEditorState, ...obj } })),
  setEditorState: (editorState) => set(() => ({ editorState })),
}));
