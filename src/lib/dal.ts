import config from "@payload-config";
import { getPayload } from "payload";
import type { RunningEvent, Partner } from "@/lib/data";

let cachedPayload: any = null;

export async function getPayloadClient() {
  if (!cachedPayload) {
    cachedPayload = await getPayload({ config });
  }
  return cachedPayload;
}

const TYPE_LABELS: Record<string, string> = {
  campus_social: "Campus Social",
  track_interval: "Track & Speed",
  city_long: "City Social",
  trail_nature: "Trail & Nature",
  race_competition: "Race Preparation",
};

const PARTNER_TIER_LABELS: Record<string, Partner["tier"]> = {
  title_gear: "Title Partner",
  university: "University Directorate",
  trail_alliance: "Gear Sponsor",
  nutrition: "Nutrition & Hydration",
};

/**
 * Format an ISO date string into displayDate (e.g. "Thu, Oct 15") and time (e.g. "07:30")
 * using Europe/Istanbul timezone.
 */
function formatEventDateTime(isoDate: string) {
  const d = new Date(isoDate);
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  });
  const displayDate = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "Europe/Istanbul",
  });
  return { time, displayDate };
}

/**
 * Count active registrations for an event (confirmed, attended, no_show consume capacity).
 * Cancelled and waitlisted records do NOT consume capacity.
 */
async function getEventRegistrationStats(payload: any, eventId: number | string) {
  const result = await payload.find({
    collection: "event-registrations",
    where: {
      and: [
        { event: { equals: eventId } },
        { status: { in: ["confirmed", "attended", "no_show"] } },
      ],
    },
    limit: 500,
    depth: 0,
  });

  const activeRegistrations = result.docs || [];
  const registeredCount = result.totalDocs;

  // Count per pace group
  const paceGroupCounts: Record<string, number> = {};
  for (const reg of activeRegistrations) {
    if (reg.paceGroup) {
      paceGroupCounts[reg.paceGroup] = (paceGroupCounts[reg.paceGroup] || 0) + 1;
    }
  }

  return { registeredCount, paceGroupCounts };
}

/**
 * Maps a Payload event doc to the RunningEvent interface expected by existing UI components.
 */
function mapEventDocToRunningEvent(
  doc: any,
  registeredCount: number,
  paceGroupCounts: Record<string, number>
): RunningEvent {
  const { time, displayDate } = formatEventDateTime(doc.date);

  let coverImageUrl = "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1600&q=85";
  if (doc.coverImage) {
    if (typeof doc.coverImage === "object" && doc.coverImage.url) {
      coverImageUrl = doc.coverImage.url;
    } else if (typeof doc.coverImage === "string") {
      coverImageUrl = doc.coverImage;
    }
  }

  const durationMatch = (doc.estimatedDuration || "").match(/\d+/);
  const estimatedDurationMin = durationMatch ? parseInt(durationMatch[0], 10) : 60;

  const paceGroups = (doc.paceGroups || []).map((pg: any) => {
    const groupRegistered = paceGroupCounts[pg.name] || 0;
    const groupCapacity = pg.capacity ? Number(pg.capacity) : 15;
    const slotsRemaining = Math.max(0, groupCapacity - groupRegistered);

    return {
      name: pg.name,
      pacer: pg.pacer,
      pace: pg.targetPace || "5:30",
      slotsRemaining,
    };
  });

  return {
    id: String(doc.id),
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.description ? doc.description.slice(0, 120) + "..." : "ÖzÜ Running Club official weekly run session.",
    type: doc.eventType || "campus_social",
    typeLabel: TYPE_LABELS[doc.eventType] || "Campus Social",
    date: doc.date,
    displayDate,
    time,
    meetingPoint: doc.meetingPoint,
    googleMapsUrl: doc.googleMapsUrl || "https://maps.google.com/?q=Ozyegin+University",
    distanceKm: Number(doc.distanceKm) || 5,
    elevationGainM: Number(doc.elevationGainM) || 0,
    estimatedDurationMin,
    targetPace: doc.targetPace || "5:30 - 6:00 /km",
    maxParticipants: Number(doc.maxParticipants) || 40,
    registeredCount,
    coverImage: coverImageUrl,
    routeMapImage: coverImageUrl,
    description: doc.description || "Official ÖzÜ Running Club session. Open to all students, alumni, and faculty.",
    schedule: [
      { time, activity: "Check-in & dynamic warmup at meeting point" },
      { time: "Warmup +10m", activity: "Pace pack split & group briefing" },
      { time: "Main Run", activity: `Main ${doc.distanceKm} KM run session` },
      { time: "Cooldown", activity: "Post-run mobility, stretching & coffee social" },
    ],
    paceGroups,
    isFeatured: Boolean(doc.isFeatured),
  };
}

/**
 * Maps a Payload partner doc to the Partner interface expected by existing UI components.
 */
function mapPartnerDocToPartner(doc: any): Partner {
  return {
    id: String(doc.id),
    name: doc.name,
    tier: PARTNER_TIER_LABELS[doc.tier] || "Title Partner",
    logoText: doc.name,
    websiteUrl: doc.websiteUrl,
    perkDescription: doc.perkDescription,
    discountCode: doc.discountCode || undefined,
  };
}

/**
 * Retrieves all published events from PostgreSQL via Payload Local API.
 * Sorts by date ascending.
 */
export async function getPublishedEvents(): Promise<RunningEvent[]> {
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "events",
    where: {
      isPublished: { equals: true },
    },
    sort: "date",
    limit: 100,
    depth: 1,
  });

  const events: RunningEvent[] = [];
  for (const doc of result.docs) {
    const { registeredCount, paceGroupCounts } = await getEventRegistrationStats(payload, doc.id);
    events.push(mapEventDocToRunningEvent(doc, registeredCount, paceGroupCounts));
  }

  return events;
}

/**
 * Retrieves a single published event by slug from PostgreSQL via Payload Local API.
 * Draft events return null for public callers.
 */
export async function getEventBySlug(slug: string): Promise<RunningEvent | null> {
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "events",
    where: {
      and: [
        { slug: { equals: slug } },
        { isPublished: { equals: true } },
      ],
    },
    limit: 1,
    depth: 1,
  });

  if (!result.docs || result.docs.length === 0) {
    return null;
  }

  const doc = result.docs[0];
  const { registeredCount, paceGroupCounts } = await getEventRegistrationStats(payload, doc.id);
  return mapEventDocToRunningEvent(doc, registeredCount, paceGroupCounts);
}

/**
 * Retrieves published partners from PostgreSQL via Payload Local API.
 * Sorts by sortOrder ascending.
 */
export async function getPublishedPartners(): Promise<Partner[]> {
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "partners",
    where: {
      isPublished: { equals: true },
    },
    sort: "sortOrder",
    limit: 50,
    depth: 1,
  });

  return (result.docs || []).map(mapPartnerDocToPartner);
}
