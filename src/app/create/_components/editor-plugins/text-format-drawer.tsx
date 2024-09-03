import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { $patchStyleText } from "@lexical/selection";
import { useNoteStore } from "@/lib/store/noteeditor";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
} from "lexical";
import {
  ALargeSmall,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CodeXml,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Minus,
  PencilRuler,
  Plus,
  Quote,
  Strikethrough,
  Underline,
  XCircleIcon,
} from "lucide-react";
import React from "react";
import TextColorSelector from "../text-color-selector";
import TextFormats from "./essential-text-format";

type Props = {
  editor: LexicalEditor;
};

const TextFormatDrawer = ({ editor }: Props) => {
  const { currEditorState, updateEditorState } = useNoteStore();

  const { isUnderline, isBold, isItalic, isStrikethrough, isHighlight } =
    currEditorState;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant={"icon"}
          size={"icon"}
          className={`grid h-12 min-w-12 max-w-14 place-items-center hover:rounded-none md:h-10 md:w-12`}
          title="Format Bold"
        >
          <PencilRuler size={18} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex w-full place-items-center justify-between border-b py-2 align-middle dark:border-b-neutral-800">
            <h4 className="text-lg font-semibold">Format</h4>
            <DrawerClose asChild>
              <Button variant={"icon"} size={"icon"}>
                <XCircleIcon size={24} />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="px-4 pb-8">
          <TextFormats editor={editor} />
          <div className="my-2 flex place-items-center justify-between align-middle">
            <div className="flex w-fit overflow-clip rounded bg-violet-100 align-middle dark:bg-neutral-900">
              <Button
                className="h-12 min-w-12 max-w-14 rounded-none"
                variant={"icon"}
                size={"icon"}
              >
                <ALargeSmall size={18} />
              </Button>
              <Button
                className="h-12 min-w-12 max-w-14 rounded-none outline outline-white dark:outline-neutral-800"
                variant={"icon"}
                size={"icon"}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
                }}
              >
                <CodeXml size={18} />
              </Button>
              <Button
                className="h-12 min-w-12 max-w-14 rounded-none"
                variant={"icon"}
                size={"icon"}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
                }}
              >
                <Quote size={18} />
              </Button>
            </div>
          </div>
          <div className="my-2 flex place-items-center justify-between align-middle">
            <div className="flex w-fit overflow-clip rounded bg-violet-100 align-middle dark:bg-neutral-900">
              <Button
                className="h-12 min-w-12 max-w-14 rounded-none"
                variant={"icon"}
                size={"icon"}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                }}
              >
                <AlignLeft size={18} />
              </Button>
              <Button
                className="h-12 min-w-12 max-w-14 rounded-none outline outline-white dark:outline-neutral-800"
                variant={"icon"}
                size={"icon"}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                }}
              >
                <AlignCenter size={18} />
              </Button>
              <Button
                className="h-12 min-w-12 max-w-14 rounded-none"
                variant={"icon"}
                size={"icon"}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                }}
              >
                <AlignRight size={18} />
              </Button>
              <Button
                className="h-12 min-w-12 max-w-14 rounded-none outline outline-white dark:outline-neutral-800"
                variant={"icon"}
                size={"icon"}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
                }}
              >
                <AlignJustify size={18} />
              </Button>
            </div>
            <div className="flex w-fit overflow-clip rounded bg-violet-100 align-middle dark:bg-neutral-900">
              <Button
                className="h-12 min-w-12 max-w-14 rounded-none outline outline-white dark:outline-neutral-800"
                variant={"icon"}
                size={"icon"}
              >
                <IndentIncrease size={18} />
              </Button>
              <Button
                className="h-12 min-w-12 max-w-14 rounded-none"
                variant={"icon"}
                size={"icon"}
              >
                <IndentDecrease size={18} />
              </Button>
            </div>
          </div>

          <div className="flex w-full place-items-center justify-between overflow-clip rounded border-t py-4 pl-4 pr-2 align-middle dark:border-t-neutral-800">
            <h4 className="font-semibold">Text Size</h4>
            <div className="flex place-items-center justify-center align-middle">
              <Button
                className="h-12 w-12 rounded-r-none ring-4 ring-transparent hover:bg-violet-900 hover:ring-violet-200/40 dark:bg-neutral-800"
                variant={"outline"}
                size={"icon"}
              >
                <Minus size={18} />
              </Button>
              <div className="grid h-12 w-12 place-items-center justify-center bg-violet-100 dark:bg-neutral-900/70">
                <h4>12</h4>
              </div>
              <Button
                className="h-12 w-12 rounded-l-none ring-4 ring-transparent hover:bg-violet-900 hover:ring-violet-200/40 dark:bg-neutral-800"
                variant={"outline"}
                size={"icon"}
              >
                <Plus size={18} />
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TextFormatDrawer;
