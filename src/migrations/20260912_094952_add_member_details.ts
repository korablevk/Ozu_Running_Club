import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_club_members_student_role" AS ENUM('undergraduate', 'graduate', 'alumni', 'staff');
  ALTER TABLE "club_members" ADD COLUMN "student_role" "enum_club_members_student_role" DEFAULT 'undergraduate';
  ALTER TABLE "club_members" ADD COLUMN "preferred_streams" jsonb;
  ALTER TABLE "club_members" ADD COLUMN "weekly_km_target" varchar;
  ALTER TABLE "club_members" ADD COLUMN "admin_notes" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "club_members" DROP COLUMN "student_role";
  ALTER TABLE "club_members" DROP COLUMN "preferred_streams";
  ALTER TABLE "club_members" DROP COLUMN "weekly_km_target";
  ALTER TABLE "club_members" DROP COLUMN "admin_notes";
  DROP TYPE "public"."enum_club_members_student_role";`)
}
