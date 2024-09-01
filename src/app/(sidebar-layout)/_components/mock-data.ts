import type { EventGroup } from "types/upcoming-events";

export const events: EventGroup[] = [
  {
    date: "Today",
    dateInfo: new Date().toLocaleDateString(),
    items: [
      {
        id: "1",
        time: "2024-08-21T10:10:00Z",
        duration: "60", //MINUTES
        title: "MAT111 Tutorial class",
        location: "CS ND1 Classroom",
        description: "Review of last week's topics",
        subtasks: [],
      },
      {
        id: "2",
        time: "2024-08-31T23:10:00Z",
        duration: "60", //MINUTES
        title: "Meet with Jacob",
        location: "Sports Complex",
        description: "Discuss project timeline",
        subtasks: [
          { id: "s1", title: "Prepare meeting agenda", completed: false },
          { id: "s2", title: "Review project documents", completed: false },
        ],
      },
      {
        id: "3",
        time: "2024-08-29T21:08:00Z",
        duration: "60",
        title: "COM116 Lecture class",
        location: "CS ND1 Classroom",
        description: "Introduction to data structures",
        subtasks: [],
      },
    ],
  },
  {
    date: "Tomorrow",
    dateInfo: new Date(Date.now() + 86400000).toLocaleDateString(),
    items: [
      {
        id: "4",
        time: "2024-08-30T21:56:13Z",
        duration: "30",
        title: "Study Group",
        location: "Library",
        description: "Prepare for upcoming exam",
        subtasks: [
          {
            completed: false,
            id: "3",
            title: "Read through Linear Algebra",
          },
        ],
      },
    ],
  },
];
