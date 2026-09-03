export const ClubMembersCollection = {
  slug: "club-members",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "email", "faculty", "experienceLevel", "createdAt"],
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
    },
    {
      name: "studentId",
      type: "text",
      required: true,
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
      options: [
        { label: "Couch to 5K (Beginner)", value: "beginner" },
        { label: "Regular 5-10K (Intermediate)", value: "intermediate" },
        { label: "Half / Full Marathon (Advanced)", value: "advanced" },
      ],
      defaultValue: "beginner",
    },
    {
      name: "motivation",
      type: "textarea",
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Active Member", value: "active" },
        { label: "Alumni Member", value: "alumni" },
        { label: "Inactive", value: "inactive" },
      ],
      defaultValue: "active",
    },
  ],
};
