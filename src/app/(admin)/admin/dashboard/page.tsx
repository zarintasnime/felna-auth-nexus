import React, { Suspense } from "react";
import { requireRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { ROLES, USER_STATUS } from "@/lib/constants/roles";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export default async function AdminDashboardPage() {
  let session;
  try {
    session = await requireRole(ROLES.ADMIN);
  } catch {
    redirect("/forbidden");
  }

  // Fetch initial users and metrics from live database
  const [users, total, active, pending, suspended] = await Promise.all([
    db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        address: true,
        division: { select: { name: true } },
        district: { select: { name: true } },
        upazila: { select: { name: true } },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.user.count(),
    db.user.count({ where: { status: USER_STATUS.ACTIVE } }),
    db.user.count({ where: { status: USER_STATUS.PENDING_VERIFICATION } }),
    db.user.count({ where: { status: USER_STATUS.SUSPENDED } }),
  ]);

  const metrics = {
    total,
    active,
    pending,
    suspended,
  };

  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-slate-400">Loading admin console...</div>
      }
    >
      <AdminDashboardClient
        currentAdminId={session.userId}
        initialUsers={users}
        initialMetrics={metrics}
      />
    </Suspense>
  );
}
