import { observable } from "@trpc/server/observable";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import EventEmitter from "events";
import type { NoteDocument } from "@/lib/store/types";

export const ee = new EventEmitter();

export const wsTest = createTRPCRouter({
  updateNoteSubscription: protectedProcedure.subscription(async () => {
    return observable((emit) => {
      const updatedNote = (note: Partial<NoteDocument>) => {
        emit.next(note);
      };

      ee.on("udpateNoteWS", updatedNote);

      return () => ee.off("udpateNoteWS", updatedNote);
    });
  }),

  // add: protectedProcedure
  //   .input(z.object({ name: z.string() }))
  //   .mutation(async ({ input }) => {
  //     ee.emit("add", input);
  //     return { message: "Added", data: input };
  //   }),
});
