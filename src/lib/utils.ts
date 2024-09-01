import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
type TimeUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

const TIME_UNITS: [number, TimeUnit][] = [
  [60, "second"],
  [60, "minute"],
  [24, "hour"],
  [7, "day"],
  [4.34524, "week"],
  [12, "month"],
  [Number.POSITIVE_INFINITY, "year"],
];
export const parseTime = (
  utcString: string,
  opts?: {
    showTime?: boolean;
    onlyDay?: boolean;
    fullDateAndTime?: boolean;
    nowDate?: Date;
  },
): string => {
  const date = new Date(utcString);

  if (opts?.showTime) {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  }

  if (opts?.fullDateAndTime) {
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });
  }

  if (opts?.onlyDay) {
    return date.toLocaleString("en-US", {
      month: "short",
      hour: "numeric",
      hour12: false,
      timeZone: "UTC",
    });
  }

  if (opts?.nowDate) {
    const secondsPast = (opts?.nowDate.getTime() - date.getTime()) / 1000;

    if (secondsPast < 5) return "just now";
    if (secondsPast < 0) return "in the future";

    let amount = secondsPast;
    for (const [divider, unit] of TIME_UNITS) {
      if (amount < divider) {
        const value = Math.floor(amount);
        return `${value} ${unit}${value !== 1 ? "s" : ""} ago`;
      }
      amount /= divider;
    }
  }

  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
};
