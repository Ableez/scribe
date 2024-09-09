"use client";

import React, { useEffect, useState } from "react";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import type { EditorState } from "lexical";
import OnChangePlugin from "../_components/editor-plugins/onchange-plugin";
import ToolbarPlugin from "../_components/editor-plugins/toolbar-plugin";
import UndoRedoTools from "../_components/editor-plugins/undo-redo-tools";
import EditorTheme from "../_components/editor-plugins/editor-theme";
import { Input } from "@/components/ui/input";
import FloatingTextFormatToolbarPlugin from "../_components/editor-plugins/floating-formater-plugin";
import { useTheme } from "next-themes";
import { useNotesData } from "@/lib/store/notecontent";
import { Loader2 } from "lucide-react";
import { formatRelative } from "date-fns";

const onError = (error: Error) => {
  console.error("NOTE EDITOR ENCOUNTERED AN ERROR: ", error);
};

const initialConfig = {
  namespace: "MyEditor",
  theme: EditorTheme,
  onError,
};

const CreateNote = ({ params }: { params: { noteId: string } }) => {
  const [floatingAnchorElem] = useState<HTMLElement | null>(null);
  const [_, setIsLinkEditMode] = useState<boolean>(false);
  const { theme } = useTheme();
  const { updateNote, getNote } = useNotesData();
  const [mount, setMount] = useState<boolean>(false);
  const [editorState, setEditorState] = useState<string | null>(null);

  useEffect(() => {
    if (!mount) setMount(true);
  }, [mount]);

  useEffect(() => {
    const noteById = getNote(params.noteId);
    if (noteById?.editorState) {
      setEditorState(noteById.editorState);
    } else {
      // Set a default empty state if no existing state is found
      setEditorState(
        JSON.stringify({
          root: {
            children: [
              {
                children: [],
                direction: null,
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
              },
            ],
            direction: null,
            format: "",
            indent: 0,
            type: "root",
            version: 1,
          },
        }),
      );
    }
  }, [params.noteId, getNote]);

  const onChange = (editorState: EditorState) => {
    const editorStateJSON = editorState.toJSON();
    const serializedState = JSON.stringify(editorStateJSON);
    setEditorState(serializedState);
    updateNote(params.noteId, { editorState: serializedState });
  };

  if (!mount || editorState === null || !getNote(params.noteId)) {
    return (
      <div className="grid h-screen place-items-center justify-center align-middle">
        <h4 className="flex place-items-center justify-center gap-2 align-middle text-sm font-semibold text-neutral-500">
          <Loader2
            size={18}
            className="duration-&lsqb;1.618s&rsqb; animate-spin"
          />
          Loading...
        </h4>
      </div>
    );
  }

  // if (mount && !getNote(params.noteId)) {
  //   return (
  //     <div className="bg-background flex min-h-[100dvh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
  //       <div className="mx-auto max-w-md text-center">
  //         <TriangleAlertIcon className="text-primary mx-auto h-12 w-12" />
  //         <h1 className="text-foreground mt-4 text-6xl font-bold tracking-tight sm:text-7xl">
  //           ooops!
  //         </h1>
  //         <p className="text-muted-foreground mt-4 text-sm md:text-lg">
  //           Oops, the note you were looking for doesn&apos;t exist.
  //         </p>
  //         <div className="mt-6">
  //           <Link href="/app">
  //             <Button>Go Back Home</Button>
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="mx-auto w-full">
      <LexicalComposer
        initialConfig={{
          ...initialConfig,
          editorState: editorState,
        }}
      >
        <UndoRedoTools />
        <div className="relative pt-1 dark:bg-[#171717]">
          <div className="mb-2 pb-4 md:max-w-[40dvw]">
            <Input
              className="h-12 rounded-none border-b border-neutral-400 border-x-transparent border-t-transparent pb-1 pl-7 text-lg font-semibold focus-visible:ring-0 dark:border-neutral-700 dark:border-l-transparent dark:border-r-transparent dark:border-t-transparent md:pl-8"
              onChange={(e) =>
                updateNote(params.noteId, { title: e.target.value })
              }
              defaultValue={getNote(params.noteId)?.title}
            />
            <h4 className="ml-7 text-xs font-medium text-neutral-400 dark:text-neutral-600">
              {formatRelative(
                getNote(params.noteId)!.updatedAt,
                getNote(params.noteId)!.createdAt,
              )}
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
