import { findUsers } from "@/api/server/user/findUsers";
import UsersHeader from "@/components/users/users-header";
import UsersTable from "@/components/users/users-table";
import { allowRoles } from "@/services/users/server.utils";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    params?: string;
  }>;
}) {
  const { params } = await searchParams;
  const users = await findUsers(params);
  const user = await getUserInfoFromCookie();
  const isAdminOrSuperAdmin = await allowRoles(["Admin", "Super_Admin"]);

  const revalidate = async () => {
    "use server";
    revalidatePath(`/utenti`);
  };

  return (
    <div className="space-y-6">
      <UsersHeader user={user} isAdminOrSuperAdmin={isAdminOrSuperAdmin} />
      <UsersTable users={users} refetch={revalidate} user={user} />
    </div>
  );
}

export const dynamic = "force-dynamic";
