import type { EventGroup, EventStatus } from "types/upcoming-events";
import { EventItemComp } from "./event-item";
import { UpcomingEventFreeDay } from "./free-day";

type EventGroupProps = {
  event: EventGroup;
  getEventStatus: (time: string, duration: string) => EventStatus;
};

export const UpcomingEventEventGroup: React.FC<EventGroupProps> = ({
  event,
  getEventStatus,
}) => (
  <div className="relative flex place-items-start justify-start p-4 align-top">
    <div className="sticky top-0 w-1/3 text-sm dark:text-neutral-300">
      <h4 className="text-base font-semibold text-violet-500 dark:text-violet-400">
        {event.date}
      </h4>
      <h6 className="mt-1 text-xs">{event.dateInfo}</h6>
    </div>
    <div className="flex w-full flex-col gap-5">
      {event.items.length > 0 ? (
        event.items.map((item) => (
          <EventItemComp
            key={item.id}
            item={item}
            status={getEventStatus(item.time, item.duration)}
          />
        ))
      ) : (
        <UpcomingEventFreeDay />
      )}
    </div>
  </div>
);
