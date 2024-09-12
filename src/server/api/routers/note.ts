import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { notes, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { ee } from "./ws-subscription";
import { UPDATENOTEWS } from "../../../lib/utils/CONSTANTS";

export const noteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1).optional() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        console.log("failed to create note.❌userId not found in tRPC context");
        return;
      }

      console.log("CTX USERID", ctx.userId);

      const newNote = await ctx.db
        .insert(notes)
        .values({
          authorId: ctx.userId,
          title: input.title ?? "Untitled",
        })
        .returning();

      if (!newNote[0]) {
        return { message: "❌Unable to create note (!newNote[0])", data: null };
      }

      const userNewNote = await ctx.db.query.notes.findFirst({
        where: eq(notes.id, newNote[0].id),
        with: {
          author: true,
          comments: true,
          medias: true,
          collaborators: true,
          lastEdittedBy: true,
        },
      });

      if (!userNewNote) {
        return {
          message: "❌Unable to create note (!userNewNote)",
          data: null,
        };
      }

      const collaboratorsData = await Promise.all(
        userNewNote.collaborators.map(async (collaborator) => {
          return ctx.db.query.users.findFirst({
            where: eq(users.id, collaborator.collaboratorId),
          });
        }),
      );

      return {
        message: "Note created",
        data: { ...userNewNote, collaborators: collaboratorsData },
      };
    }),

  getUserNotes: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      console.log("failed to create note.❌userId not found in tRPC context");
      return { message: "❌User not authenticated", data: null };
    }

    const userNotes = await ctx.db.query.notes.findMany({
      where: eq(notes.authorId, ctx.userId),
      with: {
        author: true,
        comments: true,
        medias: true,
        collaborators: true,
        lastEdittedBy: true,
      },
    });

    const notesWithCollaboratorsData = await Promise.all(
      userNotes.map(async (note) => {
        const collaborators = await Promise.all(
          note.collaborators.map(async (collaborator) => {
            return ctx.db.query.users.findFirst({
              where: eq(users.id, collaborator.collaboratorId),
            });
          }),
        );

        return { ...note, collaborators };
      }),
    );

    return { message: "User notes fetched!", data: notesWithCollaboratorsData };
  }),
  getNoteInfo: protectedProcedure
    .input(z.object({ noteId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        console.log(
          "Failed to get note info. ❌ userId not found in tRPC context",
        );
        return { message: "User not authenticated", data: null };
      }

      const note = await ctx.db.query.notes.findFirst({
        where: eq(notes.id, input.noteId),
        with: {
          author: true,
          comments: true,
          medias: true,
          collaborators: true,
          lastEdittedBy: true,
        },
      });

      if (!note) {
        return { message: "Note not found", data: null };
      }

      const collaboratorsData = await Promise.all(
        note.collaborators.map(async (collaborator) => {
          return ctx.db.query.users.findFirst({
            where: eq(users.id, collaborator.collaboratorId),
          });
        }),
      );

      const noteWithCollaborators = {
        ...note,
        collaborators: collaboratorsData,
      };

      return { message: "Note data fetched", data: noteWithCollaborators };
    }),

  updateNote: protectedProcedure
    .input(
      z.object({
        noteId: z.string(),
        updateFields: z
          .object({
            title: z.string().optional(),
            authorId: z.string().optional(),
            id: z.string().optional(),
            editorSettings: z.string().optional(),
            createdAt: z.date().optional(),
            updatedAt: z.date().optional(),
            editorState: z.string().optional(),
          })
          .partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedNote = await ctx.db
        .update(notes)
        .set({
          ...input.updateFields,
          updatedAt: new Date(),
          lastEditorId: ctx.userId,
        })
        .where(eq(notes.id, input.noteId))
        .returning();

      ee.emit("udpateNoteWS", input);

      return { message: "✅Note updated", data: updatedNote };
    }),

  deleteNote: protectedProcedure
    .input(z.object({ noteId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(notes).where(eq(notes.id, input.noteId));

      return { message: "🗑️Note deleted", data: input.noteId };
    }),
});
