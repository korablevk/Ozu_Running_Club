import type { CollectionConfig } from "payload";
import { APIError } from "payload";

export const ClubMembers: CollectionConfig = {
  slug: "club-members",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "email", "studentId", "faculty", "experienceLevel", "status", "createdAt"],
    group: "Community",
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
      async ({ data, req, operation }) => {
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

        // Duplicate policy check on new membership applications
        if (operation === "create" && data.email && data.studentId) {
          const existing = await req.payload.find({
            collection: "club-members",
            where: {
              or: [
                { email: { equals: data.email } },
                { studentId: { equals: data.studentId } },
              ],
            },
            limit: 1,
            overrideAccess: true,
          });

          if (existing.docs.length > 0) {
            const member = existing.docs[0];
            switch (member.status) {
              case "pending":
                throw new APIError(
                  "An application with this email or student ID is already pending review.",
                  400
                );
              case "active":
                throw new APIError(
                  "A member with this email or student ID is already an active club member.",
                  400
                );
              case "rejected":
                throw new APIError(
                  "A previous application with this email or student ID was rejected. Please contact running@ozu.edu.tr for inquiry.",
                  400
                );
              case "inactive":
              case "alumni":
                throw new APIError(
                  "This student ID or email is already registered in club records as inactive/alumni. Please contact running@ozu.edu.tr to reactivate your membership.",
                  400
                );
              default:
                throw new APIError(
                  "A membership record with this email or student ID already exists.",
                  400
                );
            }
          }
        }

        return data;
      },
    ],
  },
  fields: [
    {
      name: "fullName",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "studentId",
      type: "text",
      required: true,
      index: true,
    },
    {
      name: "phone",
      type: "text",
      required: true,
    },
    {
      name: "faculty",
      type: "text",
      required: true,
    },
    {
      name: "studentRole",
      type: "select",
      defaultValue: "undergraduate",
      options: [
        { label: "Undergraduate Student", value: "undergraduate" },
        { label: "Graduate / Master's / PhD", value: "graduate" },
        { label: "ÖzÜ Alumni", value: "alumni" },
        { label: "Faculty / Staff", value: "staff" },
      ],
    },
    {
      name: "experienceLevel",
      type: "select",
      required: true,
      defaultValue: "beginner",
      options: [
        { label: "Couch to 5K (Beginner)", value: "beginner" },
        { label: "Regular 5-10K (Intermediate)", value: "intermediate" },
        { label: "Half / Full Marathon (Advanced)", value: "advanced" },
      ],
    },
    {
      name: "preferredStreams",
      type: "json",
    },
    {
      name: "weeklyKmTarget",
      type: "text",
    },
    {
      name: "motivation",
      type: "textarea",
    },
    {
      name: "adminNotes",
      type: "textarea",
      admin: {
        description: "Internal staff/board notes (not visible to applicant)",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      index: true,
      options: [
        { label: "Pending Approval", value: "pending" },
        { label: "Active Member", value: "active" },
        { label: "Rejected", value: "rejected" },
        { label: "Inactive", value: "inactive" },
        { label: "Alumni", value: "alumni" },
      ],
    },
  ],
};
