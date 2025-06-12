import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { allocation } from "@bitrock/db";

export function useCreateAllocation() {
  const { session } = useAuth();
  const createAllocation = (
    allocation: Omit<allocation, "id" | "created_at">,
  ) =>
    fetch(`${SERVERL_BASE_URL}/allocation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(allocation),
    })
      .then((res) => res.json())
      .then((data) => data as Omit<allocation, "id" | "created_at">);

  return { createAllocation };
}
