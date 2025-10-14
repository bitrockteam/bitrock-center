import { tryGetUserInfoFromCookie } from "@/utils/supabase/server";
import Sidebar from "./sidebar";

export default async function MainContainer({
  user,
  children,
}: {
  children: React.ReactNode;
  user: Awaited<ReturnType<typeof tryGetUserInfoFromCookie>>;
}) {
  return (
    <div className="flex h-screen">
      {user && <Sidebar user={user} permissions={user.permissions} />}
      <div className="flex-1 overflow-auto">
        <main className="container py-4 mx-auto px-4 h-full">{children}</main>
      </div>
    </div>
  );
}
