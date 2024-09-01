import type { EventGroup, EventStatus } from "types/upcoming-events";
import { UpcomingEventEventGroup } from "./event-groups";

type RightPanelProps = {
  events: EventGroup[];
  getEventStatus: (time: string, duration: string) => EventStatus;
};

export const UpcomingEventRightPanel: React.FC<RightPanelProps> = ({
  events,
  getEventStatus,
}) => {
  return (
    <div className="hidden h-[50dvh] w-full grid-flow-row gap-1 border-l p-4 dark:border-neutral-700 md:grid md:h-[285px] md:w-7/12">
      {events.slice(0, 3).map((event, index) => (
        <UpcomingEventEventGroup
          key={index}
          event={event}
          getEventStatus={getEventStatus}
        />
      ))}
    </div>
  );
};
