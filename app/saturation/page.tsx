import { fetchSaturationData } from "@/app/server-actions/saturation/fetchSaturationData";
import SaturationHeader from "@/components/saturation/saturation-header";
import SaturationProjections from "@/components/saturation/saturation-projections";
import SaturationSummary from "@/components/saturation/saturation-summary";
import SaturationTimeline from "@/components/saturation/saturation-timeline";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { SaturationPageClient } from "./saturation-page-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Saturation | Bitrock Center",
  description: "Employee allocation and saturation dashboard",
};

export default async function SaturationPage() {
  await getUserInfoFromCookie();
  const employees = await fetchSaturationData();

  return <SaturationPageClient initialEmployees={employees} />;
}

