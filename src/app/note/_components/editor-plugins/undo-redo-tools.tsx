"use client";

import { Button } from "@/components/ui/button";
import {
  EllipsisVertical,
  Loader2,
  MoonIcon,
  Palette,
  Redo,
  Search,
  Share2,
  SunIcon,
  Trash2,
  Undo,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { IoCheckmark, IoChevronBack } from "react-icons/io5";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { api, queryClient } from "@/trpc/react";
import useNotesStore from "@/lib/store/notecontent";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";

const LowPriority = 1;

const UndoRedoTools = ({
  setHasChanges,
  hasChanges,
  noteId,
}: {
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
  noteId: string;
  hasChanges: boolean;
}) => {
  const [editor] = useLexicalComposerContext();

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const router = useRouter();

  const saveNote = api.note.updateNote.useMutation({
    onSuccess: async (res) => {
      if (res.data[0]) {
        useNotesStore
          .getState()
          .updateNote({ editorState: res.data[0]?.editorState });

        setHasChanges(false);
        debounce(() => void queryClient.invalidateQueries(), 1618);
      }
    },
  });

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor]);

  const { setTheme, theme } = useTheme();

  return (
    <div className="sticky top-0 z-[49] flex place-items-center justify-between border-b bg-white px-4 py-2 align-middle dark:border-b-neutral-800 dark:bg-neutral-900">
      <Button
        onClick={async () => {
          await saveNote.mutateAsync({
            noteId,
            updateFields: {
              editorState: JSON.stringify(editor.getEditorState().toJSON()),
            },
          });

          router.back();
        }}
        disabled={saveNote.isPending}
        variant={"icon"}
        size={"icon"}
      >
        <IoChevronBack size={20} />
      </Button>
      <div className="flex place-items-center justify-start gap-2 align-middle">
        <Button
          variant={"icon"}
          size={"icon"}
          disabled={!canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          aria-label="Undo"
          title="Undo"
        >
          <Undo size={20} />
        </Button>
        <Button
          variant={"icon"}
          size={"icon"}
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          aria-label="Redo"
          title="Redo"
        >
          <Redo size={20} />
        </Button>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <EllipsisVertical size={20} />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <div className="flex flex-col place-items-center justify-between gap-2 align-middle">
                <DropdownMenu modal={true}>
                  <DropdownMenuTrigger className="w-full">
                    <Button
                      className={
                        "flex w-full justify-start gap-4 border-none bg-transparent text-black shadow-none hover:bg-violet-200/60 dark:bg-transparent dark:text-white dark:hover:bg-violet-500/20"
                      }
                    >
                      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-violet-800 transition-all dark:-rotate-90 dark:scale-0 dark:text-violet-300" />
                      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 text-violet-800 transition-all dark:rotate-0 dark:scale-100 dark:text-violet-300" />
                      <span className="capitalize">{theme} theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="w-[80dvw] md:w-fit"
                  >
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant={"outline"}
                  title="Share note"
                  className={
                    "flex w-full justify-start gap-4 border-none bg-transparent text-black shadow-none hover:bg-violet-200/60 dark:bg-transparent dark:text-white dark:hover:bg-violet-500/20"
                  }
                >
                  <Share2
                    size={16}
                    className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-violet-800 transition-all dark:text-violet-300"
                  />
                  <h4>Share note</h4>
                </Button>

                <Button
                  variant={"outline"}
                  title="Delete note"
                  className={
                    "flex w-full justify-start gap-4 border-none bg-transparent text-black shadow-none hover:bg-violet-200/60 dark:bg-transparent dark:text-white dark:hover:bg-violet-500/20"
                  }
                >
                  <Trash2
                    size={16}
                    className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-violet-800 transition-all dark:text-violet-300"
                  />
                  <h4>Delete note</h4>
                </Button>
                <Button
                  variant={"outline"}
                  title="Page style"
                  className={
                    "flex w-full justify-start gap-4 border-none bg-transparent text-black shadow-none hover:bg-violet-200/60 dark:bg-transparent dark:text-white dark:hover:bg-violet-500/20"
                  }
                >
                  <Palette
                    size={16}
                    className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-violet-800 transition-all dark:text-violet-300"
                  />
                  <h4>Note style</h4>
                </Button>
                <Button
                  variant={"outline"}
                  title="Find in note"
                  className={
                    "flex w-full justify-start gap-4 border-none bg-transparent text-black shadow-none hover:bg-violet-200/60 dark:bg-transparent dark:text-white dark:hover:bg-violet-500/20"
                  }
                >
                  <Search
                    size={16}
                    className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-violet-800 transition-all dark:text-violet-300"
                  />
                  <h4>Find in note</h4>
                </Button>
              </div>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>

        <Button
          onClick={async () => {
            await saveNote.mutateAsync({
              noteId,
              updateFields: {
                editorState: JSON.stringify(editor.getEditorState().toJSON()),
              },
            });
          }}
          disabled={saveNote.isPending || !hasChanges}
          variant={"outline"}
          className="relative disabled:opacity-30"
          size={"icon"}
        >
          {saveNote.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <IoCheckmark size={16} />
          )}

          {hasChanges && (
            <div className="absolute right-0 top-0 flex h-2.5 w-2.5 place-items-center justify-end rounded-full bg-red-500" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default UndoRedoTools;
