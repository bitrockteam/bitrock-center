import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";

export const useChangePermitStatus = () => {
  const { session } = useAuth();

  const changeStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `${SERVERL_BASE_URL}/permits/change-status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      return res.ok;
    } catch (error) {
      console.error("Failed to update permit status:", error);
      return false;
    }
  };

  return { changeStatus };
};
