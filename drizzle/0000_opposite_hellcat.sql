CREATE TABLE IF NOT EXISTS "scribe_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"owner_id" varchar NOT NULL,
	"note_id" uuid NOT NULL,
	"url" varchar(255) NOT NULL,
	"size" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scribe_note_collaboration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"note_admin_id" varchar NOT NULL,
	"note_id" uuid NOT NULL,
	"collaborator_id" varchar NOT NULL,
	"permissions" jsonb DEFAULT '{"read":true,"download":true,"write":false,"delete":false,"share":false,"addCollaborator":false}'::jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scribe_note_comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"author_id" varchar(255) NOT NULL,
	"note_id" uuid NOT NULL,
	"text" varchar(1000) NOT NULL,
	"is_edited" boolean DEFAULT false,
	"edited_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scribe_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"author_id" varchar(255) NOT NULL,
	"editor_settings" varchar DEFAULT '{"pageStyle":"lined","theme":{"backgroundColor":"rgba(255, 105, 180, 0.09)","fontFamily":"default","icon":"📜"}}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"editor_state" varchar DEFAULT '' NOT NULL,
	"last_editor_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scribe_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" varchar(255) DEFAULT 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybGVxTGd1MzczZlhyVjg1bFYzSFhpcmpvWW4ifQ' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scribe_media" ADD CONSTRAINT "scribe_media_owner_id_scribe_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."scribe_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scribe_media" ADD CONSTRAINT "scribe_media_note_id_scribe_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."scribe_notes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scribe_note_collaboration" ADD CONSTRAINT "scribe_note_collaboration_note_admin_id_scribe_user_id_fk" FOREIGN KEY ("note_admin_id") REFERENCES "public"."scribe_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scribe_note_collaboration" ADD CONSTRAINT "scribe_note_collaboration_note_id_scribe_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."scribe_notes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scribe_note_collaboration" ADD CONSTRAINT "scribe_note_collaboration_collaborator_id_scribe_user_id_fk" FOREIGN KEY ("collaborator_id") REFERENCES "public"."scribe_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scribe_note_comment" ADD CONSTRAINT "scribe_note_comment_author_id_scribe_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."scribe_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scribe_note_comment" ADD CONSTRAINT "scribe_note_comment_note_id_scribe_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."scribe_notes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scribe_notes" ADD CONSTRAINT "scribe_notes_author_id_scribe_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."scribe_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scribe_notes" ADD CONSTRAINT "scribe_notes_last_editor_id_scribe_user_id_fk" FOREIGN KEY ("last_editor_id") REFERENCES "public"."scribe_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "note_author_id_idx" ON "scribe_notes" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "note_title_idx" ON "scribe_notes" USING btree ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "note_created_at_idx" ON "scribe_notes" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "note_updated_at_idx" ON "scribe_notes" USING btree ("updated_at");