import { parseTime } from "@/lib/utils";
import { IoCheckmarkCircle } from "react-icons/io5";
import { ArrowRight } from "lucide-react";
import type { EventItem, EventStatus } from "types/upcoming-events";

type EventItemProps = {
  item: EventItem;
  status: EventStatus;
};

export const EventItemComp: React.FC<EventItemProps> = ({ item, status }) => (
  <div
    className={`group relative w-full cursor-pointer place-items-center py-1 pl-6 align-middle text-sm text-neutral-700 transition-all duration-200 ease-in before:h-full before:w-1 before:rounded-full before:bg-neutral-300 dark:text-neutral-400 dark:before:bg-neutral-500 ${status === "ongoing" ? "scale-[1.14] rounded-md bg-violet-400/10 pb-2 pl-7 dark:bg-violet-400/10" : ""} ${status === "past" ? "opacity-50" : ""}`}
  >
    <div
      className={`duration-&lsqb;2.5s&rsqb; absolute left-0 top-1/2 h-[80%] w-1 -translate-y-1/2 rounded-full transition-all ease-in-out ${status === "ongoing" ? "left-2 h-[50%] w-1 animate-pulse bg-green-400/50" : "bg-violet-200 group-hover:bg-violet-400 dark:bg-neutral-700 group-hover:dark:bg-neutral-600"}`}
    />
    <h4
      className={`mb-1.5 font-semibold ${status === "past" ? "text-neutral-500" : ""}`}
    >
      {status === "ongoing" && (
        <>
          <span className="animate-pulse text-[10px] font-semibold text-violet-500 dark:text-violet-400">
            Ongoing
          </span>
          <br />
        </>
      )}
      {item.title}
    </h4>
    <div className="flex place-items-center justify-start gap-2 align-middle text-xs">
      <h6>{parseTime(item.time)}</h6>•<h6>{item.location}</h6>
    </div>
    {status === "past" && (
      <div className="absolute right-4 top-1/2 flex -translate-y-1/2 scale-90 place-items-center gap-1 align-middle font-semibold text-green-500 transition-all duration-300 ease-in-out group-hover:right-4">
        <IoCheckmarkCircle size={16} />
        <span>Done</span>
      </div>
    )}
    {status !== "past" && (
      <ArrowRight
        size={14}
        className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 ease-in-out group-hover:right-4 group-hover:opacity-100"
      />
    )}
  </div>
);
