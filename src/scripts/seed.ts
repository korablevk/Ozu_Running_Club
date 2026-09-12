import config from "../payload.config.js";
import { getPayload } from "payload";
import { RUNNING_EVENTS, PARTNERS } from "../lib/data.js";

const TIER_MAPPING: Record<string, "title_gear" | "university" | "trail_alliance" | "nutrition"> = {
  "Title Partner": "title_gear",
  "Gear Sponsor": "trail_alliance",
  "Nutrition & Hydration": "nutrition",
  "University Directorate": "university",
};

export async function seed() {
  console.log("🌱 Starting ÖzÜ Running Club database seed...");
  const payload = await getPayload({ config });

  // 1. Seed Partners
  console.log("--- Seeding Partners ---");
  for (let i = 0; i < PARTNERS.length; i++) {
    const p = PARTNERS[i];
    const existing = await payload.find({
      collection: "partners",
      where: {
        name: { equals: p.name },
      },
      limit: 1,
    });

    if (existing.totalDocs === 0) {
      const created = await payload.create({
        collection: "partners",
        data: {
          name: p.name,
          tier: TIER_MAPPING[p.tier] || "title_gear",
          websiteUrl: p.websiteUrl,
          perkDescription: p.perkDescription,
          discountCode: p.discountCode || "",
          isPublished: true,
          sortOrder: i + 1,
        },
      });
      console.log(`✅ Partner created: ${created.name}`);
    } else {
      console.log(`ℹ️ Partner already exists: ${p.name}`);
    }
  }

  // 2. Seed Events
  console.log("--- Seeding Events ---");
  for (const ev of RUNNING_EVENTS) {
    const existing = await payload.find({
      collection: "events",
      where: {
        slug: { equals: ev.slug },
      },
      limit: 1,
    });

    if (existing.totalDocs === 0) {
      const paceGroups = (ev.paceGroups || []).map((pg) => ({
        name: pg.name,
        targetPace: pg.pace,
        pacer: pg.pacer,
        capacity: 15,
      }));

      const created = await payload.create({
        collection: "events",
        data: {
          title: ev.title,
          slug: ev.slug,
          eventType: ev.type,
          description: ev.description,
          date: ev.date,
          meetingPoint: ev.meetingPoint,
          googleMapsUrl: ev.googleMapsUrl,
          distanceKm: ev.distanceKm,
          elevationGainM: ev.elevationGainM,
          targetPace: ev.targetPace,
          estimatedDuration: `${ev.estimatedDurationMin} min`,
          maxParticipants: ev.maxParticipants,
          isRegistrationEnabled: true,
          status: "scheduled",
          isPublished: true,
          isFeatured: Boolean(ev.isFeatured),
          paceGroups,
        },
      });
      console.log(`✅ Event created: ${created.title} (${created.slug})`);
    } else {
      console.log(`ℹ️ Event already exists: ${ev.title}`);
    }
  }

  console.log("✨ Seeding completed successfully!");
}

// Allow direct execution
if (process.argv[1]?.endsWith("seed.ts") || process.argv[1]?.endsWith("seed.js")) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seed failed:", err);
      process.exit(1);
    });
}
