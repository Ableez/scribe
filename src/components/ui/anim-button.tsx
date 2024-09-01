import type { ReactNode } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  size?: "icon" | "default";
  className?: string;
  onClick?: () => void;
};

const AnimButton = ({ onClick, children, size, className }: Props) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        className,
        `${size === "icon" ? "aspect-square h-12 w-12" : ""} gap-2 border-violet-600 bg-violet-500 text-sm text-white ring-4 ring-transparent hover:border-violet-500 hover:bg-violet-500 hover:ring-violet-300/50 dark:bg-violet-500 dark:text-white dark:hover:border-violet-400/50 dark:hover:bg-violet-400 dark:hover:ring-violet-300/10`,
      )}
    >
      {children}
    </Button>
  );
};

export default AnimButton;
