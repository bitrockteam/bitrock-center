import type { tryGetUserInfoFromCookie } from "@/utils/supabase/server";
import type { ReactNode } from "react";
import packageJson from "../package.json";
import Sidebar from "./sidebar";

export default async function MainContainer({
  user,
  children,
}: {
  children: ReactNode;
  user: Awaited<ReturnType<typeof tryGetUserInfoFromCookie>>;
}) {
  return (
    <div className="flex h-screen">
      {user && (
        <Sidebar
          user={user}
          permissions={user.permissions}
          version={packageJson.version}
        />
      )}
      <div className="flex-1 overflow-auto">
        <main className="container py-4 mx-auto px-4 h-full">{children}</main>
      </div>
    </div>
  );
}
