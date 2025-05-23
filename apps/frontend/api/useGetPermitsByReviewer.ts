import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { IPermit } from "@bitrock/types";
import { useCallback, useEffect, useState } from "react";

export const useGetPermitsByReviewer = (reviewerId: string) => {
  const [permits, setPermits] = useState<IPermit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  const refetch = useCallback(() => {
    setIsLoading(true);
    fetch(`${SERVERL_BASE_URL}/permits/reviewer/${reviewerId}`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((res) => res.json())
      .then(setPermits)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [session, reviewerId]);

  useEffect(() => {
    if (session?.access_token) refetch();
  }, [refetch, session?.access_token]);

  return { permits, isLoading, refetch };
};
