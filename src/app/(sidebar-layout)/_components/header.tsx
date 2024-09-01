import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { IoCalendarNumber } from "react-icons/io5";

export const UpcomingEventsHeader: React.FC = () => (
  <div className="flex place-items-center justify-between px-4 py-4 align-middle">
    <h4 className="justify flex place-items-center gap-2 align-middle text-xs font-semibold text-neutral-500">
      <IoCalendarNumber size={16} /> Tasks and schedules
    </h4>
    <Button className="gap-2 border-violet-600 bg-violet-500 text-sm text-white ring-4 ring-transparent hover:border-violet-500 hover:bg-violet-500/90 hover:ring-violet-300/50 dark:bg-violet-500 dark:text-white dark:hover:border-violet-500/80 dark:hover:bg-violet-500/60 dark:hover:ring-violet-300/10">
      <PlusIcon size={18} /> New Task
    </Button>
  </div>
);
