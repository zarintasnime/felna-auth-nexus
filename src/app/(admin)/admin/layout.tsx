import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ROLES } from "@/lib/constants/roles";
import DashboardLayout from "@/components/admin/DashboardLayout";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login?from=/admin/dashboard");
  }

  if (session.role !== ROLES.ADMIN) {
    redirect("/forbidden");
  }

  return (
    <DashboardLayout
      session={{
        userId: session.userId,
        name: session.name || "Super Admin",
        phone: session.phone,
        role: session.role,
      }}
    >
      {children}
    </DashboardLayout>
  );
}


// fff