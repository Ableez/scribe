"use client";

import { TRANSFORMERS } from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeNode } from "@lexical/code";
import { ListNode, ListItemNode } from "@lexical/list";
import { MarkNode } from "@lexical/mark";
import { useState, useEffect, useRef } from "react";
import { Check, Edit, Loader2 } from "lucide-react";
import { formatRelative } from "date-fns";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LinkNode } from "@lexical/link";

import EditorTheme from "../_components/editor-plugins/editor-theme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import UndoRedoTools from "../_components/editor-plugins/undo-redo-tools";
import { Input } from "@/components/ui/input";
import FloatingLinkEditorPlugin from "../_components/editor-plugins/floating-link-formater-plugin";
import FloatingTextFormatToolbarPlugin from "../_components/editor-plugins/floating-text-formatter";
import ToolbarPlugin from "../_components/editor-plugins/toolbar-plugin";
import CommentPlugin from "../_components/editor-plugins/CommentPlugin";
import type { EditorState } from "lexical";
import useNotesStore, {
  useNotesData,
  type Note,
} from "@/lib/store/notecontent";
import { useTheme } from "next-themes";
import { useWarnIfUnsavedChanges } from "@/lib/hooks/useWarnBeforeUnload";
import TreeViewPlugin from "../_components/editor-plugins/tree-view-debugger";
import { Button } from "@/components/ui/button";

type Props = {
  params: {
    noteId: string;
  };
};

const onError = (error: Error) => {
  console.error(error);
  throw new Error("Editor error: " + error.message);
};

const initialConfig = {
  namespace: "notes-editor",
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
  editorState: JSON.stringify({
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: "",
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  }),
};

const CreateNote = ({ params }: Props) => {
  const { updateNote, getNote } = useNotesStore();
  const [noteData, setNoteData] = useState<Note | undefined>(() =>
    getNote(params.noteId),
  );
  const { updateTitle } = useNotesData();
  const [editTitle, setEditTitle] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const { theme } = useTheme();
  const floatingAnchorRef = useRef<HTMLDivElement>(null);
  const [noteTitle, setNoteTitle] = useState(noteData?.title ?? "");

  useWarnIfUnsavedChanges(hasChanges);

  useEffect(() => {
    const note = getNote(params.noteId);
    if (note) {
      setNoteData(note);
    }
  }, [getNote, params.noteId]);

  const onChange = (editorState: EditorState) => {
    const editorStateJSON = editorState.toJSON();
    const serialized = JSON.stringify(editorStateJSON);

    if (!editorStateJSON.root.direction) return;

    updateNote({ id: params.noteId, editorState: serialized });
    setHasChanges(true);
  };

  const handleTitleChange = async () => {
    await updateTitle.mutateAsync({
      noteId: params.noteId,
      updateFields: { title: noteTitle },
    });

    setNoteData((prev) => (prev ? { ...prev, title: noteTitle } : prev));
  };

  if (!noteData) {
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
          editorState: noteData.editorState || initialConfig.editorState,
        }}
      >
        <UndoRedoTools
          noteId={params.noteId}
          hasChanges={hasChanges}
          setHasChanges={setHasChanges}
        />
        <div className="relative pt-1 dark:bg-[#171717]">
          <div className="mb-2 pb-4 md:max-w-[40dvw]">
            <div className="flex w-full place-items-center justify-start align-middle">
              <Input
                className="h-12 rounded-none border-b border-neutral-400 border-x-transparent border-t-transparent pb-1 pl-7 text-lg font-semibold focus-visible:ring-0 dark:border-neutral-700 dark:border-l-transparent dark:border-r-transparent dark:border-t-transparent md:pl-8"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                disabled={!editTitle}
              />
              <Button
                onClick={async () => {
                  if (!editTitle) setEditTitle(true);
                  else {
                    await handleTitleChange();
                    setHasChanges(false);
                    setEditTitle(false);
                  }
                }}
                variant={"ghost"}
                className={`${!editTitle ? "border-none" : "text-violet-500"} `}
                size={"icon"}
              >
                {!editTitle ? <Edit size={16} /> : <Check size={16} />}
              </Button>
            </div>
            <h4 className="ml-7 text-xs font-medium text-neutral-400 dark:text-neutral-600">
              {formatRelative(noteData.updatedAt, noteData.createdAt)}
            </h4>
          </div>
          <div className="fixed left-6 top-0 z-[45] h-[100dvh] border-l-[1.618px] border-red-600/80 bg-violet-500" />
          <div className="relative" ref={floatingAnchorRef}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={`${
                    theme === "dark" ? "darklined-bg" : "lined-bg"
                  } min-h-[80dvh] px-0.5 pb-16 focus:outline-none md:pl-2`}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorRef.current}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
            <FloatingTextFormatToolbarPlugin
              anchorElem={floatingAnchorRef.current}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          </div>
        </div>
        <HistoryPlugin />
        <AutoFocusPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <CommentPlugin />
        <OnChangePlugin onChange={onChange} />
        <ToolbarPlugin />
        <TreeViewPlugin />
      </LexicalComposer>
    </div>
  );
};

export default CreateNote;
