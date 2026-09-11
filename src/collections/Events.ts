import type { CollectionConfig } from "payload";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "eventType", "date", "status", "isPublished", "isFeatured"],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return {
        isPublished: {
          equals: true,
        },
      };
    },
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
      index: true,
    },
    {
      name: "eventType",
      type: "select",
      required: true,
      defaultValue: "campus_social",
      options: [
        { label: "Campus Social", value: "campus_social" },
        { label: "Track & Speed", value: "track_interval" },
        { label: "City Social", value: "city_long" },
        { label: "Trail & Nature", value: "trail_nature" },
        { label: "Race Preparation", value: "race_competition" },
      ],
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "date",
      type: "date",
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
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
      name: "registrationDeadline",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
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
      name: "estimatedDuration",
      type: "text",
      defaultValue: "60 min",
    },
    {
      name: "maxParticipants",
      type: "number",
      required: true,
      defaultValue: 40,
    },
    {
      name: "isRegistrationEnabled",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "scheduled",
      index: true,
      options: [
        { label: "Scheduled", value: "scheduled" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    {
      name: "isPublished",
      type: "checkbox",
      defaultValue: true,
      index: true,
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false,
      index: true,
    },
    {
      name: "paceGroups",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "targetPace", type: "text", required: true },
        { name: "pacer", type: "text", required: true },
        { name: "capacity", type: "number" },
      ],
    },
  ],
};
