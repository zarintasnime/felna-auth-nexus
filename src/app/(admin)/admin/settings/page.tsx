import React from "react";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/rbac";
import { ROLES } from "@/lib/constants/roles";
import AdminSettingsClient from "@/components/admin/settings/AdminSettingsClient";

export const metadata = {
  title: "System Settings | Felna Admin Console",
  description: "Configure site settings, brand assets, contact operations, and security parameters.",
};

export default async function AdminSettingsPage() {
  try {
    await requireRole(ROLES.ADMIN);
  } catch {
    redirect("/forbidden");
  }

  return <AdminSettingsClient />;
}
