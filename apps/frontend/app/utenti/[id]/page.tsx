import { fetchAllProjects } from "@/api/server/project/fetchAllProjects";
import { findUserById } from "@/api/server/user/findUserById";
import { findUsers } from "@/api/server/user/findUsers";
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
  const users = await findUsers();
  const user = await findUserById(id);
  const projects = await fetchAllProjects();
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Utente non trovato</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full w-full">
      <UserDetail id={id} userById={user} users={users} projects={projects} />
    </div>
  );
}
