import React from "react";

import { events } from "./mock-data";
import { UpcomingEventsHeader } from "./header";
import { UpcomingEventsLeftPanel } from "./left-panel";
import { UpcomingEventRightPanel } from "./right-panel";
import { getEventStatus } from "../_utils/util";

const UpcomingSchoolEvents: React.FC = () => {
  const activeEvent = events
    .flatMap((group) => group.items)
    .find(
      (item) =>
        getEventStatus(item.time, item.duration) === "active" ||
        getEventStatus(item.time, item.duration) === "ongoing" ||
        getEventStatus(item.time, item.duration) === "upcoming",
    );

  return (
    <div className="my-4">
      <UpcomingEventsHeader />
      <div className="min-h-max w-full rounded-lg bg-violet-100/70 transition-all duration-300 ease-out dark:bg-neutral-900">
        <div className="flex flex-col place-items-start gap-2 align-middle md:flex-row">
          <UpcomingEventsLeftPanel
            activeEvent={activeEvent}
            status={getEventStatus(activeEvent?.time, activeEvent?.duration)}
          />
          <UpcomingEventRightPanel
            events={events}
            getEventStatus={getEventStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default UpcomingSchoolEvents;
