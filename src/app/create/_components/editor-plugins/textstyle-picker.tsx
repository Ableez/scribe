import React, { useState } from "react";
import { ALargeSmall, Check, XCircleIcon } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { LexicalEditor } from "lexical";

type TextStyle = {
  name: string;
  styles: string;
  value: string; // Unique lowercase identifier for the style
};

type Props = {
  editor: LexicalEditor;
};

const textStyles: TextStyle[] = [
  {
    name: "Heading1",
    styles: "text-2xl font-bold text-blue-700 dark:text-blue-700",
    value: "heading1",
  },
  {
    name: "Heading2",
    styles: "text-xl font-bold text-indigo-600 dark:text-indigo-600",
    value: "heading2",
  },
  {
    name: "Heading3",
    styles: "text-lg font-semibold text-purple-600 dark:text-purple-800",
    value: "heading3",
  },
  { name: "Heading4", styles: "text-md font-medium", value: "heading4" },
  {
    name: "Heading5",
    styles: "text-sm font-medium italic text-violet-600 dark:text-violet-500",
    value: "heading5",
  },
  { name: "PageTitle", styles: "text-3xl font-medium", value: "pagetitle" },
  { name: "Serif", styles: "font-serif", value: "serif" },
];

const TextstylePicker = ({ editor }: Props) => {
  const [currentText, setCurrentText] = useState<{
    name: string;
    value: string;
  } | null>();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className={`grid h-12 min-w-12 max-w-14 place-items-center justify-center rounded-none`}
          variant={"icon"}
          size={"icon"}
        >
          <ALargeSmall size={20} />
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
        <div className="max-h-[60dvh] overflow-y-scroll pb-8">
          {textStyles.map((text, index) => (
            <div
              className={`${text.styles} flex place-items-center justify-between px-2 py-3 align-middle transition-all duration-100 ease-in hover:bg-violet-100 hover:pl-3 dark:hover:bg-violet-400/10`}
              onClick={() => setCurrentText(text)}
            >
              <h4>{text.name}</h4>
              {currentText?.value === text.value && (
                <Check className="text-black dark:text-white" size={16} />
              )}
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TextstylePicker;
