import { fetchOrgUsers } from "@/app/server-actions/organigramma/fetchOrgUsers";
import { OrganigrammaTabs } from "@/components/organigramma/organigramma-tabs";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Organigramma | Bitrock Hours",
  description: "Visualizza la struttura organizzativa di Fortitude Group",
};

export default async function OrganigrammaPage() {
  const users = await fetchOrgUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organigramma</h1>
          <p className="text-muted-foreground mt-2">
            Struttura organizzativa di Fortitude Group
          </p>
        </div>
      </div>
      <OrganigrammaTabs users={users} />
    </div>
  );
}
