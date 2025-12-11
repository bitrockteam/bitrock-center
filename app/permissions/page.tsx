import { getPermissions } from "@/app/server-actions/permission/getPermissions";
import PermissionsContent from "@/components/permissions/permissions-content";
import { Permissions } from "@/db";
import { hasPermission } from "@/services/users/server.utils";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PermissionsPage() {
  const [data] = await Promise.all([getPermissions()]);
  const CAN_SEE_PERMISSIONS = await hasPermission(Permissions.CAN_SEE_PERMISSIONS);

  if (!CAN_SEE_PERMISSIONS) redirect("/dashboard");

  return <PermissionsContent permissions={data} />;
}
