import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { project } from "@bitrock/db";

export function useEditProject() {
  const { session } = useAuth();
  const editProject = (
    project: Omit<project, "id" | "created_at">,
    id: string,
  ) =>
    fetch(`${SERVERL_BASE_URL}/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(project),
    })
      .then((res) => res.json())
      .then((data) => data as project);

  return { editProject };
}
