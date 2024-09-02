import type { ReactNode } from "react";
import UndoRedoTools from "./_components/editor-plugins/undo-redo-tools";

type Props = {
  children: ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
};

export default layout;
