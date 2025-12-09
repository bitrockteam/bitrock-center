import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { fetchWorkItemById } from "@/app/server-actions/work-item/fetchWorkItemById";
import WorkItemDetail from "@/components/work-item/work-item-detail";
import { Permissions } from "@/db";
import { hasPermission } from "@/services/users/server.utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dettaglio Commessa | Bitrock Hours",
  description: "Visualizza i dettagli della commessa",
};

export default async function WorkItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const CAN_EDIT_WORK_ITEM = await hasPermission(Permissions.CAN_EDIT_WORK_ITEM);
  const workItem = await fetchWorkItemById({ workItemId: id });
  if (!workItem) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Commessa non trovata</h2>
        <p className="text-muted-foreground mb-4">
          La commessa richiesta non esiste o è stata rimossa.
        </p>
        <Link href="/commesse" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna alle Commesse
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WorkItemDetail workItem={workItem} canEditWorkItem={CAN_EDIT_WORK_ITEM} />
    </div>
  );
}
