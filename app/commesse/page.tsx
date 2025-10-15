import { getAllClients } from "@/app/server-actions/client/getAllClients";
import { fetchAllWorkItems } from "@/app/server-actions/work-item/fetchAllWorkItems";
import WorkItemsTable from "@/components/work-item/work-items-table";
import { hasPermission } from "@/services/users/server.utils";
import { Permissions } from "@/db";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Commesse | Bitrock Hours",
  description: "Gestione delle commesse e attività lavorative",
};

export default async function WorkItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const workItems = await fetchAllWorkItems(q);
  const allClients = await getAllClients();
  const CAN_CREATE_WORK_ITEM = await hasPermission(
    Permissions.CAN_CREATE_WORK_ITEM,
  );
  const CAN_EDIT_WORK_ITEM = await hasPermission(
    Permissions.CAN_EDIT_WORK_ITEM,
  );
  const CAN_SEE_WORK_ITEM = await hasPermission(Permissions.CAN_SEE_WORK_ITEM);

  if (!CAN_SEE_WORK_ITEM) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <WorkItemsTable
        workItems={workItems}
        allClients={allClients}
        canCreateWorkItem={CAN_CREATE_WORK_ITEM}
        canEditWorkItem={CAN_EDIT_WORK_ITEM}
      />
    </div>
  );
}
