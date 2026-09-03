export const EventRegistrationsCollection = {
  slug: "event-registrations",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "email", "event", "paceGroup", "createdAt"],
  },
  fields: [
    {
      name: "event",
      type: "relationship",
      relationTo: "events",
      required: true,
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
      options: [
        { label: "Confirmed", value: "confirmed" },
        { label: "Attended", value: "attended" },
        { label: "Cancelled", value: "cancelled" },
      ],
      defaultValue: "confirmed",
    },
  ],
};
