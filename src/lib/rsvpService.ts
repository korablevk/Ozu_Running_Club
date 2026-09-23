import type { Pool, PoolClient } from "pg";

export class RSVPServiceError extends Error {
  code: string;
  statusCode: number;
  registrationStatus?: string;

  constructor(
    message: string,
    code: string,
    statusCode: number = 400,
    registrationStatus?: string
  ) {
    super(message);
    this.name = "RSVPServiceError";
    this.code = code;
    this.statusCode = statusCode;
    this.registrationStatus = registrationStatus;
  }
}

export interface AtomicRSVPInput {
  pool: Pool;
  eventId: number;
  memberId?: number | null;
  fullName: string;
  email: string;
  studentId?: string | null;
  phone?: string | null;
  paceGroup: string;
}

export interface AtomicRSVPResult {
  registrationId: number;
  status: "confirmed" | "waitlist";
  confirmedCount: number;
  maxCapacity: number;
  spotsRemaining: number;
  eventTitle: string;
  eventDate: string;
  meetingPoint: string;
}

/**
 * Executes an atomic, transaction-safe RSVP registration.
 *
 * Concurrency Safety Guarantees:
 * 1. Uses PostgreSQL row-level exclusive locking (`SELECT ... FOR UPDATE` on the events row)
 *    to serialize concurrent reservation requests for the same event in arrival order.
 * 2. Guaranteed capacity invariant: confirmedCount <= maxParticipants under all burst loads.
 * 3. Atomic duplicate check inside the lock prevents double-submissions.
 * 4. Engine-level defense-in-depth: catches PostgreSQL unique violation (code 23505) from
 *    event_registrations_active_unique_idx.
 */
export async function executeAtomicRSVP(
  input: AtomicRSVPInput
): Promise<AtomicRSVPResult> {
  const { pool, eventId, memberId, fullName, email, studentId, phone, paceGroup } = input;
  const client: PoolClient = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Lock the event row for UPDATE
    // This serializes any concurrent RSVP attempts for this specific event in arrival order.
    const eventRes = await client.query(
      `SELECT id, title, slug, date, meeting_point, status, is_published, 
              is_registration_enabled, registration_deadline, max_participants 
       FROM events 
       WHERE id = $1 
       FOR UPDATE`,
      [eventId]
    );

    if (eventRes.rows.length === 0) {
      await client.query("ROLLBACK");
      throw new RSVPServiceError("Event not found.", "EVENT_NOT_FOUND", 404);
    }

    const event = eventRes.rows[0];

    // Lifecycle checks inside the row lock
    if (!event.is_published) {
      await client.query("ROLLBACK");
      throw new RSVPServiceError(
        "Registration is not open for this event.",
        "EVENT_NOT_PUBLISHED",
        404
      );
    }

    if (event.status === "cancelled") {
      await client.query("ROLLBACK");
      throw new RSVPServiceError(
        "Registration is closed because this event has been cancelled.",
        "EVENT_CANCELLED",
        400
      );
    }

    if (event.status === "completed") {
      await client.query("ROLLBACK");
      throw new RSVPServiceError(
        "Registration is closed because this event has already taken place.",
        "EVENT_COMPLETED",
        400
      );
    }

    if (event.is_registration_enabled === false) {
      await client.query("ROLLBACK");
      throw new RSVPServiceError(
        "Registration is currently disabled for this event.",
        "REGISTRATION_DISABLED",
        400
      );
    }

    if (event.registration_deadline) {
      const deadline = new Date(event.registration_deadline);
      if (new Date() > deadline) {
        await client.query("ROLLBACK");
        throw new RSVPServiceError(
          "Registration deadline for this event has passed.",
          "DEADLINE_EXPIRED",
          400
        );
      }
    }

    // 2. Check for duplicate active registration inside the lock
    const dupRes = await client.query(
      `SELECT id, status 
       FROM event_registrations 
       WHERE event_id = $1 AND LOWER(email) = LOWER($2) AND status != 'cancelled'
       LIMIT 1`,
      [eventId, email]
    );

    if (dupRes.rows.length > 0) {
      await client.query("ROLLBACK");
      const currentReg = dupRes.rows[0];
      throw new RSVPServiceError(
        `You already have an active registration (${currentReg.status}) for this event.`,
        "DUPLICATE_REGISTRATION",
        409,
        currentReg.status
      );
    }

    // 3. Count confirmed occupancy inside the lock
    const countRes = await client.query(
      `SELECT COUNT(*)::int AS count 
       FROM event_registrations 
       WHERE event_id = $1 AND status IN ('confirmed', 'attended')`,
      [eventId]
    );

    const confirmedCount: number = countRes.rows[0].count;
    const maxCapacity: number =
      typeof event.max_participants === "number"
        ? event.max_participants
        : parseFloat(event.max_participants) || 40;

    const resolvedStatus: "confirmed" | "waitlist" =
      confirmedCount < maxCapacity ? "confirmed" : "waitlist";

    // 4. Insert registration record inside the lock
    const insertRes = await client.query(
      `INSERT INTO event_registrations (
         event_id, member_id, full_name, email, student_id, phone, pace_group, status, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING id`,
      [
        eventId,
        memberId || null,
        fullName,
        email,
        studentId || null,
        phone || null,
        paceGroup,
        resolvedStatus,
      ]
    );

    await client.query("COMMIT");

    const newConfirmedCount =
      confirmedCount + (resolvedStatus === "confirmed" ? 1 : 0);
    const spotsRemaining = Math.max(0, maxCapacity - newConfirmedCount);

    return {
      registrationId: insertRes.rows[0].id,
      status: resolvedStatus,
      confirmedCount: newConfirmedCount,
      maxCapacity,
      spotsRemaining,
      eventTitle: event.title,
      eventDate:
        event.date instanceof Date
          ? event.date.toISOString()
          : String(event.date),
      meetingPoint: event.meeting_point,
    };
  } catch (error: any) {
    await client.query("ROLLBACK").catch(() => {});
    if (error?.code === "23505") {
      throw new RSVPServiceError(
        "You already have an active registration for this event.",
        "DUPLICATE_REGISTRATION",
        409,
        "confirmed"
      );
    }
    throw error;
  } finally {
    client.release();
  }
}
