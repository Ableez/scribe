import { Check } from "lucide-react";
import { parseTime } from "@/lib/utils";
import type { EventItem, EventStatus } from "types/upcoming-events";

type ActiveTaskProps = {
  event: EventItem;
  status: EventStatus | undefined;
};

export const UpcomingEventActiveTask: React.FC<ActiveTaskProps> = ({
  event,
  status,
}) => (
  <>
    <div className="flex w-full flex-col place-items-start justify-between align-middle md:flex-row">
      <div className="flex w-full place-items-center justify-start gap-2 align-middle md:w-2/4">
        <Check size={16} className="opacity-60" />
        <h4 className="text-lg font-semibold">{event.title}</h4>
      </div>
      <div className="mt-2 w-full md:mt-0 md:w-fit">
        <h4 className="text-lg font-medium text-violet-500 md:text-sm">
          {status === "ongoing"
            ? `Ongoing since ${event.time}`
            : status === "upcoming"
              ? `Starts at ${parseTime(event.time, { showTime: true })}`
              : "Event"}
        </h4>
        <h4 className="text-xs text-neutral-700 dark:text-neutral-400">
          at {event.location}
        </h4>
      </div>
    </div>
    <div className="mt-1">
      <p className="text-xs text-neutral-600 dark:text-neutral-300">
        {event.description}
      </p>
    </div>
  </>
);
