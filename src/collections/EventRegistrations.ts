import type { CollectionConfig } from "payload";
import { APIError } from "payload";

export const EventRegistrations: CollectionConfig = {
  slug: "event-registrations",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "email", "event", "paceGroup", "status", "createdAt"],
    group: "Activities & Events",
  },
  defaultSort: "-createdAt",
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, operation, originalDoc }) => {
        if (!data) return data;

        if (data.email && typeof data.email === "string") {
          data.email = data.email.trim().toLowerCase();
        }
        if (data.studentId && typeof data.studentId === "string") {
          data.studentId = data.studentId.trim().toUpperCase();
        }
        if (data.fullName && typeof data.fullName === "string") {
          data.fullName = data.fullName.trim();
        }
        if (data.phone && typeof data.phone === "string") {
          data.phone = data.phone.trim();
        }

        // Duplicate invariant: one active registration per event + normalized email
        const targetEvent = data.event || originalDoc?.event;
        const targetEmail = data.email || originalDoc?.email;
        const targetStatus = data.status || originalDoc?.status || "confirmed";

        // Only enforce if registration is active (not cancelled)
        if (targetEvent && targetEmail && targetStatus !== "cancelled") {
          const eventId = typeof targetEvent === "object" ? targetEvent.id : targetEvent;
          const currentDocId = originalDoc?.id;

          const existing = await req.payload.find({
            collection: "event-registrations",
            where: {
              and: [
                { event: { equals: eventId } },
                { email: { equals: targetEmail } },
                { status: { not_equals: "cancelled" } },
                ...(currentDocId ? [{ id: { not_equals: currentDocId } }] : []),
              ],
            },
            limit: 1,
            depth: 0,
            overrideAccess: true,
          });

          if (existing.totalDocs > 0) {
            throw new APIError(`An active registration already exists for ${targetEmail} for this event.`, 400);
          }
        }

        return data;
      },
    ],
  },
  fields: [
    {
      name: "event",
      type: "relationship",
      relationTo: "events",
      required: true,
      index: true,
    },
    {
      name: "member",
      type: "relationship",
      relationTo: "club-members",
      index: true,
    },
    {
      name: "fullName",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
      index: true,
    },
    {
      name: "studentId",
      type: "text",
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "paceGroup",
      type: "text",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "confirmed",
      index: true,
      options: [
        { label: "Confirmed", value: "confirmed" },
        { label: "Waitlist", value: "waitlist" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Attended", value: "attended" },
        { label: "No Show", value: "no_show" },
      ],
    },
  ],
};
