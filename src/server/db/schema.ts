import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTableCreator,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `scribe_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: varchar("image", { length: 255 })
    .notNull()
    .default(
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybGVxTGd1MzczZlhyVjg1bFYzSFhpcmpvWW4ifQ",
    ),
});

export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes, { relationName: "user_notes" }),
  media: many(medias, { relationName: "user_media" }),
  comments: many(noteComments, { relationName: "user_comments" }),
  ownedCollaborations: many(noteCollaborations, {
    relationName: "owned_collaborations",
  }),
  participatingCollaborations: many(noteCollaborations, {
    relationName: "participating_collaborations",
  }),
}));

export const notes = createTable(
  "notes",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    authorId: varchar("author_id", { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    editorSettings: varchar("editor_settings")
      .notNull()
      .default(
        JSON.stringify({
          pageStyle: "lined",
          theme: {
            backgroundColor: "rgba(255, 105, 180, 0.09)",
            fontFamily: "default",
            icon: "📜",
          },
        }),
      ),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    editorState: varchar("editor_state").notNull().default(""),
    lastEditorId: varchar("last_editor_id").references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  },
  (table) => ({
    authorIdIdx: index("note_author_id_idx").on(table.authorId),
    titleIdx: index("note_title_idx").on(table.title),
    createdAtIdx: index("note_created_at_idx").on(table.createdAt),
    updatedAtIdx: index("note_updated_at_idx").on(table.updatedAt),
  }),
);

export const noteRelations = relations(notes, ({ many, one }) => ({
  author: one(users, {
    fields: [notes.authorId],
    references: [users.id],
    relationName: "user_notes",
  }),
  comments: many(noteComments),
  medias: many(medias),
  collaborators: many(noteCollaborations, {
    relationName: "note_collaborators",
  }),
  lastEdittedBy: one(users, {
    fields: [notes.lastEditorId],
    references: [users.id],
  }),
}));

export const noteCollaborations = createTable("note_collaboration", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  noteAdminId: varchar("note_admin_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  noteId: uuid("note_id")
    .notNull()
    .references(() => notes.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  collaboratorId: varchar("collaborator_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  permissions: jsonb("permissions")
    .$type<{
      read: boolean;
      download: boolean;
      write: boolean;
      delete: boolean;
      share: boolean;
      addCollaborator: boolean;
    }>()
    .default({
      read: true,
      download: true,
      write: false,
      delete: false,
      share: false,
      addCollaborator: false,
    }),
});

export const noteCollaborationsRelations = relations(
  noteCollaborations,
  ({ one }) => ({
    note: one(notes, {
      fields: [noteCollaborations.noteId],
      references: [notes.id],
      relationName: "note_collaborators",
    }),
    noteAdmin: one(users, {
      fields: [noteCollaborations.noteAdminId],
      references: [users.id],
      relationName: "owned_collaborations",
    }),
    collaborator: one(users, {
      fields: [noteCollaborations.collaboratorId],
      references: [users.id],
      relationName: "participating_collaborations",
    }),
  }),
);

export const medias = createTable("media", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ownerId: varchar("owner_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  noteId: uuid("note_id")
    .notNull()
    .references(() => notes.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  url: varchar("url", { length: 255 }).notNull(),
  size: varchar("size", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
});

export const mediasRelations = relations(medias, ({ one }) => ({
  note: one(notes, {
    fields: [medias.noteId],
    references: [notes.id],
  }),
  owner: one(users, {
    fields: [medias.ownerId],
    references: [users.id],
    relationName: "user_media",
  }),
}));

export const noteComments = createTable("note_comment", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  authorId: varchar("author_id", { length: 255 })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  noteId: uuid("note_id")
    .notNull()
    .references(() => notes.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  text: varchar("text", { length: 1000 }).notNull(),
  isEdited: boolean("is_edited").default(false),
  editedAt: timestamp("edited_at"),
});

export const noteCommentsRelations = relations(noteComments, ({ one }) => ({
  note: one(notes, {
    fields: [noteComments.noteId],
    references: [notes.id],
  }),
  author: one(users, {
    fields: [noteComments.authorId],
    references: [users.id],
    relationName: "user_comments",
  }),
}));
