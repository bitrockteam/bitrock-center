import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { useState } from "react";

export const useUpdateRoleForUser = () => {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const updateRoleForUser = async (userId: string, roleId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${SERVERL_BASE_URL}/role/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ roleId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role for user");
      }

      setIsLoading(false);
      return response.json();
    } catch (error) {
      console.error("Error updating role for user:", error);
      setIsLoading(false);
    }
  };

  return { isLoading, updateRoleForUser };
};
