import React from "react";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/rbac";
import { ROLES } from "@/lib/constants/roles";
import AdminRbacClient from "@/components/admin/rbac/AdminRbacClient";

export const metadata = {
  title: "Role & RBAC Management | Felna Admin Console",
  description: "Manage system roles, granular capabilities, and administrative privileges.",
};

export default async function AdminRbacPage() {
  try {
    await requireRole(ROLES.ADMIN);
  } catch {
    redirect("/forbidden");
  }

  return <AdminRbacClient />;
}
