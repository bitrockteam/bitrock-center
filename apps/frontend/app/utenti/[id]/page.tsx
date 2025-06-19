import UserDetail from "@/components/users/user-detail";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import type { Metadata } from "next";

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
  const user = await getUserInfoFromCookie();
  return (
    <div className="space-y-6 h-full w-full">
      <UserDetail id={id} userData={user} />
    </div>
  );
}

export const dynamic = "force-dynamic";
