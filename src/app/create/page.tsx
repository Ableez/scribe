"use client";
import React, { useState } from "react";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import {
  EditorState,
  SerializedEditorState,
  SerializedLexicalNode,
} from "lexical";
import OnChangePlugin from "./_components/editor-plugins/onchange-plugin";
import ToolbarPlugin from "./_components/editor-plugins/toolbar-plugin";
import UndoRedoTools from "./_components/editor-plugins/undo-redo-tools";
import TreeViewPlugin from "./_components/editor-plugins/tree-view-debugger";
import EditorTheme from "./_components/editor-plugins/editor-theme";
import { useNoteStore } from "@/lib/store/noteeditor";
import { Input } from "@/components/ui/input";
import { parseTime } from "@/lib/utils";

type Props = {};

const onError = (error: Error) => {
  console.log("====================================");
  console.log("LEXICAL EDITOR ERROR: ", error);
  console.log("====================================");
};

const initialConfig = {
  namespace: "MyEditor",
  theme: EditorTheme,
  onError,
};

const CreateNote = (props: Props) => {
  const { setEditorState } = useNoteStore();
  const onChange = (editorState: EditorState) => {
    // Call toJSON on the EditorState object, which produces a serialization safe string
    const editorStateJSON = editorState.toJSON();
    // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
    setEditorState(editorStateJSON);
  };

  return (
    <div className="relative">
      <LexicalComposer initialConfig={initialConfig}>
        <UndoRedoTools />
        <div className="relative pt-1">
          <div className="mb-2 pb-4">
            <Input className="h-12 rounded-none border-b border-neutral-400 border-x-transparent border-t-transparent pb-1 pl-7 text-lg font-semibold focus-visible:ring-0 dark:border-neutral-600" />
            <h4 className="ml-7 text-xs font-medium text-neutral-400 dark:text-neutral-600">
              {parseTime(new Date().toUTCString(), { fullDateAndTime: true })}
            </h4>
          </div>
          <div className="absolute left-6 top-0 h-[100dvh] border-l border-red-600/60" />
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="lined-bg min-h-[80dvh] px-0.5 focus:outline-none" />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <AutoFocusPlugin />
        {/* <TreeViewPlugin /> */}
        <OnChangePlugin onChange={onChange} />
        <ToolbarPlugin />
      </LexicalComposer>
    </div>
  );
};

export default CreateNote;
