import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useNoteStore } from "@/lib/store/noteeditor";
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
  Heading4,
  Heading5,
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

const pastelColors: { name: string; hex: string }[] = [
  { name: "Black", hex: "#333333" },
  { name: "Dusty Rose", hex: "#D08C8C" },
  { name: "Pale Turquoise", hex: "#76C7C0" },
  { name: "Soft Lilac", hex: "#B299D6" },
  { name: "Pale Goldenrod", hex: "#E8D86E" },
  { name: "Muted Coral", hex: "#E39477" },
  { name: "Cool Mint", hex: "#70BFA1" },
  { name: "Mauve", hex: "#936D8E" },
  { name: "Slate Blue", hex: "#6A77D1" },
  { name: "Golden Sand", hex: "#D1A767" },
  { name: "Cocoa Brown", hex: "#9A7164" },
  { name: "Seafoam Green", hex: "#63C7B2" },
  { name: "Warm Lavender", hex: "#A883BF" },
  { name: "Peachy Orange", hex: "#E1A165" },
  { name: "Olive Drab", hex: "#8C9440" },
  { name: "Steel Blue", hex: "#5A7AA3" },
];

type Props = {
  editor: LexicalEditor;
};

const TextFormatDrawer = ({ editor }: Props) => {
  const { currEditorState, updateEditorState } = useNoteStore();

  const { isUnderline, isBold, isItalic, isStrikethrough } = currEditorState;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant={"icon"}
          size={"icon"}
          className={`h-12 w-12`}
          title="Format Bold"
        >
          <PencilRuler size={18} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex w-full place-items-center justify-between border-b py-2 align-middle">
            <h4 className="text-lg font-semibold">Format</h4>
            <DrawerClose asChild>
              <Button variant={"icon"} size={"icon"}>
                <XCircleIcon size={24} />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="px-4 pb-8">
          <div className="flex place-items-center justify-between align-middle">
            <div className="flex w-fit overflow-clip rounded bg-violet-100 align-middle">
              <Button
                className={`${isBold ? "bg-violet-200 text-violet-700" : ""} h-10 w-12 rounded-none`}
                variant={"icon"}
                size={"icon"}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                }}
              >
                <Bold strokeWidth={4.618} size={18} />
              </Button>
              <Button
                className={`${isItalic ? "bg-violet-200 text-violet-700" : ""} h-10 w-12 rounded-none outline outline-white`}
                variant={"icon"}
                size={"icon"}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                  if (isItalic) {
                    updateEditorState({ isItalic: false });
                  } else {
                    updateEditorState({ isItalic: true });
                  }
                }}
              >
                <Italic size={18} />
              </Button>

              <Button
                className={`${
                  isUnderline ? "bg-violet-200 text-violet-700" : ""
                } h-10 w-12 rounded-none`}
                variant={"icon"}
                size={"icon"}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");

                  if (isStrikethrough) {
                    updateEditorState({
                      isUnderline: false,
                      isStrikethrough: false,
                    });
                  } else {
                    updateEditorState({
                      isUnderline: false,
                      isStrikethrough: false,
                    });
                  }
                }}
              >
                <Underline size={18} />
              </Button>
              <Button
                className={`${
                  isStrikethrough ? "bg-violet-200 text-violet-700" : ""
                } h-10 w-12 rounded-none`}
                variant={"icon"}
                size={"icon"}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                  if (isUnderline) {
                    updateEditorState({
                      isStrikethrough: true,
                      isUnderline: false,
                    });
                  } else {
                    updateEditorState({
                      isStrikethrough: false,
                      isUnderline: false,
                    });
                  }
                }}
              >
                <Strikethrough size={18} />
              </Button>
            </div>
            <div className="flex w-fit overflow-clip rounded bg-violet-100 align-middle">
              <TextColorSelector />
              <Button
                className="h-12 w-14 rounded-none outline outline-white"
                variant={"icon"}
                size={"icon"}
              >
                <Highlighter size={18} />
              </Button>
            </div>
          </div>
          <div className="my-2 flex place-items-center justify-between align-middle">
            <div className="flex w-fit overflow-clip rounded bg-violet-100 align-middle">
              <Button
                className="h-12 w-14 rounded-none"
                variant={"icon"}
                size={"icon"}
              >
                <ALargeSmall size={18} />
              </Button>
              <Button
                className="h-12 w-14 rounded-none outline outline-white"
                variant={"icon"}
                size={"icon"}
              >
                <CodeXml size={18} />
              </Button>
              <Button
                className="h-12 w-14 rounded-none"
                variant={"icon"}
                size={"icon"}
              >
                <Quote size={18} />
              </Button>
            </div>
            <div className="flex w-fit overflow-clip rounded bg-violet-100 align-middle">
              <Button
                className="h-12 w-14 rounded-none"
                variant={"icon"}
                size={"icon"}
              >
                <Heading1 size={18} />
              </Button>
              <Button
                className="h-12 w-14 rounded-none outline outline-white"
                variant={"icon"}
                size={"icon"}
              >
                <Heading2 size={18} />
              </Button>
              <Button
                className="h-12 w-14 rounded-none"
                variant={"icon"}
                size={"icon"}
              >
                <Heading3 size={18} />
              </Button>
            </div>
          </div>
          <div className="my-2 flex place-items-center justify-between align-middle">
            <div className="flex w-fit overflow-clip rounded bg-violet-100 align-middle">
              <Button
                className="h-12 w-14 rounded-none"
                variant={"icon"}
                size={"icon"}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                }}
              >
                <AlignLeft size={18} />
              </Button>
              <Button
                className="h-12 w-14 rounded-none outline outline-white"
                variant={"icon"}
                size={"icon"}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                }}
              >
                <AlignCenter size={18} />
              </Button>
              <Button
                className="h-12 w-14 rounded-none"
                variant={"icon"}
                size={"icon"}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                }}
              >
                <AlignRight size={18} />
              </Button>
              <Button
                className="h-12 w-14 rounded-none outline outline-white"
                variant={"icon"}
                size={"icon"}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
                }}
              >
                <AlignJustify size={18} />
              </Button>
            </div>
            <div className="flex w-fit overflow-clip rounded bg-violet-100 align-middle">
              <Button
                className="h-12 w-14 rounded-none outline outline-white"
                variant={"icon"}
                size={"icon"}
              >
                <IndentIncrease size={18} />
              </Button>
              <Button
                className="h-12 w-14 rounded-none outline outline-white"
                variant={"icon"}
                size={"icon"}
              >
                <IndentDecrease size={18} />
              </Button>
            </div>
          </div>
          <div className="my-2 flex place-items-center justify-between align-middle">
            <div className="flex w-fit overflow-clip rounded bg-violet-100 align-middle">
              <Button
                className="h-12 w-14 rounded-none"
                variant={"icon"}
                size={"icon"}
              >
                <AlignLeft size={18} />
              </Button>
              <Button
                className="h-12 w-14 rounded-none outline outline-white"
                variant={"icon"}
                size={"icon"}
              >
                <AlignCenter size={18} />
              </Button>
              <Button
                className="h-12 w-14 rounded-none"
                variant={"icon"}
                size={"icon"}
              >
                <AlignRight size={18} />
              </Button>
              <Button
                className="h-12 w-14 rounded-none outline outline-white"
                variant={"icon"}
                size={"icon"}
              >
                <AlignJustify size={18} />
              </Button>
            </div>
          </div>
          <div className="flex w-full place-items-center justify-between overflow-clip rounded border-t py-4 pl-4 pr-2 align-middle">
            <h4 className="font-semibold">Text Size</h4>
            <div className="flex place-items-center justify-center align-middle">
              <Button
                className="h-12 w-12 rounded-r-none ring-4 ring-transparent hover:bg-violet-100 hover:ring-violet-200/40"
                variant={"outline"}
                size={"icon"}
              >
                <Minus size={18} />
              </Button>
              <div className="grid h-12 w-12 place-items-center justify-center bg-violet-100/70">
                <h4>12</h4>
              </div>
              <Button
                className="h-12 w-12 rounded-l-none ring-4 ring-transparent hover:bg-violet-100 hover:ring-violet-200/40"
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

const TextColorSelector = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className="flex h-12 w-14 flex-col place-items-center justify-center rounded-none align-middle"
          variant={"icon"}
          size={"icon"}
        >
          <h4>A</h4>
          <span className="h-1 w-3 rounded-[2px] bg-red-500 ring-2 ring-black" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex w-full place-items-center justify-between border-b py-2 align-middle">
            <h4 className="text-lg font-semibold">Text Color</h4>
            <DrawerClose asChild>
              <Button variant={"icon"} size={"icon"}>
                <XCircleIcon size={24} />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="flex flex-wrap place-items-center gap-5 px-4 pb-8 align-middle">
          {pastelColors.map((cl, idx) => (
            <DrawerClose key={cl.hex}>
              <div
                title={cl.name}
                className={
                  "h-12 w-10 cursor-pointer rounded-full ring-4 ring-transparent transition-all duration-150 ease-in hover:scale-[1.06] hover:ring-violet-100"
                }
                style={{ backgroundColor: cl.hex }}
              />
            </DrawerClose>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
