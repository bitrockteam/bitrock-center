import { fetchAllAllocations } from "@/app/server-actions/allocation/fetchAllAllocations";
import { Permissions } from "@/db";
import { hasPermission } from "@/services/users/server.utils";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AllocationsPageClient from "./allocations-page-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Allocazioni | Bitrock Hours",
  description: "Gestisci le allocazioni degli utenti alle commesse",
};

export default async function AllocationsPage() {
  await getUserInfoFromCookie();
  const canAllocate = await hasPermission(Permissions.CAN_ALLOCATE_RESOURCE);

  if (!canAllocate) {
    redirect("/dashboard");
  }

  const initialAllocations = await fetchAllAllocations();

  return <AllocationsPageClient initialAllocations={initialAllocations} />;
}
