import type { CollectionConfig } from "payload";

export const ClubMembers: CollectionConfig = {
  slug: "club-members",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "email", "studentId", "status", "createdAt"],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.email && typeof data.email === "string") {
          data.email = data.email.trim().toLowerCase();
        }
        if (data?.studentId && typeof data.studentId === "string") {
          data.studentId = data.studentId.trim();
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
      name: "motivation",
      type: "textarea",
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
