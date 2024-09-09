import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TreeView } from "@lexical/react/LexicalTreeView";

export default function TreeViewPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  return (
    <div className="mb-32">
      <TreeView
        viewClassName="tree-view-output"
        treeTypeButtonClassName="debug-treetype-button"
        timeTravelPanelClassName="debug-timetravel-panel"
        timeTravelButtonClassName="debug-timetravel-button"
        timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
        timeTravelPanelButtonClassName="debug-timetravel-panel-button"
        editor={editor}
      />
    </div>
  );
}
