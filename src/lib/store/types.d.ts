import type { SerializedEditorState, SerializedLexicalNode } from "lexical";

export type Author = {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
};

export type Version = {
  id: string;
  createdAt: string;
  previousVersion: string;
  lastEdittedAt: string;
};

export type EditorSettings = {
  pageStyle: string;
};

export type Collaborator = Author;

export type NoteComment = {
  id: string;
  author: Author;
  text: string;
  createdAt: string;
  edittedAt: string;
  isEditted: boolean;
};

export type NoteDocumentState = {
  title: string;
  editorState: SerializedEditorState<SerializedLexicalNode> | null;
  author: Author;
  versions: Version[];
  editorSettings: EditorSettings;
  collaborators: Collaborator[];
  comments: NoteComment[];
};

export type NoteDocumentActions = {
  setTitle: (title: string) => void;
  setEditorState: (
    editorState: SerializedEditorState<SerializedLexicalNode>,
  ) => void;
  setAuthor: (author: NoteDocumentState["author"]) => void;
  addVersion: (version: NoteDocumentState["versions"][0]) => void;
  updateVersion: (
    id: string,
    updates: Partial<NoteDocumentState["versions"][0]>,
  ) => void;
  setEditorSettings: (settings: NoteDocumentState["editorSettings"]) => void;
  addCollaborator: (
    collaborator: NoteDocumentState["collaborators"][0],
  ) => void;
  removeCollaborator: (id: string) => void;
  updateCollaborator: (
    id: string,
    updates: Partial<NoteDocumentState["collaborators"][0]>,
  ) => void;
  addComment: (comment: NoteDocumentState["comments"][0]) => void;
  removeComment: (id: string) => void;
  updateComment: (
    id: string,
    updates: Partial<NoteDocumentState["comments"][0]>,
  ) => void;
  getTitle: () => string;
  getEditorState: () => SerializedEditorState<SerializedLexicalNode> | null;
  getAuthor: () => NoteDocumentState["author"];
  getVersions: () => NoteDocumentState["versions"];
  getVersionById: (id: string) => NoteDocumentState["versions"][0] | undefined;
  getEditorSettings: () => NoteDocumentState["editorSettings"];
  getCollaborators: () => NoteDocumentState["collaborators"];
  getCollaboratorById: (
    id: string,
  ) => NoteDocumentState["collaborators"][0] | undefined;
  getComments: () => NoteDocumentState["comments"];
  getCommentById: (id: string) => NoteDocumentState["comments"][0] | undefined;
};
