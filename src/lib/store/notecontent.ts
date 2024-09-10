import { create } from "zustand";
import { persist } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import debounce from "lodash/debounce";
import type { LexicalEditor } from "lexical";
import { api, queryClient } from "@/trpc/react";
import { useEffect } from "react";

// Types
type User = {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  image: string;
};

type Note = {
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
        return state.notes.find((note) => note.id === noteId);
      },
    }),
    {
      name: "notes-storage",
      getStorage: () => ({
        getItem: async (name) => {
          const value = (await get(name)) as unknown as string;
          return value ?? null;
        },
        setItem: async (name, value) => {
          await set(name, value);
        },
        removeItem: async (name) => {
          await del(name);
        },
      }),
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

  const addNoteMutation = api.note.create.useMutation({
    onSuccess: async (newNote) => {
      if (newNote?.data) {
        useNotesStore.getState().addNote(newNote.data);
        return newNote.data;
      }
      await queryClient.invalidateQueries();
    },
  });

  const updateNoteMutation = api.note.updateNote.useMutation({
    onSuccess: async (updatedNote) => {
      if (updatedNote.data[0]) {
        useNotesStore.getState().updateNote(updatedNote.data[0]);
        debounce(() => void queryClient.invalidateQueries(), 1618);
      }
    },
  });

  const deleteNoteMutation = api.note.deleteNote.useMutation({
    onSuccess: async (deletedNote) => {
      if (deletedNote.data)
        useNotesStore.getState().deleteNote(deletedNote.data);
      await queryClient.invalidateQueries();
    },
  });

  const getNoteQuery = api.note.getNoteInfo.useQuery;

  // Debounced function to update editor state
  const debouncedUpdateEditorState = debounce(
    (noteId: string, updatedNote: Partial<Note>) => {
      updateNoteMutation.mutate({
        noteId,
        updateFields: updatedNote,
      });
    },
    1618,
  ); // Debounce for 1 second

  const addNote = async (
    note: Omit<Note, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (isOnline) {
      const createdNote = await addNoteMutation.mutateAsync(note);
      return createdNote;
    } else {
      // For offline mode, generate a temporary ID
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
    if (isOnline) {
      useNotesStore
        .getState()
        .updateEditorState(noteId, JSON.stringify(updatedNote.editorState));
      debouncedUpdateEditorState(noteId, updatedNote);
    } else {
      useNotesStore.getState().updateNote({ id: noteId, ...updatedNote });
    }
  };

  const deleteNote = (noteId: string) => {
    if (isOnline) {
      deleteNoteMutation.mutate({ noteId });
    } else {
      useNotesStore.getState().deleteNote(noteId);
    }
  };

  const handleEditorChange = (noteId: string, editor: LexicalEditor) => {
    editor.update(() => {
      const editorState = editor.getEditorState();
      updateEditorState(noteId, JSON.stringify(editorState));
      debouncedUpdateEditorState(noteId, {
        editorState: JSON.stringify(editorState),
      });
    });
  };

  const getNoteById = (noteId: string) => {
    const localNote = getNote(noteId);
    if (localNote) {
      return { data: localNote, isLoading: false, isError: false };
    }
    return getNoteQuery({ noteId });
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNoteById,
    getNote,
    isOnline,
    handleEditorChange,
    isLoading: fetchNotes.isLoading,
    isError: fetchNotes.isError,
  };
};

export default useNotesStore;
