import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { IPermit } from "@bitrock/types";
import { useCallback, useEffect, useState } from "react";

export const useGetPermitsByUser = (userId?: string) => {
  const [permits, setPermits] = useState<IPermit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  const refetch = useCallback(() => {
    setIsLoading(true);
    fetch(`${SERVERL_BASE_URL}/permits/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((res) => res.json())
      .then(setPermits)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [session, userId]);

  useEffect(() => {
    if (session?.access_token && userId) refetch();
  }, [refetch, session?.access_token, userId]);

  return { permits, isLoading, refetch };
};
