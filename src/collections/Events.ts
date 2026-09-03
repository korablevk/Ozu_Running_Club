export const EventsCollection = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "eventType", "date", "distanceKm", "status"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "eventType",
      type: "select",
      options: [
        { label: "Campus Social", value: "campus_social" },
        { label: "Track & Speed", value: "track_interval" },
        { label: "City Social", value: "city_long" },
        { label: "Trail & Nature", value: "trail_nature" },
        { label: "Race Preparation", value: "race_competition" },
      ],
      required: true,
      defaultValue: "campus_social",
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Upcoming (Open for RSVP)", value: "open_rsvp" },
        { label: "Capacity Full", value: "full" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
      defaultValue: "open_rsvp",
    },
    {
      name: "date",
      type: "date",
      required: true,
    },
    {
      name: "meetingPoint",
      type: "text",
      required: true,
      defaultValue: "ÖzÜ Athletic Center Steps",
    },
    {
      name: "googleMapsUrl",
      type: "text",
    },
    {
      name: "distanceKm",
      type: "number",
      required: true,
    },
    {
      name: "elevationGainM",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "targetPace",
      type: "text",
      defaultValue: "5:30 - 6:00 /km",
    },
    {
      name: "maxParticipants",
      type: "number",
      defaultValue: 40,
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "paceGroups",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "pacer", type: "text", required: true },
        { name: "pace", type: "text", required: true },
        { name: "slotsRemaining", type: "number", defaultValue: 10 },
      ],
    },
  ],
};
