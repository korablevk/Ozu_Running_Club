import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_events_event_type" AS ENUM('campus_social', 'track_interval', 'city_long', 'trail_nature', 'race_competition');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_events_status" AS ENUM('scheduled', 'completed', 'cancelled');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_club_members_experience_level" AS ENUM('beginner', 'intermediate', 'advanced');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_club_members_status" AS ENUM('pending', 'active', 'rejected', 'inactive', 'alumni');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_event_registrations_status" AS ENUM('confirmed', 'waitlist', 'cancelled', 'attended', 'no_show');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_tier" AS ENUM('title_gear', 'university', 'trail_alliance', 'nutrition');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'admin' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "events_pace_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"target_pace" varchar NOT NULL,
  	"pacer" varchar NOT NULL,
  	"capacity" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"event_type" "enum_events_event_type" DEFAULT 'campus_social' NOT NULL,
  	"description" varchar,
  	"cover_image_id" integer,
  	"date" timestamp(3) with time zone NOT NULL,
  	"meeting_point" varchar DEFAULT 'ÖzÜ Athletic Center Steps' NOT NULL,
  	"google_maps_url" varchar,
  	"registration_deadline" timestamp(3) with time zone,
  	"distance_km" numeric NOT NULL,
  	"elevation_gain_m" numeric DEFAULT 0,
  	"target_pace" varchar DEFAULT '5:30 - 6:00 /km',
  	"estimated_duration" varchar DEFAULT '60 min',
  	"max_participants" numeric DEFAULT 40 NOT NULL,
  	"is_registration_enabled" boolean DEFAULT true,
  	"status" "enum_events_status" DEFAULT 'scheduled' NOT NULL,
  	"is_published" boolean DEFAULT true,
  	"is_featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "club_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"student_id" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"faculty" varchar NOT NULL,
  	"experience_level" "enum_club_members_experience_level" DEFAULT 'beginner' NOT NULL,
  	"motivation" varchar,
  	"status" "enum_club_members_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "event_registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_id" integer NOT NULL,
  	"member_id" integer,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"student_id" varchar,
  	"phone" varchar,
  	"pace_group" varchar,
  	"status" "enum_event_registrations_status" DEFAULT 'confirmed' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"tier" "enum_partners_tier" DEFAULT 'title_gear' NOT NULL,
  	"website_url" varchar NOT NULL,
  	"perk_description" varchar NOT NULL,
  	"discount_code" varchar,
  	"logo_id" integer,
  	"is_published" boolean DEFAULT true,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"events_id" integer,
  	"club_members_id" integer,
  	"event_registrations_id" integer,
  	"partners_id" integer
  );

  ALTER TABLE "payload_locked_documents_rels" 
    ADD COLUMN IF NOT EXISTS "media_id" integer,
    ADD COLUMN IF NOT EXISTS "events_id" integer,
    ADD COLUMN IF NOT EXISTS "club_members_id" integer,
    ADD COLUMN IF NOT EXISTS "event_registrations_id" integer,
    ADD COLUMN IF NOT EXISTS "partners_id" integer;

  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
    ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "events_pace_groups" ADD CONSTRAINT "events_pace_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "events" ADD CONSTRAINT "events_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_member_id_club_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."club_members"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_club_members_fk" FOREIGN KEY ("club_members_id") REFERENCES "public"."club_members"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_registrations_fk" FOREIGN KEY ("event_registrations_id") REFERENCES "public"."event_registrations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX IF NOT EXISTS "events_pace_groups_order_idx" ON "events_pace_groups" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_pace_groups_parent_id_idx" ON "events_pace_groups" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "events_cover_image_idx" ON "events" USING btree ("cover_image_id");
  CREATE INDEX IF NOT EXISTS "events_date_idx" ON "events" USING btree ("date");
  CREATE INDEX IF NOT EXISTS "events_status_idx" ON "events" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "events_is_published_idx" ON "events" USING btree ("is_published");
  CREATE INDEX IF NOT EXISTS "events_is_featured_idx" ON "events" USING btree ("is_featured");
  CREATE INDEX IF NOT EXISTS "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "club_members_email_idx" ON "club_members" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "club_members_student_id_idx" ON "club_members" USING btree ("student_id");
  CREATE INDEX IF NOT EXISTS "club_members_status_idx" ON "club_members" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "club_members_updated_at_idx" ON "club_members" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "club_members_created_at_idx" ON "club_members" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "event_registrations_event_idx" ON "event_registrations" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "event_registrations_member_idx" ON "event_registrations" USING btree ("member_id");
  CREATE INDEX IF NOT EXISTS "event_registrations_email_idx" ON "event_registrations" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "event_registrations_status_idx" ON "event_registrations" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "event_registrations_updated_at_idx" ON "event_registrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "event_registrations_created_at_idx" ON "event_registrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "partners_is_published_idx" ON "partners" USING btree ("is_published");
  CREATE INDEX IF NOT EXISTS "partners_sort_order_idx" ON "partners" USING btree ("sort_order");
  CREATE INDEX IF NOT EXISTS "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_club_members_id_idx" ON "payload_locked_documents_rels" USING btree ("club_members_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_event_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("event_registrations_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "users_sessions" CASCADE;
  DROP TABLE IF EXISTS "users" CASCADE;
  DROP TABLE IF EXISTS "media" CASCADE;
  DROP TABLE IF EXISTS "events_pace_groups" CASCADE;
  DROP TABLE IF EXISTS "events" CASCADE;
  DROP TABLE IF EXISTS "club_members" CASCADE;
  DROP TABLE IF EXISTS "event_registrations" CASCADE;
  DROP TABLE IF EXISTS "partners" CASCADE;
  DROP TABLE IF EXISTS "payload_kv" CASCADE;
  DROP TABLE IF EXISTS "payload_locked_documents" CASCADE;
  DROP TABLE IF EXISTS "payload_locked_documents_rels" CASCADE;
  DROP TABLE IF EXISTS "payload_preferences" CASCADE;
  DROP TABLE IF EXISTS "payload_preferences_rels" CASCADE;
  DROP TABLE IF EXISTS "payload_migrations" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_users_role";
  DROP TYPE IF EXISTS "public"."enum_events_event_type";
  DROP TYPE IF EXISTS "public"."enum_events_status";
  DROP TYPE IF EXISTS "public"."enum_club_members_experience_level";
  DROP TYPE IF EXISTS "public"."enum_club_members_status";
  DROP TYPE IF EXISTS "public"."enum_event_registrations_status";
  DROP TYPE IF EXISTS "public"."enum_partners_tier";
  `)
}
