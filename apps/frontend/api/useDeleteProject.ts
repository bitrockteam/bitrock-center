import { useState } from "react";
import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";

export function useDeleteProject() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const deleteProject = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${SERVERL_BASE_URL}/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete project");
      }

      return true;
    } catch (error) {
      console.error("Delete project error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteProject, isLoading };
}
