import type { CollectionConfig } from "payload";

export const Partners: CollectionConfig = {
  slug: "partners",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "tier", "websiteUrl", "isPublished", "sortOrder"],
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
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "tier",
      type: "select",
      required: true,
      defaultValue: "title_gear",
      options: [
        { label: "Title Gear Partner", value: "title_gear" },
        { label: "University Body", value: "university" },
        { label: "Regional Trail Alliance", value: "trail_alliance" },
        { label: "Hydration & Nutrition", value: "nutrition" },
      ],
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
    {
      name: "isPublished",
      type: "checkbox",
      defaultValue: true,
      index: true,
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
      index: true,
    },
  ],
};
