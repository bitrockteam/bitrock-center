import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { IPermit, IPermitUpsert } from "@bitrock/types";

export const useCreatePermit = () => {
  const { session } = useAuth();

  const createPermit = async (data: IPermitUpsert): Promise<IPermit | null> => {
    try {
      const res = await fetch(`${SERVERL_BASE_URL}/permits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Permit creation failed");

      const result = await res.json();
      return result.permit;
    } catch (error) {
      console.error("Error creating permit:", error);
      return null;
    }
  };

  return { createPermit };
};
