import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import type { NoteDocumentState, NoteDocumentActions } from "./types";

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, "was retrieved");
    return (await get(name)) ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, "has been deleted");
    await del(name);
  },
};

export const useNoteContentStore = create<
  NoteDocumentState & NoteDocumentActions
>()(
  persist(
    (set, get) => ({
      noteDocuments: [],

      // Adding a new NoteDocument
      addNoteDocument: (noteDocument) =>
        set((state) => ({
          noteDocuments: [...state.noteDocuments, noteDocument],
        })),

      // Removing a NoteDocument by ID
      removeNoteDocument: (id) =>
        set((state) => ({
          noteDocuments: state.noteDocuments.filter((doc) => doc.id !== id),
        })),

      // Updating a NoteDocument by ID
      updateNoteDocument: (id, updates) =>
        set((state) => ({
          noteDocuments: state.noteDocuments.map((doc) =>
            doc.id === id ? { ...doc, ...updates } : doc,
          ),
        })),

      // Setting the title for a specific NoteDocument
      setTitle: (id, title) =>
        set((state) => ({
          noteDocuments: state.noteDocuments.map((doc) =>
            doc.id === id ? { ...doc, title } : doc,
          ),
        })),

      // Setting the editor state for a specific NoteDocument
      setEditorState: (id, editorState) =>
        set((state) => ({
          noteDocuments: state.noteDocuments.map((doc) =>
            doc.id === id ? { ...doc, editorState } : doc,
          ),
        })),

      // Setting the author for a specific NoteDocument
      setAuthor: (id, author) =>
        set((state) => ({
          noteDocuments: state.noteDocuments.map((doc) =>
            doc.id === id ? { ...doc, author } : doc,
          ),
        })),

      // Setting editor settings for a specific NoteDocument
      setEditorSettings: (id, settings) =>
        set((state) => ({
          noteDocuments: state.noteDocuments.map((doc) =>
            doc.id === id ? { ...doc, editorSettings: settings } : doc,
          ),
        })),

      // Adding a collaborator to a specific NoteDocument
      addCollaborator: (id, collaborator) =>
        set((state) => ({
          noteDocuments: state.noteDocuments.map((doc) =>
            doc.id === id
              ? { ...doc, collaborators: [...doc.collaborators!, collaborator] }
              : doc,
          ),
        })),

      // Removing a collaborator from a specific NoteDocument
      removeCollaborator: (documentId, collaboratorId) =>
        set((state) => ({
          noteDocuments: state.noteDocuments.map((doc) =>
            doc.id === documentId
              ? {
                  ...doc,
                  collaborators: doc.collaborators!.filter(
                    (c) => c.id !== collaboratorId,
                  ),
                }
              : doc,
          ),
        })),

      // Updating a collaborator in a specific NoteDocument
      updateCollaborator: (documentId, collaboratorId, updates) =>
        set((state) => ({
          noteDocuments: state.noteDocuments.map((doc) =>
            doc.id === documentId
              ? {
                  ...doc,
                  collaborators: doc.collaborators!.map((c) =>
                    c.id === collaboratorId ? { ...c, ...updates } : c,
                  ),
                }
              : doc,
          ),
        })),

      // Adding a comment to a specific NoteDocument
      addComment: (id, comment) =>
        set((state) => ({
          noteDocuments: state.noteDocuments.map((doc) =>
            doc.id === id
              ? { ...doc, comments: [...doc.comments!, comment] }
              : doc,
          ),
        })),

      // Removing a comment from a specific NoteDocument
      removeComment: (documentId, commentId) =>
        set((state) => ({
          noteDocuments: state.noteDocuments.map((doc) =>
            doc.id === documentId
              ? {
                  ...doc,
                  comments: doc.comments!.filter((c) => c.id !== commentId),
                }
              : doc,
          ),
        })),

      // Updating a comment in a specific NoteDocument
      updateComment: (documentId, commentId, updates) =>
        set((state) => ({
          noteDocuments: state.noteDocuments.map((doc) =>
            doc.id === documentId
              ? {
                  ...doc,
                  comments: doc.comments!.map((c) =>
                    c.id === commentId ? { ...c, ...updates } : c,
                  ),
                }
              : doc,
          ),
        })),

      // Get all NoteDocuments
      getNoteDocuments: () => get().noteDocuments,

      // Get a specific NoteDocument by ID
      getNoteDocumentById: (id) =>
        get().noteDocuments.find((doc) => doc.id === id),
    }),
    {
      name: "note-editor-content-storage",
      storage: createJSONStorage(() => storage),
    },
  ),
);
