import type { SerializedEditorState, SerializedLexicalNode } from "lexical";

type Author = {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  image: string;
};

type EditorSettings = {
  pageStyle: "lined" | "cross";
  theme: {
    backgroundColor: string;
    fontFamily: string;
    icon: string;
  };
};

export type Collaborator = Author;

type Comment = {
  id: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  noteId: string;
  text: string;
  isEditted: boolean;
  edittedAt: string | null;
};

type Media = {
  id: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  noteId: string;
  url: string;
  size: string;
  type: string;
};

export type NoteDocument = {
  id: string;
  title: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  editorSettings: EditorSettings;
  editorState: SerializedEditorState<SerializedLexicalNode> | null;
  author: Author;
  comments: Comment[];
  medias: Media[];
};

export type NoteDocumentState = {
  noteDocuments: NoteDocument[];
};

export type NoteDocumentActions = {
  addNoteDocument: (noteDocument: NoteDocument) => void;
  removeNoteDocument: (id: string) => void;
  updateNoteDocument: (id: string, updates: Partial<NoteDocument>) => void;

  setTitle: (id: string, title: string) => void;
  setEditorState: (
    id: string,
    editorState: SerializedEditorState<SerializedLexicalNode> | null,
  ) => void;
  setAuthor: (id: string, author: Author) => void;
  setEditorSettings: (id: string, settings: EditorSettings) => void;
  addCollaborator: (id: string, collaborator: Collaborator) => void;
  removeCollaborator: (documentId: string, collaboratorId: string) => void;
  updateCollaborator: (
    documentId: string,
    collaboratorId: string,
    updates: Partial<Collaborator>,
  ) => void;
  addComment: (id: string, comment: NoteComment) => void;
  removeComment: (documentId: string, commentId: string) => void;
  updateComment: (
    documentId: string,
    commentId: string,
    updates: Partial<NoteComment>,
  ) => void;
  getNoteDocuments: () => NoteDocument[];
  getNoteDocumentById: (id: string) => NoteDocument | undefined;
};

export type NoteActions = {
  addNoteDocument: (noteDocument: NoteDocument) => void;
  // removeNoteDocument: (id: string) => void;
  updateNoteDocument: (id: string, updates: Partial<NoteDocument>) => void;

  // setTitle: (id: string, title: string) => void;
  // setEditorState: (
  //   id: string,
  //   editorState: SerializedEditorState<SerializedLexicalNode> | null,
  // ) => void;
  // setEditorSettings: (id: string, settings: EditorSettings) => void;
  addCollaborator: (id: string, collaborator: Collaborator) => void;
  // removeCollaborator: (documentId: string, collaboratorId: string) => void;
  // addComment: (id: string, comment: NoteComment) => void;
  // removeComment: (documentId: string, commentId: string) => void;
  // updateComment: (
  //   documentId: string,
  //   commentId: string,
  //   updates: Partial<NoteComment>,
  // ) => void;

  // getNoteDocuments: () => NoteDocument[];
  // getNoteDocumentById: (id: string) => NoteDocument | undefined;
};
