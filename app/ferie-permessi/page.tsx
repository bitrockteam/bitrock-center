import PermitContainer from "@/components/permits/permit-container";
import PermitHeader from "@/components/permits/permit-header";
import { allowRoles } from "@/services/users/server.utils";
import type { Metadata } from "next";
import PermitApproval from "./permit-approval";

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
      <PermitContainer />
      {isReferent && <PermitApproval />}
    </div>
  );
}
