import { fetchReferent } from "@/api/server/user/fetchReferent";
import PermitApprovalTable from "@/components/permits/permit-approval";
import PermitRequestForm from "@/components/permits/permit-form";
import PermitHeader from "@/components/permits/permit-header";
import PermitHistoryTable from "@/components/permits/permit-history-table";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ferie e Permessi | Bitrock Hours",
  description: "Gestione delle richieste di ferie e permessi",
};

export default async function LeavePage() {
  const user = await getUserInfoFromCookie();
  const usersListReferent = await fetchReferent();
  return (
    <div className="space-y-6">
      <PermitHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PermitRequestForm user={user} />
        </div>
        <div className="lg:col-span-2">
          <PermitHistoryTable />
        </div>
        {(user.role === "Admin" ||
          user.role === "Key_Client" ||
          usersListReferent.length > 0) && (
          <div className="lg:col-span-3">
            <PermitApprovalTable user={user} />
          </div>
        )}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
