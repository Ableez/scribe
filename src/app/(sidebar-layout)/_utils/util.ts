import type { EventStatus } from "types/upcoming-events";

export const getEventStatus = (
  eventTime: string | undefined,
  duration: string | undefined,
): EventStatus => {
  if (!eventTime || !duration) {
    return "past";
  }

  const now = new Date();
  const eventDate = new Date(eventTime);
  const durationToNumber = parseInt(duration);

  const finishTime = new Date(
    eventDate.getTime() + durationToNumber * 60 * 1000,
  );

  if (now > finishTime) return "past";
  if (eventDate.getTime() - now.getTime() < 5 * 60 * 1000) {
    if (now >= eventDate && now < finishTime) return "ongoing";
    return "active";
  }
  return "upcoming";
};
