export const PartnersCollection = {
  slug: "partners",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "tier", "websiteUrl", "discountCode"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "tier",
      type: "select",
      options: [
        { label: "Title Gear Partner", value: "title_gear" },
        { label: "University Body", value: "university" },
        { label: "Regional Trail Alliance", value: "trail_alliance" },
        { label: "Hydration & Nutrition", value: "nutrition" },
      ],
      defaultValue: "title_gear",
    },
    {
      name: "websiteUrl",
      type: "text",
      required: true,
    },
    {
      name: "perkDescription",
      type: "textarea",
      required: true,
    },
    {
      name: "discountCode",
      type: "text",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
  ],
};
