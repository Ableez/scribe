import type { EventItem, EventStatus } from "types/upcoming-events";
import { UpcomingEventActiveTask } from "./active-task";
import { UpcomingEventNoActiveTask } from "./inactive-event";
import { UpcomingEventSubtasks } from "./subtask";

type LeftPanelProps = {
  activeEvent: EventItem | undefined;
  status: EventStatus | undefined;
};

export const UpcomingEventsLeftPanel: React.FC<LeftPanelProps> = ({
  activeEvent,
  status,
}) => (
  <div className="flex md:h-full w-full flex-col gap-8 md:gap-4 px-4 md:pb-0 pb-4 pt-4 md:w-5/12">
    {activeEvent ? (
      <UpcomingEventActiveTask status={status} event={activeEvent} />
    ) : (
      <UpcomingEventNoActiveTask />
    )}
    {activeEvent && <UpcomingEventSubtasks subtasks={activeEvent.subtasks} />}
  </div>
);
