import ClientsHeader from "@/components/client/clients-header";
import ClientsTable from "@/components/client/clients-table";
import { hasPermission } from "@/services/users/server.utils";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clienti | Bitrock Hours",
  description: "Gestione dei clienti aziendali",
};

export default async function ClientsPage() {
  const CAN_CREATE_CLIENT = await hasPermission("CAN_CREATE_CLIENT");
  const CAN_EDIT_CLIENT = await hasPermission("CAN_EDIT_CLIENT");
  const CAN_SEE_CLIENT = await hasPermission("CAN_SEE_CLIENT");

  if (!CAN_SEE_CLIENT) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <ClientsHeader canCreateClient={CAN_CREATE_CLIENT} />
      <ClientsTable canEditClient={CAN_EDIT_CLIENT} />
    </div>
  );
}
