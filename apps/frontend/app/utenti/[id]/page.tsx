import UserDetail from "@/components/users/user-detail";
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
  return (
    <div className="space-y-6">
      <UserDetail id={id} />
    </div>
  );
}
