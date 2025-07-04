import PermitRequestForm from "@/components/permits/permit-form";
import PermitHeader from "@/components/permits/permit-header";
import { allowRoles } from "@/services/users/server.utils";
import type { Metadata } from "next";
import { Suspense } from "react";
import PermitApproval from "./permit-approval";
import PermitHistory from "./permit-history";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ferie e Permessi | Bitrock Hours",
  description: "Gestione delle richieste di ferie e permessi",
};

export default async function LeavePage() {
  const isReferent = await allowRoles([
    "Admin",
    "Super_Admin",
    "Manager",
    "Key_Client",
  ]);

  return (
    <div className="space-y-6">
      <PermitHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PermitRequestForm />
        </div>
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-96">Loading...</div>}>
            <PermitHistory />
          </Suspense>
        </div>
        {isReferent && (
          <div className="lg:col-span-3">
            <PermitApproval />
          </div>
        )}
      </div>
    </div>
  );
}
