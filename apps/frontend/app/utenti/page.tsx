import { findUsers } from "@/api/server/user/findUsers";
import UsersHeader from "@/components/users/users-header";
import UsersTable from "@/components/users/users-table";
import { revalidatePath } from "next/cache";

export default async function UsersPage() {
  const users = await findUsers();
  const refetchUsers = async () => {
    "use server";
    // invalidate the cache or refetch the users
    revalidatePath("/utenti");
  };
  return (
    <div className="space-y-6">
      <UsersHeader refetchUsers={refetchUsers} />
      <UsersTable users={users} refetchUsers={refetchUsers} />
    </div>
  );
}
