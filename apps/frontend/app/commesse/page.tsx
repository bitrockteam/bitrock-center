import WorkItemsTable from "@/components/work-item/work-items-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commesse | Bitrock Hours",
  description: "Gestione delle commesse e attività lavorative",
};

export default function WorkItemsPage() {
  return (
    <div className="space-y-6">
      <WorkItemsTable />
    </div>
  );
}
