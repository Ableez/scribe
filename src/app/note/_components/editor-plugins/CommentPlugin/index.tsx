/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Provider } from "@lexical/yjs";
import type {
  EditorState,
  LexicalCommand,
  LexicalEditor,
  NodeKey,
  RangeSelection,
} from "lexical";
import type { Doc } from "yjs";

import {
  $createMarkNode,
  $getMarkIDs,
  $isMarkNode,
  $unwrapMarkNode,
  $wrapSelectionInMarkNode,
  MarkNode,
} from "@lexical/mark";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { useCollaborationContext } from "@lexical/react/LexicalCollaborationContext";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { createDOMRange, createRectsFromDOMRange } from "@lexical/selection";
import { $isRootTextContentEmpty, $rootTextContent } from "@lexical/text";
import { mergeRegister, registerNestedElementResolver } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  CLEAR_EDITOR_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  KEY_ESCAPE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as React from "react";
import { createPortal } from "react-dom";
import CommentEditorTheme from "./CommentEditorTheme";

import {
  type Comment,
  type Comments,
  CommentStore,
  createComment,
  createThread,
  type Thread,
  useCommentStore,
} from "./commenting/index";
import LexicalContentEditable from "./ContentEditable";
import { Button } from "@/components/ui/button";
import useModal from "./useModal";
import type { WebsocketProvider } from "y-websocket";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IoChatbubble } from "react-icons/io5";
import { Quote, SendHorizonal, Trash, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const INSERT_INLINE_COMMAND: LexicalCommand<void> = createCommand(
  "INSERT_INLINE_COMMAND",
);

function AddCommentBox({
  anchorKey,
  editor,
  onAddComment,
}: {
  anchorKey: NodeKey;
  editor: LexicalEditor;
  onAddComment: () => void;
}): JSX.Element {
  const boxRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const boxElem = boxRef.current;
    const rootElement = editor.getRootElement();
    const anchorElement = editor.getElementByKey(anchorKey);

    if (boxElem !== null && rootElement !== null && anchorElement !== null) {
      const { right } = rootElement.getBoundingClientRect();
      const { top } = anchorElement.getBoundingClientRect();
      boxElem.style.left = `${right - 20}px`;
      boxElem.style.top = `${top - 30}px`;
    }
  }, [anchorKey, editor]);

  useEffect(() => {
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [editor, updatePosition]);

  React.useLayoutEffect(() => {
    updatePosition();
  }, [anchorKey, editor, updatePosition]);

  return (
    <div className="CommentPlugin_AddCommentBox" ref={boxRef}>
      <button
        className="CommentPlugin_AddCommentBox_button"
        onClick={onAddComment}
      >
        <i className="icon add-comment" />
      </button>
    </div>
  );
}

function EscapeHandlerPlugin({
  onEscape,
}: {
  onEscape: (e: KeyboardEvent) => boolean;
}): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      (event: KeyboardEvent) => {
        return onEscape(event);
      },
      2,
    );
  }, [editor, onEscape]);

  return null;
}

function PlainTextEditor({
  className,
  autoFocus,
  onEscape,
  onChange,
  editorRef,
  placeholder = "Type a comment...",
}: {
  autoFocus?: boolean;
  className?: string;
  editorRef?: { current: null | LexicalEditor };
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
  onEscape: (e: KeyboardEvent) => boolean;
  placeholder?: string;
}) {
  const initialConfig = {
    namespace: "Commenting",
    nodes: [],
    onError: (error: Error) => {
      throw error;
    },
    theme: CommentEditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="CommentPlugin_CommentInputBox_EditorContainer">
        <PlainTextPlugin
          contentEditable={
            <LexicalContentEditable
              placeholder={placeholder}
              className={className}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        {autoFocus !== false && <AutoFocusPlugin />}
        <EscapeHandlerPlugin onEscape={onEscape} />
        <ClearEditorPlugin />
        {editorRef !== undefined && <EditorRefPlugin editorRef={editorRef} />}
      </div>
    </LexicalComposer>
  );
}

function useOnChange(
  setContent: (text: string) => void,
  setCanSubmit: (canSubmit: boolean) => void,
) {
  return useCallback(
    (editorState: EditorState, _editor: LexicalEditor) => {
      editorState.read(() => {
        setContent($rootTextContent());
        setCanSubmit(!$isRootTextContentEmpty(_editor.isComposing(), true));
      });
    },
    [setCanSubmit, setContent],
  );
}

function CommentInputBox({
  editor,
  cancelAddComment,
  submitAddComment,
}: {
  cancelAddComment: () => void;
  editor: LexicalEditor;
  submitAddComment: (
    commentOrThread: Comment | Thread,
    isInlineComment: boolean,
    thread?: Thread,
    selection?: RangeSelection | null,
  ) => void;
}) {
  const [content, setContent] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const selectionState = useMemo(
    () => ({
      container: document.createElement("div"),
      elements: [],
    }),
    [],
  );
  const selectionRef = useRef<RangeSelection | null>(null);
  const author = useCollabAuthorName();

  const updateLocation = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        selectionRef.current = selection.clone();
        const anchor = selection.anchor;
        const focus = selection.focus;
        const range = createDOMRange(
          editor,
          anchor.getNode(),
          anchor.offset,
          focus.getNode(),
          focus.offset,
        );
        const boxElem = boxRef.current;
        if (range !== null && boxElem !== null) {
          const { left, bottom, width } = range.getBoundingClientRect();
          const selectionRects = createRectsFromDOMRange(editor, range);
          let correctedLeft =
            selectionRects.length === 1 ? left + width / 2 - 125 : left - 125;
          if (correctedLeft < 10) {
            correctedLeft = 10;
          }
          boxElem.style.left = `${correctedLeft}px`;
          boxElem.style.top = `${
            bottom +
            20 +
            (window.pageYOffset || document.documentElement.scrollTop)
          }px`;
          const selectionRectsLength = selectionRects.length;
          const { container } = selectionState;
          const elements: Array<HTMLSpanElement> = selectionState.elements;
          const elementsLength = elements.length;

          for (let i = 0; i < selectionRectsLength; i++) {
            const selectionRect = selectionRects[i];
            let elem = elements[i]!;
            if (elem === undefined) {
              elem = document.createElement("span");
              elements[i] = elem;
              container.appendChild(elem);
            }
            const color = "255, 212, 0";
            const style = `position:absolute;top:${
              selectionRect!.top +
              (window.scrollY || document.documentElement.scrollTop)
            }px;left:${selectionRect?.left}px;height:${
              selectionRect?.height
            }px;width:${
              selectionRect?.width
            }px;background-color:rgba(${color}, 0.3);pointer-events:none;z-index:5;`;
            elem.style.cssText = style;
          }
          for (let i = elementsLength - 1; i >= selectionRectsLength; i--) {
            const elem = elements[i];
            container.removeChild(elem!);
            elements.pop();
          }
        }
      }
    });
  }, [editor, selectionState]);

  React.useLayoutEffect(() => {
    updateLocation();
    const container = selectionState.container;
    const body = document.body;
    if (body !== null) {
      body.appendChild(container);
      return () => {
        body.removeChild(container);
      };
    }
  }, [selectionState.container, updateLocation]);

  useEffect(() => {
    window.addEventListener("resize", updateLocation);

    return () => {
      window.removeEventListener("resize", updateLocation);
    };
  }, [updateLocation]);

  const onEscape = (event: KeyboardEvent): boolean => {
    event.preventDefault();
    cancelAddComment();
    return true;
  };

  const submitComment = () => {
    if (canSubmit) {
      let quote = editor.getEditorState().read(() => {
        const selection = selectionRef.current;
        return selection ? selection.getTextContent() : "";
      });
      if (quote.length > 100) {
        quote = quote.slice(0, 99) + "…";
      }
      submitAddComment(
        createThread(quote, [createComment(content, author)]),
        true,
        undefined,
        selectionRef.current,
      );
      selectionRef.current = null;
    }
  };

  const onChange = useOnChange(setContent, setCanSubmit);

  return (
    <div className="CommentPlugin_CommentInputBox" ref={boxRef}>
      <PlainTextEditor
        className="CommentPlugin_CommentInputBox_Editor"
        onEscape={onEscape}
        onChange={onChange}
      />
      <div className="CommentPlugin_CommentInputBox_Buttons">
        <Button
          onClick={cancelAddComment}
          className="CommentPlugin_CommentInputBox_Button"
        >
          Cancel
        </Button>
        <Button
          onClick={submitComment}
          disabled={!canSubmit}
          className="CommentPlugin_CommentInputBox_Button primary"
        >
          Comment
        </Button>
      </div>
    </div>
  );
}

function CommentsComposer({
  submitAddComment,
  thread,
}: {
  placeholder?: string;
  submitAddComment: (
    commentOrThread: Comment,
    isInlineComment: boolean,
    // eslint-disable-next-line no-shadow
    thread?: Thread,
  ) => void;
  thread?: Thread;
}) {
  const [content, setContent] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const editorRef = useRef<LexicalEditor>(null);
  const author = useCollabAuthorName();

  const onChange = useOnChange(setContent, setCanSubmit);

  const submitComment = () => {
    if (canSubmit) {
      submitAddComment(createComment(content, author), false, thread);
      const editor = editorRef.current;
      if (editor !== null) {
        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      }
    }
  };

  return (
    <div className="flex w-full place-items-center justify-between align-middle">
      <PlainTextEditor
        className="min-h-10 w-48 rounded-md bg-neutral-200/60 py-2.5 pl-2 text-sm text-neutral-600 focus:outline-none"
        autoFocus={false}
        onEscape={() => {
          return true;
        }}
        onChange={onChange}
        editorRef={editorRef}
        placeholder={"reply"}
      />
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={submitComment}
        disabled={!canSubmit}
      >
        <SendHorizonal size={16} />
      </Button>
    </div>
  );
}

function ShowDeleteCommentOrThreadDialog({
  commentOrThread,
  deleteCommentOrThread,
  onClose,
  thread = undefined,
}: {
  commentOrThread: Comment | Thread;

  deleteCommentOrThread: (
    comment: Comment | Thread,
    // eslint-disable-next-line no-shadow
    thread?: Thread,
  ) => void;
  onClose: () => void;
  thread?: Thread;
}): JSX.Element {
  return (
    <>
      Are you sure you want to delete this {commentOrThread.type}?
      <div className="Modal__content">
        <Button
          onClick={() => {
            deleteCommentOrThread(commentOrThread, thread);
            onClose();
          }}
        >
          Delete
        </Button>
        <Button
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>
      </div>
    </>
  );
}

function CommentsPanelListComment({
  comment,
  deleteComment,
  thread,
  rtf,
}: {
  comment: Comment;
  deleteComment: (
    commentOrThread: Comment | Thread,
    // eslint-disable-next-line no-shadow
    thread?: Thread,
  ) => void;
  rtf: Intl.RelativeTimeFormat;
  thread?: Thread;
}): JSX.Element {
  const seconds = Math.round(
    (comment.timeStamp - (performance.timeOrigin + performance.now())) / 1000,
  );
  const minutes = Math.round(seconds / 60);
  const [_modal, showModal] = useModal();

  return (
    <li className="relative">
      <div className="mt-4">
        <span className="mr-2 text-xs font-semibold">{comment.author}</span>
        <span className="text-xs">
          · {seconds > -10 ? "Just now" : rtf.format(minutes, "minutes")}
        </span>
      </div>
      <p
        className={`text-sm text-neutral-500 ${comment.deleted ? "mt-1" : ""}`}
      >
        {comment.content}
      </p>
      {!comment.deleted && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="absolute right-0 top-0 h-8 w-8 border-none bg-violet-200 outline-none dark:bg-neutral-900"
              onClick={() => {
                showModal("Delete Comment", (onClose) => (
                  <ShowDeleteCommentOrThreadDialog
                    commentOrThread={comment}
                    deleteCommentOrThread={deleteComment}
                    thread={thread}
                    onClose={onClose}
                  />
                ));
              }}
              variant={"outline"}
              size={"icon"}
            >
              <Trash size={14} />
            </Button>
          </DialogTrigger>
          <DialogContent className="mx-auto max-w-[98dvw] rounded-2xl">
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete?</DialogTitle>
            </DialogHeader>
            <div className="flex w-full place-items-center justify-between gap-2 align-middle">
              <DialogClose asChild>
                <Button className="w-full" variant={"outline"}>
                  Close
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    deleteComment(comment ?? thread);
                  }}
                  className="w-full border-red-500 hover:bg-red-200 dark:hover:bg-red-400/10"
                  variant={"outline"}
                >
                  Delete
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </li>
  );
}

function CommentsPanelList({
  activeIDs,
  comments,
  deleteCommentOrThread,
  divRef,
  submitAddComment,
  markNodeMap,
}: {
  activeIDs: Array<string>;
  comments: Comments;
  deleteCommentOrThread: (
    commentOrThread: Comment | Thread,
    thread?: Thread,
  ) => void;
  divRef: { current: null | HTMLDivElement };
  markNodeMap: Map<string, Set<NodeKey>>;
  submitAddComment: (
    commentOrThread: Comment | Thread,
    isInlineComment: boolean,
    thread?: Thread,
  ) => void;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [counter, setCounter] = useState(0);
  const [modal, showModal] = useModal();
  const rtf = useMemo(
    () =>
      new Intl.RelativeTimeFormat("en", {
        localeMatcher: "best fit",
        numeric: "auto",
        style: "short",
      }),
    [],
  );

  useEffect(() => {
    // Used to keep the time stamp up to date
    const id = setTimeout(() => {
      setCounter(counter + 1);
    }, 10000);

    return () => {
      clearTimeout(id);
    };
  }, [counter]);

  return (
    <div ref={divRef}>
      {comments.map((commentOrThread) => {
        const id = commentOrThread.id;
        if (commentOrThread.type === "thread") {
          const handleClickThread = () => {
            const markNodeKeys = markNodeMap.get(id);
            if (markNodeKeys !== undefined && !activeIDs?.includes(id)) {
              const activeElement = document.activeElement;
              // Move selection to the start of the mark, so that we
              // update the UI with the selected thread.
              editor.update(
                () => {
                  const markNodeKey = Array.from(markNodeKeys)[0];
                  const markNode = $getNodeByKey<MarkNode>(markNodeKey!);
                  if ($isMarkNode(markNode)) {
                    markNode.selectStart();
                  }
                },
                {
                  onUpdate() {
                    // Restore selection to the previous element
                    if (activeElement !== null) {
                      (activeElement as HTMLElement).focus();
                    }
                  },
                },
              );
            }
          };

          return (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <li
              key={id}
              onClick={handleClickThread}
              className={`${
                markNodeMap.has(id) ? "interactive" : ""
              } ${!activeIDs.includes(id) ? "" : "active"} list-none`}
            >
              <div className="flex place-items-center justify-between align-middle">
                <div className="flex place-items-center justify-start gap-2 align-middle">
                  <Quote size={16} />
                  <span>{commentOrThread.quote}</span>
                </div>
                {/* INTRODUCE DELETE THREAD HERE*/}
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => {
                    showModal("Delete Thread", (onClose) => (
                      <ShowDeleteCommentOrThreadDialog
                        commentOrThread={commentOrThread}
                        deleteCommentOrThread={deleteCommentOrThread}
                        onClose={onClose}
                      />
                    ));
                  }}
                >
                  <TrashIcon size={16} />
                </Button>
                {modal}
              </div>
              <ul className="CommentPlugin_CommentsPanel_List_Thread_Comments">
                {commentOrThread.comments.map((comment) => (
                  <CommentsPanelListComment
                    key={comment.id}
                    comment={comment}
                    deleteComment={deleteCommentOrThread}
                    thread={commentOrThread}
                    rtf={rtf}
                  />
                ))}
              </ul>
              <div className="CommentPlugin_CommentsPanel_List_Thread_Editor">
                <CommentsComposer
                  submitAddComment={submitAddComment}
                  thread={commentOrThread}
                  placeholder="Reply to comment..."
                />
              </div>
            </li>
          );
        }
        return (
          <CommentsPanelListComment
            key={id}
            comment={commentOrThread}
            deleteComment={deleteCommentOrThread}
            rtf={rtf}
          />
        );
      })}
    </div>
  );
}

function CommentsPanel({
  activeIDs,
  deleteCommentOrThread,
  comments,
  submitAddComment,
  markNodeMap,
  setShowComments,
  showComments,
}: {
  showComments: boolean;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
  activeIDs: Array<string>;
  comments: Comments;
  deleteCommentOrThread: (
    commentOrThread: Comment | Thread,
    thread?: Thread,
  ) => void;
  markNodeMap: Map<string, Set<NodeKey>>;
  submitAddComment: (
    commentOrThread: Comment | Thread,
    isInlineComment: boolean,
    thread?: Thread,
  ) => void;
}): JSX.Element {
  const divRef = useRef<HTMLDivElement>(null);
  const isEmpty = comments.length === 0;

  return (
    <Sheet onOpenChange={setShowComments} open={showComments}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="absolute right-1/2 top-2 z-[49] -translate-x-1/2"
          size={"icon"}
        >
          <IoChatbubble />
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>
        {isEmpty ? (
          <div className="CommentPlugin_CommentsPanel_Empty">No Comments</div>
        ) : (
          <CommentsPanelList
            activeIDs={activeIDs}
            comments={comments}
            deleteCommentOrThread={deleteCommentOrThread}
            divRef={divRef}
            submitAddComment={submitAddComment}
            markNodeMap={markNodeMap}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function useCollabAuthorName(): string {
  const collabContext = useCollaborationContext();
  const { yjsDocMap, name } = collabContext;
  return yjsDocMap.has("comments") ? name : "Playground User";
}

export default function CommentPlugin({
  providerFactory,
}: {
  providerFactory?: (
    id: string,
    yjsDocMap: Map<string, Doc>,
  ) => WebsocketProvider;
}): JSX.Element {
  const collabContext = useCollaborationContext();
  const [editor] = useLexicalComposerContext();
  const commentStore = useMemo(() => new CommentStore(editor), [editor]);
  const comments = useCommentStore(commentStore);
  const markNodeMap = useMemo<Map<string, Set<NodeKey>>>(() => {
    return new Map();
  }, []);
  const [activeAnchorKey, setActiveAnchorKey] = useState<NodeKey | null>();
  const [activeIDs, setActiveIDs] = useState<Array<string>>([]);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { yjsDocMap } = collabContext;

  useEffect(() => {
    if (providerFactory) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const provider = providerFactory("comments", yjsDocMap);
      return commentStore.registerCollaboration(
        provider as unknown as Provider,
      );
    }
  }, [commentStore, providerFactory, yjsDocMap]);

  const cancelAddComment = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      // Restore selection
      if (selection !== null) {
        selection.dirty = true;
      }
    });
    setShowCommentInput(false);
  }, [editor]);

  const deleteCommentOrThread = useCallback(
    (comment: Comment | Thread, thread?: Thread) => {
      if (comment.type === "comment") {
        const deletionInfo = commentStore.deleteCommentOrThread(
          comment,
          thread,
        );
        if (!deletionInfo) {
          return;
        }
        const { markedComment, index } = deletionInfo;
        commentStore.addComment(markedComment, thread, index);
      } else {
        commentStore.deleteCommentOrThread(comment);
        // Remove ids from associated marks
        const id = thread !== undefined ? thread.id : comment.id;
        const markNodeKeys = markNodeMap.get(id);
        if (markNodeKeys !== undefined) {
          // Do async to avoid causing a React infinite loop
          setTimeout(() => {
            editor.update(() => {
              for (const key of markNodeKeys) {
                const node: null | MarkNode = $getNodeByKey(key);
                if ($isMarkNode(node)) {
                  node.deleteID(id);
                  if (node.getIDs().length === 0) {
                    $unwrapMarkNode(node);
                  }
                }
              }
            });
          });
        }
      }
    },
    [commentStore, editor, markNodeMap],
  );

  const submitAddComment = useCallback(
    (
      commentOrThread: Comment | Thread,
      isInlineComment: boolean,
      thread?: Thread,
      selection?: RangeSelection | null,
    ) => {
      commentStore.addComment(commentOrThread, thread);
      if (isInlineComment) {
        editor.update(() => {
          if ($isRangeSelection(selection)) {
            const isBackward = selection.isBackward();
            const id = commentOrThread.id;

            // Wrap content in a MarkNode
            $wrapSelectionInMarkNode(selection, isBackward, id);
          }
        });
        setShowCommentInput(false);
      }
    },
    [commentStore, editor],
  );

  useEffect(() => {
    const changedElems: Array<HTMLElement> = [];

    for (const id of activeIDs) {
      const keys = markNodeMap.get(id);
      if (keys !== undefined) {
        for (const key of keys) {
          const elem = editor.getElementByKey(key);
          if (elem !== null) {
            elem.classList.add("selected");
            changedElems.push(elem);
            setShowComments(true);
          }
        }
      }
    }
    return () => {
      for (const changedElem of changedElems) {
        changedElem.classList.remove("selected");
      }
    };
  }, [activeIDs, editor, markNodeMap]);

  useEffect(() => {
    const markNodeKeysToIDs = new Map<NodeKey, Array<string>>();

    return mergeRegister(
      registerNestedElementResolver<MarkNode>(
        editor,
        MarkNode,
        (from: MarkNode) => {
          return $createMarkNode(from.getIDs());
        },
        (from: MarkNode, to: MarkNode) => {
          // Merge the IDs
          const ids = from.getIDs();
          ids.forEach((id) => {
            to.addID(id);
          });
        },
      ),
      editor.registerMutationListener(
        MarkNode,
        (mutations) => {
          editor.getEditorState().read(() => {
            for (const [key, mutation] of mutations) {
              const node: null | MarkNode = $getNodeByKey(key);
              let ids: NodeKey[] = [];

              if (mutation === "destroyed") {
                ids = markNodeKeysToIDs.get(key) ?? [];
              } else if ($isMarkNode(node)) {
                ids = node.getIDs();
              }

              for (const id of ids) {
                let markNodeKeys = markNodeMap.get(id);
                markNodeKeysToIDs.set(key, ids);

                if (mutation === "destroyed") {
                  if (markNodeKeys !== undefined) {
                    markNodeKeys.delete(key);
                    if (markNodeKeys.size === 0) {
                      markNodeMap.delete(id);
                    }
                  }
                } else {
                  if (markNodeKeys === undefined) {
                    markNodeKeys = new Set();
                    markNodeMap.set(id, markNodeKeys);
                  }
                  if (!markNodeKeys.has(key)) {
                    markNodeKeys.add(key);
                  }
                }
              }
            }
          });
        },
        { skipInitialization: false },
      ),
      editor.registerUpdateListener(({ editorState, tags }) => {
        editorState.read(() => {
          const selection = $getSelection();
          let hasActiveIds = false;
          let hasAnchorKey = false;

          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();

            if ($isTextNode(anchorNode)) {
              const commentIDs = $getMarkIDs(
                anchorNode,
                selection.anchor.offset,
              );
              if (commentIDs !== null) {
                setActiveIDs(commentIDs);
                hasActiveIds = true;
              }
              if (!selection.isCollapsed()) {
                setActiveAnchorKey(anchorNode.getKey());
                hasAnchorKey = true;
              }
            }
          }
          if (!hasActiveIds) {
            setActiveIDs((_activeIds) =>
              _activeIds.length === 0 ? _activeIds : [],
            );
          }
          if (!hasAnchorKey) {
            setActiveAnchorKey(null);
          }
          if (!tags.has("collaboration") && $isRangeSelection(selection)) {
            setShowCommentInput(false);
          }
        });
      }),
      editor.registerCommand(
        INSERT_INLINE_COMMAND,
        () => {
          const domSelection = window.getSelection();
          if (domSelection !== null) {
            domSelection.removeAllRanges();
          }
          setShowCommentInput(true);
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor, markNodeMap]);

  const onAddComment = () => {
    editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
  };

  return (
    <>
      {showCommentInput &&
        createPortal(
          <CommentInputBox
            editor={editor}
            cancelAddComment={cancelAddComment}
            submitAddComment={submitAddComment}
          />,
          document.body,
        )}
      {activeAnchorKey !== null &&
        activeAnchorKey !== undefined &&
        !showCommentInput &&
        createPortal(
          <AddCommentBox
            anchorKey={activeAnchorKey}
            editor={editor}
            onAddComment={onAddComment}
          />,
          document.body,
        )}
      {createPortal(
        <Button
          className={`CommentPlugin_ShowCommentsButton ${
            showComments ? "active" : ""
          }`}
          onClick={() => setShowComments(!showComments)}
          title={showComments ? "Hide Comments" : "Show Comments"}
        >
          <i className="comments" />
        </Button>,
        document.body,
      )}

      {createPortal(
        <CommentsPanel
          comments={comments}
          submitAddComment={submitAddComment}
          deleteCommentOrThread={deleteCommentOrThread}
          activeIDs={activeIDs}
          markNodeMap={markNodeMap}
          showComments={showComments}
          setShowComments={setShowComments}
        />,
        document.body,
      )}
    </>
  );
}
