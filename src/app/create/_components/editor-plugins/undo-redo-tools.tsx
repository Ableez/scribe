"use client";

import { Button } from "@/components/ui/button";
import {
  EllipsisVertical,
  Palette,
  Redo,
  Search,
  Share2,
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

type Props = {};

const LowPriority = 1;

const UndoRedoTools = (props: Props) => {
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
              <div className="flex place-items-center justify-between gap-2 align-middle">
                <Button title="Share note" className="h-12 w-12" size={"icon"}>
                  <Share2 size={20} />
                </Button>
                <Button title="Delete note" className="h-12 w-12" size={"icon"}>
                  <Trash2 size={20} />
                </Button>
                <Button title="Page style" className="h-12 w-12" size={"icon"}>
                  <Palette size={20} />
                </Button>
                <Button
                  title="Find in note"
                  className="h-12 w-12"
                  size={"icon"}
                >
                  <Search size={20} />
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
