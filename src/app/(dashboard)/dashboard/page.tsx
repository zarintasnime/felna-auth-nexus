import React from "react";
import { requireAuth } from "@/lib/rbac";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import UserDashboardClient from "@/components/dashboard/UserDashboardClient";

export default async function DashboardPage() {
  let session;
  try {
    session = await requireAuth();
  } catch {
    redirect("/login");
  }

  // Fetch full user record with geographic relations
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      address: true,
      divisionId: true,
      districtId: true,
      upazilaId: true,
      division: { select: { id: true, name: true } },
      district: { select: { id: true, name: true } },
      upazila: { select: { id: true, name: true } },
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return <UserDashboardClient initialUser={user} />;
}
