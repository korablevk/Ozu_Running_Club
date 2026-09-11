import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Events } from "./collections/Events";
import { ClubMembers } from "./collections/ClubMembers";
import { EventRegistrations } from "./collections/EventRegistrations";
import { Partners } from "./collections/Partners";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Events, ClubMembers, EventRegistrations, Partners],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "8f83c18c7e92384a6b29d891b988f910",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URI ||
        "postgres://postgres:ozu_running_secret@127.0.0.1:5433/ozu_running_db",
    },
  }),
  sharp,
});
