import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const UpcomingEventFreeDay: React.FC = () => (
  <div className="group relative w-full cursor-pointer place-items-center py-1 pl-6 align-middle text-sm text-neutral-700 transition-all duration-200 ease-in before:h-full before:w-1 before:rounded-full before:bg-neutral-300 dark:text-neutral-400 dark:before:bg-neutral-500">
    <div className="absolute left-0 top-1/2 h-full w-1 -translate-y-1/2 rounded-full bg-neutral-200 opacity-50 transition-all duration-300 ease-in-out dark:bg-neutral-700" />
    <h4 className="mb-1.5 font-semibold opacity-50">Free day</h4>
    <div className="flex place-items-center justify-start gap-2 align-middle text-xs opacity-50">
      <h6>You have no schedules for this day</h6>
    </div>
    <Button
      variant={"icon"}
      size={"icon"}
      className="absolute right-4 top-1/2 -translate-y-1/2 bg-violet-500 text-white transition-all duration-300 ease-in-out hover:bg-violet-500/80"
    >
      <PlusIcon size={16} />
    </Button>
  </div>
);
