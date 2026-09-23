import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { rateLimit } from "@/lib/rateLimit";
import { executeAtomicRSVP, RSVPServiceError } from "@/lib/rsvpService";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // 1. Rate limiting by IP
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const limiter = rateLimit(`rsvp_${ip}`, 15, 15 * 60 * 1000); // 15 RSVPs per 15 min

    if (!limiter.success) {
      return NextResponse.json(
        {
          error: "Too many registration attempts from this network. Please wait a few minutes.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    // 2. Request size & body parsing
    const rawBody = await req.text();
    if (rawBody.length > 32 * 1024) {
      return NextResponse.json(
        { error: "Request payload too large.", code: "PAYLOAD_TOO_LARGE" },
        { status: 413 }
      );
    }

    let body: Record<string, any>;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON format in request body.", code: "INVALID_JSON" },
        { status: 400 }
      );
    }

    const { fullName, email, studentId, phone, paceGroup } = body;

    // 3. Field shape validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2 || fullName.trim().length > 100) {
      return NextResponse.json(
        { error: "Full name is required and must be between 2 and 100 characters.", code: "INVALID_NAME" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim()) || email.trim().length > 150) {
      return NextResponse.json(
        { error: "A valid email address is required (e.g. name@ozyegin.edu.tr).", code: "INVALID_EMAIL" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedFullName = fullName.trim();
    const normalizedStudentId = studentId && typeof studentId === "string" ? studentId.trim().toUpperCase() : "";
    const normalizedPhone = phone && typeof phone === "string" ? phone.trim() : "";

    const payload = await getPayload({ config: configPromise });

    // 4. Load event from DB and verify lifecycle
    const eventQuery = await payload.find({
      collection: "events",
      where: {
        slug: { equals: slug },
      },
      limit: 1,
      overrideAccess: true,
    });

    if (eventQuery.docs.length === 0) {
      return NextResponse.json(
        { error: "Event not found.", code: "EVENT_NOT_FOUND" },
        { status: 404 }
      );
    }

    const event = eventQuery.docs[0];

    // Check publication status
    if (!event.isPublished) {
      return NextResponse.json(
        { error: "Registration is not open for this event.", code: "EVENT_NOT_PUBLISHED" },
        { status: 404 }
      );
    }

    // Check lifecycle status
    if (event.status === "cancelled") {
      return NextResponse.json(
        { error: "Registration is closed because this event has been cancelled.", code: "EVENT_CANCELLED" },
        { status: 400 }
      );
    }

    if (event.status === "completed") {
      return NextResponse.json(
        { error: "Registration is closed because this event has already taken place.", code: "EVENT_COMPLETED" },
        { status: 400 }
      );
    }

    // Check if registration is explicitly disabled
    if (event.isRegistrationEnabled === false) {
      return NextResponse.json(
        { error: "Registration is currently disabled for this event.", code: "REGISTRATION_DISABLED" },
        { status: 400 }
      );
    }

    // Check registration deadline
    if (event.registrationDeadline) {
      const deadline = new Date(event.registrationDeadline);
      if (new Date() > deadline) {
        return NextResponse.json(
          { error: "Registration deadline for this event has passed.", code: "DEADLINE_EXPIRED" },
          { status: 400 }
        );
      }
    }

    // Pace pack validation
    let validPaceGroup = paceGroup;
    if (Array.isArray(event.paceGroups) && event.paceGroups.length > 0) {
      const allowedNames = event.paceGroups.map((pg: any) => pg.name);
      if (!paceGroup || !allowedNames.includes(paceGroup)) {
        return NextResponse.json(
          {
            error: `Please select a valid pace pack for this event. Options: ${allowedNames.join(", ")}`,
            code: "INVALID_PACE_GROUP",
          },
          { status: 400 }
        );
      }
      validPaceGroup = paceGroup;
    } else {
      validPaceGroup = paceGroup || "Open Pace";
    }

    // 5. Optional member linking
    const memberQuery = await payload.find({
      collection: "club-members",
      where: {
        email: { equals: normalizedEmail },
      },
      limit: 1,
      overrideAccess: true,
    });

    const linkedMemberId = memberQuery.docs.length > 0 ? memberQuery.docs[0].id : undefined;

    // 6. Atomic, transaction-safe RSVP execution
    // Uses row-level exclusive lock on the events record to eliminate concurrency race conditions.
    const pool = (payload.db as any).pool;
    const result = await executeAtomicRSVP({
      pool,
      eventId: Number(event.id),
      memberId: linkedMemberId ? Number(linkedMemberId) : null,
      fullName: normalizedFullName,
      email: normalizedEmail,
      studentId: normalizedStudentId || null,
      phone: normalizedPhone || null,
      paceGroup: validPaceGroup,
    });

    // 7. Return confirmation response
    return NextResponse.json(
      {
        success: true,
        status: result.status,
        message:
          result.status === "confirmed"
            ? `RSVP Confirmed! You are registered for ${result.eventTitle}.`
            : `Event is at full capacity (${result.maxCapacity}/${result.maxCapacity}). You have been added to the priority waitlist.`,
        data: {
          id: result.registrationId,
          status: result.status,
          eventTitle: result.eventTitle,
          eventDate: result.eventDate,
          meetingPoint: result.meetingPoint,
          paceGroup: validPaceGroup,
          spotsRemaining: result.spotsRemaining,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof RSVPServiceError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          ...(error.registrationStatus ? { status: error.registrationStatus } : {}),
        },
        { status: error.statusCode }
      );
    }

    console.error("Error processing event RSVP:", error);
    return NextResponse.json(
      {
        error: error?.message || "An unexpected error occurred while processing your RSVP. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
