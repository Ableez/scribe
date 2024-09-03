import { LexicalEditor } from "lexical";
import { XCircleIcon } from "lucide-react";
import { useCallback } from "react";
import { $patchStyleText } from "@lexical/selection";
import { $getSelection } from "lexical";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";

type TextColorProps = {
  editor: LexicalEditor;
};

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

const TextColorSelector = ({ editor }: TextColorProps) => {
  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      editor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? { tag: "historic" } : {},
      );
    },
    [editor],
  );

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ "background-color": value }, skipHistoryStack);
    },
    [applyStyleText],
  );

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
              <button
                onClick={() => {
                  onBgColorSelect(cl.hex, false);
                }}
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

export default TextColorSelector;
