"use client";
import React, { useState } from "react";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { type EditorState } from "lexical";
import OnChangePlugin from "./_components/editor-plugins/onchange-plugin";
import ToolbarPlugin from "./_components/editor-plugins/toolbar-plugin";
import UndoRedoTools from "./_components/editor-plugins/undo-redo-tools";
import EditorTheme from "./_components/editor-plugins/editor-theme";
import { Input } from "@/components/ui/input";
import { parseTime } from "@/lib/utils";
import FloatingTextFormatToolbarPlugin from "./_components/editor-plugins/floating-formater-plugin";
import { useTheme } from "next-themes";
import { useNoteContentStore } from "@/lib/store/notecontent";

const onError = (error: Error) => {
  console.log("====================================");
  console.log("NOTE EDITOR ENCOUNTERED AN ERROR: ", error);
  console.log("====================================");
};

const initialConfig = {
  namespace: "MyEditor",
  theme: EditorTheme,
  onError,
};

const CreateNote = () => {
  const [floatingAnchorElem] = useState<HTMLElement>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setIsLinkEditMode] = useState<boolean>(false);
  const { theme } = useTheme();

  const { setEditorState } = useNoteContentStore();

  const onChange = (editorState: EditorState) => {
    // Call toJSON on the EditorState object, which produces a serialization safe string
    const editorStateJSON = editorState.toJSON();
    // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
    setEditorState(editorStateJSON);
  };

  return (
    <div className="mx-auto w-full">
      <LexicalComposer initialConfig={initialConfig}>
        <UndoRedoTools />
        <div className="relative pt-1 dark:bg-[#171717]">
          <div className="mb-2 pb-4 md:max-w-[40dvw]">
            <Input className="h-12 rounded-none border-b border-neutral-400 border-x-transparent border-t-transparent pb-1 pl-7 text-lg font-semibold focus-visible:ring-0 dark:border-neutral-700 dark:border-l-transparent dark:border-r-transparent dark:border-t-transparent md:pl-8" />
            <h4 className="ml-7 text-xs font-medium text-neutral-400 dark:text-neutral-600">
              {parseTime(new Date().toUTCString(), { fullDateAndTime: true })}
            </h4>
          </div>
          <div className="fixed left-6 top-0 h-[100dvh] border-l-[1.618px] border-red-600/80" />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={`${theme === "dark" ? "darklined-bg" : "lined-bg"} min-h-[80dvh] px-0.5 pb-16 focus:outline-none md:pl-2`}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <AutoFocusPlugin />
        <FloatingTextFormatToolbarPlugin
          anchorElem={floatingAnchorElem}
          setIsLinkEditMode={setIsLinkEditMode}
        />
        <OnChangePlugin onChange={onChange} />
        <ToolbarPlugin />
      </LexicalComposer>
    </div>
  );
};

export default CreateNote;
