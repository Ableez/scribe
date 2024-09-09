"use client";

import { Button } from "@/components/ui/button";
import {
  EllipsisVertical,
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
import { IoChevronBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
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

const LowPriority = 1;

const UndoRedoTools = () => {
  const [editor] = useLexicalComposerContext();

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const router = useRouter();

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
      <Button onClick={() => router.back()} variant={"icon"} size={"icon"}>
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
      </div>
    </div>
  );
};

export default UndoRedoTools;
