"use client";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { HORIZONTAL_RULE } from "../../_components/editor-plugins/horizontal-rule";

const HorizontalRule = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        HORIZONTAL_RULE,
        (payload) => {
          console.log(payload);
          return false;
        },
        1,
      ),
    );
  }, [editor]);

  return null;
};

export default HorizontalRule;
