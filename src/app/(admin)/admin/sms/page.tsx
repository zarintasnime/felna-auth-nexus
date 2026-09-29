import React from "react";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/rbac";
import { ROLES } from "@/lib/constants/roles";
import AdminSmsClient from "@/components/admin/sms/AdminSmsClient";

export const metadata = {
  title: "SMS & Gateway Management | Felna Admin Console",
  description: "Monitor and configure the IGL telecom SMS Gateway and review OTP verification health.",
};

export default async function AdminSmsPage() {
  try {
    await requireRole(ROLES.ADMIN);
  } catch {
    redirect("/forbidden");
  }

  return <AdminSmsClient />;
}
