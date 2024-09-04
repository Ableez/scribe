import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import type { NoteDocumentActions, NoteDocumentState } from "./types";
import { get, set, del } from "idb-keyval";

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    // console.log(name, "has been retrieved");
    return (await get(name)) ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    // console.log(name, "with value", value, "has been saved");
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
      title: "",
      editorState: null,
      author: {
        id: "",
        username: "",
        email: "",
        profilePicture: "",
      },
      versions: [
        {
          id: "",
          createdAt: "",
          previousVersion: "",
          lastEdittedAt: "",
        },
      ],
      editorSettings: {
        pageStyle: "",
      },
      collaborators: [
        {
          id: "",
          username: "",
          email: "",
          profilePicture: "",
        },
      ],
      comments: [
        {
          id: "",
          author: {
            id: "",
            username: "",
            email: "",
            profilePicture: "",
          },
          text: "",
          createdAt: "",
          edittedAt: "",
          isEditted: false,
        },
      ],
      //
      setTitle: (title) => set({ title }),
      setEditorState: (editorState) => set({ editorState }),
      setAuthor: (author) => set({ author }),
      addVersion: (version) =>
        set((state) => ({ versions: [...state.versions, version] })),
      updateVersion: (id, updates) =>
        set((state) => ({
          versions: state.versions.map((v) =>
            v.id === id ? { ...v, ...updates } : v,
          ),
        })),
      setEditorSettings: (settings) => set({ editorSettings: settings }),
      addCollaborator: (collaborator) =>
        set((state) => ({
          collaborators: [...state.collaborators, collaborator],
        })),
      removeCollaborator: (id) =>
        set((state) => ({
          collaborators: state.collaborators.filter((c) => c.id !== id),
        })),
      updateCollaborator: (id, updates) =>
        set((state) => ({
          collaborators: state.collaborators.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),
      addComment: (comment) =>
        set((state) => ({ comments: [...state.comments, comment] })),
      removeComment: (id) =>
        set((state) => ({
          comments: state.comments.filter((c) => c.id !== id),
        })),
      updateComment: (id, updates) =>
        set((state) => ({
          comments: state.comments.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),
      //
      getTitle: () => get().title,
      getEditorState: () => get().editorState,
      getAuthor: () => get().author,
      getVersions: () => get().versions,
      getVersionById: (id) => get().versions.find((v) => v.id === id),
      getEditorSettings: () => get().editorSettings,
      getCollaborators: () => get().collaborators,
      getCollaboratorById: (id) => get().collaborators.find((c) => c.id === id),
      getComments: () => get().comments,
      getCommentById: (id) => get().comments.find((c) => c.id === id),
    }),
    {
      name: "note-editor-content-storage",
      storage: createJSONStorage(() => storage),
    },
  ),
);
