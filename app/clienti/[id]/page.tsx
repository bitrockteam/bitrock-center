import ClientDetail from "@/components/client/client-detail";
import { allowRoles } from "@/services/users/server.utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dettaglio Cliente | Bitrock Hours",
  description: "Visualizza i dettagli del cliente",
};

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isAdminOrSuperAdmin = await allowRoles(["Admin", "Super_Admin"]);
  return (
    <div className="space-y-6">
      <ClientDetail id={id} isAdminOrSuperAdmin={isAdminOrSuperAdmin} />
    </div>
  );
}
