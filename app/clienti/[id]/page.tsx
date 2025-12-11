import type { Metadata } from "next";
import ClientDetail from "@/components/client/client-detail";
import { Permissions } from "@/db";
import { hasPermission } from "@/services/users/server.utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dettaglio Cliente | Bitrock Hours",
  description: "Visualizza i dettagli del cliente",
};

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const CAN_EDIT_CLIENT = await hasPermission(Permissions.CAN_EDIT_CLIENT);
  return (
    <div className="space-y-6">
      <ClientDetail id={id} canEditClient={CAN_EDIT_CLIENT} />
    </div>
  );
}
