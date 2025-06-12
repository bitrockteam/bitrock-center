import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { project } from "@bitrock/db";

export function useCreateProject() {
  const { session } = useAuth();
  const createProject = (project: Omit<project, "id" | "created_at">) =>
    fetch(`${SERVERL_BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(project),
    });

  return { createProject };
}
