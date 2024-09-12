import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import type { LexicalEditor } from "lexical";
import { useEffect } from "react";
import { api, queryClient } from "@/trpc/react";

// Types
type User = {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  image: string;
};

export type Note = {
  id: string;
  title: string;
  authorId: string;
  editorSettings?: string;
  createdAt: Date;
  updatedAt: Date;
  editorState: string; // Serialized Lexical EditorState
  author: User;
  comments: unknown[];
  medias: unknown[];
  collaborators: (User | undefined)[];
  lastEdittedBy: User | null;
};

type NotesStore = {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (updatedNote: Partial<Note>) => void;
  deleteNote: (noteId: string) => void;
  isOnline: boolean;
  setIsOnline: (isOnline: boolean) => void;
  updateEditorState: (noteId: string, editorState: string) => void;
  getNote: (noteId: string) => Note | undefined;
};

// Zustand store with persistence
const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      notes: [],
      setNotes: (notes) => set({ notes }),
      addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
      updateNote: (updatedNote) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === updatedNote.id ? { ...note, ...updatedNote } : note,
          ),
        })),
      deleteNote: (noteId) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== noteId),
        })),
      isOnline: navigator.onLine,
      setIsOnline: (isOnline) => set({ isOnline }),
      updateEditorState: (noteId, editorState) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId ? { ...note, editorState } : note,
          ),
        }));
      },
      getNote: (noteId) => {
        const state = get();
        const note = state.notes.find((note) => note.id === noteId);
        return note;
      },
    }),
    {
      name: "notes-storage",
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const value = await get(name);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return value ?? null;
        },
        setItem: async (name: string, value: unknown) => {
          await set(name, value);
        },
        removeItem: async (name: string) => {
          await del(name);
        },
      })),
    },
  ),
);

// Custom hook for data interaction
export const useNotesData = () => {
  const { notes, setNotes, isOnline, updateEditorState, getNote } =
    useNotesStore();

  const fetchNotes = api.note.getUserNotes.useQuery(undefined, {
    enabled: isOnline,
  });

  useEffect(() => {
    if (fetchNotes.isSuccess && fetchNotes.data?.data) {
      setNotes(fetchNotes.data.data);
    }
  }, [fetchNotes.isSuccess, fetchNotes.data?.data, setNotes]);

  const updateTitle = api.note.updateNote.useMutation({
    onSuccess: async (res) => {
      if (res.data[0]) {
        updateNote(res.data[0].id, {
          title: res.data[0].title,
        });
      }
      
      await queryClient.invalidateQueries({
        queryKey: ["getUserNotes", "notes"],
        type: "active",
      });
    },
  });

  const addNoteMutation = api.note.create.useMutation({
    onSuccess: async (newNote) => {
      if (newNote?.data) {
        useNotesStore.getState().addNote(newNote.data);
        return newNote.data;
      }

      await queryClient.invalidateQueries({
        queryKey: ["getUserNotes", "notes"],
        type: "active",
      });
    },
  });

  const addNote = async (
    note: Omit<Note, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (isOnline) {
      const createdNote = await addNoteMutation.mutateAsync(note);
      return createdNote;
    } else {
      const tempNote = {
        ...note,
        id: `temp_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      useNotesStore.getState().addNote(tempNote as Note);
      return { data: tempNote };
    }
  };

  const updateNote = (noteId: string, updatedNote: Partial<Note>) => {
    useNotesStore
      .getState()
      .updateNote({ id: noteId, ...updatedNote, updatedAt: new Date() });
  };

  const deleteNote = (noteId: string) => {
    useNotesStore.getState().deleteNote(noteId);
  };

  const handleEditorChange = (noteId: string, editor: LexicalEditor) => {
    editor.update(() => {
      const editorState = editor.getEditorState();
      updateEditorState(noteId, JSON.stringify(editorState));
    });
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNote,
    updateTitle,
    isOnline,
    handleEditorChange,
  };
};

export default useNotesStore;
