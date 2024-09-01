import type { SubTask } from "types/upcoming-events";

import { MdChecklist } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";

import { Button } from "@/components/ui/button";

type SubtasksProps = {
  subtasks: SubTask[];
};

export const UpcomingEventSubtasks: React.FC<SubtasksProps> = ({
  subtasks,
}) => (
  <div>
    <div className="mb-1 flex place-items-center justify-start gap-2 pl-2 align-middle text-xs font-semibold text-violet-500">
      <MdChecklist />
      <h4 className="">Subtasks</h4>
    </div>
    {subtasks.map((task) => (
      <div
        key={task.id}
        className="flex cursor-pointer place-items-center gap-3 rounded-xl px-4 py-1.5 align-middle text-xs transition-all duration-300 hover:bg-neutral-300/20"
      >
        {task.completed ? (
          <IoCheckmarkCircle size={23} className="-ml-0.5 text-violet-500" />
        ) : (
          <div className="aspect-square h-5 w-5 rounded-full border-2 border-neutral-200 bg-white hover:border-neutral-300 dark:bg-neutral-800" />
        )}
        <h4 className={task.completed ? "text-violet-300 line-through" : ""}>
          {task.title}
        </h4>
      </div>
    ))}
    {subtasks.length > 3 && (
      <Button className="mt-2 h-7 w-full border-none bg-transparent text-xs text-violet-500 shadow-none ring-4 ring-transparent hover:bg-transparent hover:opacity-80 hover:ring-violet-300/30 dark:bg-transparent dark:text-neutral-400 dark:hover:bg-transparent dark:hover:ring-violet-300/10">
        View all subtasks
      </Button>
    )}
  </div>
);
