"use server";
import { api } from "@/trpc/server";

export const createNotedocument = async ({ title }: { title: string }) => {
  const createNote = await api.note.create({ title: title });

  return createNote;
};
