import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "event_registrations_active_unique_idx"
    ON "event_registrations" ("event_id", lower("email"))
    WHERE "status" != 'cancelled';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "event_registrations_active_unique_idx";
  `);
}
