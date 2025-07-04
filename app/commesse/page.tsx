import WorkItemsTable from "@/components/work-item/work-items-table";
import { getAllClients } from "@/server/client/getAllClients";
import { fetchAllWorkItems } from "@/server/work-item/fetchAllWorkItems";
import { allowRoles } from "@/services/users/server.utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Commesse | Bitrock Hours",
  description: "Gestione delle commesse e attività lavorative",
};

export default async function WorkItemsPage() {
  const workItems = await fetchAllWorkItems();
  const allClients = await getAllClients();
  const isAdminOrSuperAdmin = await allowRoles(["Admin", "Super_Admin"]);

  return (
    <div className="space-y-6">
      <WorkItemsTable
        workItems={workItems}
        allClients={allClients}
        isAdminOrSuperAdmin={isAdminOrSuperAdmin}
      />
    </div>
  );
}
