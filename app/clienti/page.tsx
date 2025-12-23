import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ClientsPageClient from "./clients-page-client";
import { Permissions } from "@/db";
import { hasPermission } from "@/services/users/server.utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clienti | Bitrock Hours",
  description: "Gestione dei clienti aziendali",
};

export default async function ClientsPage() {
  const CAN_CREATE_CLIENT = await hasPermission(Permissions.CAN_CREATE_CLIENT);
  const CAN_EDIT_CLIENT = await hasPermission(Permissions.CAN_EDIT_CLIENT);
  const CAN_SEE_CLIENT = await hasPermission(Permissions.CAN_SEE_CLIENT);

  if (!CAN_SEE_CLIENT) {
    redirect("/dashboard");
  }

  return <ClientsPageClient canCreateClient={CAN_CREATE_CLIENT} canEditClient={CAN_EDIT_CLIENT} />;
}
