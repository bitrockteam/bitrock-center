import { useState } from "react";
import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";

export function useDeleteAllocation() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const deleteAllocation = async (
    project_id: string,
    user_id: string,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${SERVERL_BASE_URL}/allocation/${project_id}/${user_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete allocation");
      }

      return true;
    } catch (error) {
      console.error("Delete allocation error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteAllocation, isLoading };
}
