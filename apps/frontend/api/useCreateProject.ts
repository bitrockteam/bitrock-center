import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { IProjectUpsert, IProject } from "@bitrock/types";

export function useCreateProject() {
  const { session } = useAuth();
  const createProject = (project: IProjectUpsert) =>
    fetch(`${SERVERL_BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(project),
    })
      .then((res) => res.json())
      .then((data) => data as IProject);

  return { createProject };
}
