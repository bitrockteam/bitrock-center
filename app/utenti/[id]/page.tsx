import { findUserById } from "@/app/server-actions/user/findUserById";
import UserDetail from "@/components/users/user-detail";
import { Permissions } from "@/db";
import { hasPermission } from "@/services/users/server.utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dettaglio Utente | Bitrock Hours",
  description: "Visualizza i dettagli dell'utente",
};

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await findUserById(id);
  const CAN_DEAL_PERMISSIONS = await hasPermission(
    Permissions.CAN_DEAL_PERMISSIONS,
  );

  return (
    <div className="space-y-6 h-full w-full">
      <UserDetail user={user} canDealPermissions={CAN_DEAL_PERMISSIONS} />
    </div>
  );
}
