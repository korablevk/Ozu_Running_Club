import type { CollectionConfig } from "payload";
import { isAdmin, isAuthenticated, isAdminOrSelf, isAdminField } from "@/lib/access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role", "createdAt"],
    group: "Administration",
    hidden: ({ user }) => user?.role !== "admin",
  },
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    admin: isAuthenticated,
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
        update: isAdminField,
      },
    },
  ],
};
