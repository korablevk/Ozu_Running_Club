import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role", "createdAt"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "admin",
      options: [
        {
          label: "Admin (Club President / Lead)",
          value: "admin",
        },
        {
          label: "Editor (Content / Event Manager)",
          value: "editor",
        },
      ],
      access: {
        // Only admins can change user roles
        update: ({ req: { user } }) => user?.role === "admin",
      },
    },
  ],
};
