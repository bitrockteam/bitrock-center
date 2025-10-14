import { findUsersWithProjects } from "@/app/server-actions/user/findUsersWithProjects";
import UsersHeader from "@/components/users/users-header";
import UsersTable from "@/components/users/users-table";
import { hasPermission } from "@/services/users/server.utils";
import { Permissions } from "@/db";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    params?: string;
  }>;
}) {
  const { params } = await searchParams;
  const users = await findUsersWithProjects(params);
  const user = await getUserInfoFromCookie();
  const CAN_CREATE_USER = await hasPermission(Permissions.CAN_CREATE_USER);

  const revalidate = async () => {
    "use server";
    revalidatePath(`/utenti`);
  };

  return (
    <div className="space-y-6">
      <UsersHeader user={user} canCreateUser={CAN_CREATE_USER} />
      <UsersTable users={users} refetch={revalidate} user={user} />
    </div>
  );
}
