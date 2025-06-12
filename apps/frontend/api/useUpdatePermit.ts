import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { permit } from "@bitrock/db";

export const useUpdatePermit = () => {
  const { session } = useAuth();

  const updatePermit = async (
    id: string,
    data: Omit<permit, "id" | "create_at">,
  ) => {
    try {
      const res = await fetch(`${SERVERL_BASE_URL}/permits/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ ...data, id }),
      });

      if (!res.ok) throw new Error("Permit update failed");

      const result = await res.json();
      return result.permit;
    } catch (error) {
      console.error("Error updating permit:", error);
      return null;
    }
  };

  return { updatePermit };
};
