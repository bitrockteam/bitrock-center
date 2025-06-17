import { findUsers } from "@/api/server/user/findUsers";
import UsersHeader from "@/components/users/users-header";
import UsersTable from "@/components/users/users-table";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    params?: string;
  }>;
}) {
  const { params } = await searchParams;
  const users = await findUsers(params);

  return (
    <div className="space-y-6">
      <UsersHeader />
      <UsersTable users={users} />
    </div>
  );
}
