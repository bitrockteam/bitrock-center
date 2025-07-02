import { findUsers } from "@/api/server/user/findUsers";
import { fetchAllWorkItems } from "@/api/server/work-item/fetchAllWorkItems";
import WorkItemsTable from "@/components/work-item/work-items-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commesse | Bitrock Hours",
  description: "Gestione delle commesse e attività lavorative",
};

export default async function WorkItemsPage() {
  const workItems = await fetchAllWorkItems();
  const allClients = await findUsers();

  return (
    <div className="space-y-6">
      <WorkItemsTable workItems={workItems} allClients={allClients} />
    </div>
  );
}
