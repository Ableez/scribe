export type EventStatus = "past" | "active" | "upcoming" | "ongoing";

export type SubTask = {
  id: string;
  title: string;
  completed: boolean;
};

export type EventItem = {
  id: string;
  time: string;
  duration: string;
  title: string;
  location: string;
  description: string;
  subtasks: SubTask[];
};

export type EventGroup = {
  date: string;
  dateInfo: string;
  items: EventItem[];
};
