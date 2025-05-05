import type { Metadata } from "next";
import PermitRequestForm from "@/components/permits/permit-form";
import PermitHistoryTable from "@/components/permits/permit-history-table";
import PermitHeader from "@/components/permits/permit-header";
import PermitApprovalTable from "@/components/permits/permit-approval";

export const metadata: Metadata = {
  title: "Ferie e Permessi | Bitrock Hours",
  description: "Gestione delle richieste di ferie e permessi",
};

export default function LeavePage() {
  return (
    <div className="space-y-6">
      <PermitHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PermitRequestForm />
        </div>
        <div className="lg:col-span-2">
          <PermitHistoryTable />
        </div>
        <div className="lg:col-span-3">
          <PermitApprovalTable />
        </div>
      </div>
    </div>
  );
}
