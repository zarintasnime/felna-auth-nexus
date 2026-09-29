import React from "react";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/rbac";
import { ROLES } from "@/lib/constants/roles";
import AdminGeoClient from "@/components/admin/geo/AdminGeoClient";

export const metadata = {
  title: "Geographic Hierarchy | Felna Admin Console",
  description: "Explore administrative divisions, districts, and thanas across Bangladesh.",
};

export default async function AdminGeoPage() {
  try {
    await requireRole(ROLES.ADMIN);
  } catch {
    redirect("/forbidden");
  }

  return <AdminGeoClient />;
}
