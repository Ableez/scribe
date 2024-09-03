import { cn } from "@/lib/utils";

export default {
  code: cn("font-mono text-amber-700 font-medium rounded p-1 bg-amber-100"),
  heading: {
    h1: cn("editor-heading-h1"),
    h2: cn("editor-heading-h2"),
    h3: cn("editor-heading-h3"),
    h4: cn("editor-heading-h4"),
    h5: cn("editor-heading-h5"),
  },
  image: cn("editor-image"),
  link: cn("editor-link"),
  list: {
    listitem: cn("editor-listitem"),
    nested: {
      listitem: cn("editor-nested-listitem"),
    },
    ol: cn("editor-list-ol"),
    ul: cn("editor-list-ul"),
  },
  ltr: cn("ltr"),
  paragraph: cn("text-sm hhlnh pr-2 pl-6"),
  placeholder: cn("editor-placeholder"),
  quote: cn("editor-quote"),
  rtl: cn("rtl"),
  text: {
    bold: cn("font-bold"),
    code: cn("font-mono text-amber-800 py-1 px-2 bg-amber-800/10 rounded-sm"),
    hashtag: cn("editor-text-hashtag"),
    italic: cn("editor-text-italic"),
    overflowed: cn("editor-text-overflowed"),
    strikethrough: cn("line-through"),
    underline: cn("underline"),
    underlineStrikethrough: cn("line-through"),
    highlight: cn("bg-amber-300 text-amber"),
  },
};
