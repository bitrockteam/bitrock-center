import { findUserById } from "@/api/server/user/findUserById";
import UserDetail from "@/components/users/user-detail";
import type { Metadata } from "next";

// export const dynamic = "force-dynamic";

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

  return (
    <div className="space-y-6 h-full w-full">
      <UserDetail user={user} />
    </div>
  );
}
