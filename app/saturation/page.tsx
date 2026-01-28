import { fetchSaturationData } from "@/app/server-actions/saturation/fetchSaturationData";
import { Permissions } from "@/db";
import { hasPermission } from "@/services/users/server.utils";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SaturationPageClient } from "./saturation-page-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Saturation | Bitrock Center",
  description: "Employee allocation and saturation dashboard",
};

export default async function SaturationPage() {
  await getUserInfoFromCookie();

  const canSeeSaturation = await hasPermission(Permissions.CAN_SEE_SATURATION);

  if (!canSeeSaturation) {
    redirect("/dashboard");
  }

  const [employees, canAllocate] = await Promise.all([
    fetchSaturationData(),
    hasPermission(Permissions.CAN_ALLOCATE_RESOURCE),
  ]);

  return <SaturationPageClient initialEmployees={employees} canAllocate={canAllocate} />;
}
