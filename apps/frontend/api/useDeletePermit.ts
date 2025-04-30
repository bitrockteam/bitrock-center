import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";

export const useDeletePermit = () => {
  const { session } = useAuth();

  const deletePermit = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${SERVERL_BASE_URL}/permits/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      return res.ok;
    } catch (error) {
      console.error("Error deleting permit:", error);
      return false;
    }
  };

  return { deletePermit };
};
