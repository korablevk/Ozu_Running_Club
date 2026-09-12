import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { rateLimit } from "@/lib/rateLimit";

const VALID_ROLES = ["undergraduate", "graduate", "alumni", "staff"] as const;
const VALID_EXPERIENCES = ["beginner", "intermediate", "advanced"] as const;
const VALID_STREAMS = [
  "campus_social",
  "track_interval",
  "city_social",
  "trail_nature",
  "race_competition",
] as const;

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting by IP
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const limiter = rateLimit(`join_${ip}`, 10, 15 * 60 * 1000); // 10 attempts per 15 min

    if (!limiter.success) {
      return NextResponse.json(
        {
          error: "Too many membership applications from this network. Please try again later.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    // 2. Request body validation
    const rawBody = await req.text();
    if (rawBody.length > 32 * 1024) {
      // 32KB max
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

    const {
      fullName,
      email,
      studentId,
      phone,
      faculty,
      studentRole = "undergraduate",
      experienceLevel = "beginner",
      preferredStreams = ["campus_social"],
      weeklyKmTarget,
      motivation,
    } = body;

    // Field validations
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2 || fullName.trim().length > 100) {
      return NextResponse.json(
        { error: "Full name is required and must be between 2 and 100 characters.", code: "INVALID_NAME" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim()) || email.trim().length > 150) {
      return NextResponse.json(
        { error: "A valid email address is required (e.g. name.surname@ozu.edu.tr).", code: "INVALID_EMAIL" },
        { status: 400 }
      );
    }

    if (!studentId || typeof studentId !== "string" || studentId.trim().length < 3 || studentId.trim().length > 20) {
      return NextResponse.json(
        { error: "Student ID is required and must be between 3 and 20 characters.", code: "INVALID_STUDENT_ID" },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || phone.trim().length < 7 || phone.trim().length > 25) {
      return NextResponse.json(
        { error: "A valid phone number is required.", code: "INVALID_PHONE" },
        { status: 400 }
      );
    }

    if (!faculty || typeof faculty !== "string" || faculty.trim().length < 2 || faculty.trim().length > 100) {
      return NextResponse.json(
        { error: "Faculty / Major is required.", code: "INVALID_FACULTY" },
        { status: 400 }
      );
    }

    const validRole = VALID_ROLES.includes(studentRole) ? studentRole : "undergraduate";
    const validExp = VALID_EXPERIENCES.includes(experienceLevel) ? experienceLevel : "beginner";
    const validStreams = Array.isArray(preferredStreams)
      ? preferredStreams.filter((s: string) => (VALID_STREAMS as readonly string[]).includes(s))
      : ["campus_social"];

    // 3. Normalization
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedStudentId = studentId.trim().toUpperCase();
    const normalizedFullName = fullName.trim();
    const normalizedPhone = phone.trim();
    const normalizedFaculty = faculty.trim();

    // 4. Duplicate policy verification via Payload Local API
    const payload = await getPayload({ config: configPromise });

    const existing = await payload.find({
      collection: "club-members",
      where: {
        or: [
          { email: { equals: normalizedEmail } },
          { studentId: { equals: normalizedStudentId } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.docs.length > 0) {
      const existingMember = existing.docs[0];
      switch (existingMember.status) {
        case "pending":
          return NextResponse.json(
            {
              error: "An application with this email or student ID is already pending review.",
              code: "DUPLICATE_PENDING",
            },
            { status: 409 }
          );
        case "active":
          return NextResponse.json(
            {
              error: "A member with this email or student ID is already an active club member.",
              code: "ALREADY_ACTIVE",
            },
            { status: 409 }
          );
        case "rejected":
          return NextResponse.json(
            {
              error:
                "A previous application with this email or student ID was rejected. Please contact the board at running@ozu.edu.tr for re-application review.",
              code: "PREVIOUSLY_REJECTED",
            },
            { status: 409 }
          );
        case "inactive":
        case "alumni":
          return NextResponse.json(
            {
              error:
                "This student ID or email is registered in club records as inactive/alumni. Please contact the board at running@ozu.edu.tr to reactivate your membership.",
              code: "INACTIVE_OR_ALUMNI",
            },
            { status: 409 }
          );
        default:
          return NextResponse.json(
            {
              error: "A membership record with this email or student ID already exists.",
              code: "DUPLICATE_MEMBER",
            },
            { status: 409 }
          );
      }
    }

    // 5. Create ClubMember record with status: pending
    const createdMember = await payload.create({
      collection: "club-members",
      overrideAccess: true,
      data: {
        fullName: normalizedFullName,
        email: normalizedEmail,
        studentId: normalizedStudentId,
        phone: normalizedPhone,
        faculty: normalizedFaculty,
        studentRole: validRole,
        experienceLevel: validExp,
        preferredStreams: validStreams,
        weeklyKmTarget: typeof weeklyKmTarget === "string" ? weeklyKmTarget.slice(0, 50) : undefined,
        motivation: typeof motivation === "string" ? motivation.slice(0, 1000) : undefined,
        status: "pending",
      },
    });

    // 6. Return safe public response
    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully. Your profile is pending verification.",
        data: {
          id: createdMember.id,
          fullName: createdMember.fullName,
          status: "pending",
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting join application:", error);
    return NextResponse.json(
      {
        error: error?.message || "An unexpected error occurred while processing your application. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
