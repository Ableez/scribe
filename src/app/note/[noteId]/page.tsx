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
import { useTheme } from "next-themes";
import useNotesStore, { useNotesData } from "@/lib/store/notecontent";
import { Loader2 } from "lucide-react";
import { formatRelative } from "date-fns";
import FloatingLinkEditorPlugin from "../_components/editor-plugins/floating-link-formater-plugin";
import FloatingTextFormatToolbarPlugin from "../_components/editor-plugins/floating-text-formatter";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeNode } from "@lexical/code";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
// import TreeViewPlugin from "../_components/editor-plugins/tree-view-debugger";
import { api, queryClient } from "@/trpc/react";
import { debounce } from "lodash";
import CommentPlugin from "../_components/editor-plugins/CommentPlugin";
import { createWebsocketProvider } from "../_components/editor-plugins/CommentPlugin/commenting/collaboration";
import { MarkNode } from "@lexical/mark";

const onError = (error: Error) => {
  console.error("NOTE EDITOR ENCOUNTERED AN ERROR: ", error);
};

const initialConfig = {
  namespace: "MyEditor",
  theme: EditorTheme,
  onError,
  nodes: [
    HeadingNode,
    QuoteNode,
    CodeNode,
    ListNode,
    ListItemNode,
    LinkNode,
    MarkNode,
  ],
};

const CreateNote = ({ params }: { params: { noteId: string } }) => {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isCollab] = useState(false);

  const { theme } = useTheme();
  const { updateNote, getNote } = useNotesData();
  const [mount, setMount] = useState<boolean>(false);
  const [editorState, setEditorState] = useState<string | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const updateMut = api.note.updateNote.useMutation({
    onSuccess: async (res) => {
      if (res.data[0]) {
        useNotesStore
          .getState()
          .updateNote({ editorState: res.data[0]?.editorState });
        debounce(() => void queryClient.invalidateQueries(), 1618);
      }
    },
  });

  const debouncedUpdateNote = debounce(
    (noteId: string, editorState: string) => {
      updateMut.mutate({ noteId, updateFields: { editorState } });
    },
    1000,
  ); // Delay of 1 second

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

    if (!editorStateJSON.root.direction) return;

    const serializedState = JSON.stringify(editorStateJSON);
    setEditorState(serializedState);
    updateNote(params.noteId, { editorState: serializedState });

    // Update local Zustand store immediately
    useNotesStore
      .getState()
      .updateEditorState(params.noteId, JSON.stringify(editorState));

    // Debounce the server update
    debouncedUpdateNote(params.noteId, serializedState);
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
          <div className="fixed left-6 top-0 z-[45] h-[100dvh] border-l-[1.618px] border-red-600/80 bg-violet-500" />
          <div className="relative" ref={onRef}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={`${theme === "dark" ? "darklined-bg" : "lined-bg"} min-h-[80dvh] px-0.5 pb-16 focus:outline-none md:pl-2`}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
            <FloatingTextFormatToolbarPlugin
              anchorElem={floatingAnchorElem}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          </div>
        </div>
        <HistoryPlugin />
        <AutoFocusPlugin />

        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        {/* <HorizontalRule />
        <MarkdownShortcutPlugin /> */}
        <CommentPlugin
          providerFactory={_isCollab ? createWebsocketProvider : undefined}
        />
        {/* <TreeViewPlugin /> */}
        <OnChangePlugin onChange={onChange} />
        <ToolbarPlugin />
      </LexicalComposer>
    </div>
  );
};

export default CreateNote;
