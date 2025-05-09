import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { ICreateAllocation } from "@bitrock/types";
import { useApiCall } from "@/api/useApiCall";

export function useCreateAllocation() {
  const { session } = useAuth();
  const createAllocation = (allocation: ICreateAllocation) =>
    fetch(`${SERVERL_BASE_URL}/allocation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(allocation),
    })

  const { error, isLoading, execute } = useApiCall(createAllocation);

  return { error, isLoading, execute };
}
